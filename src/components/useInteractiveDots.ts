'use client'

import { useEffect, RefObject } from 'react'

export interface Dot {
  x: number
  y: number
  currentRadius: number
  targetRadius: number
  currentAlpha: number
  targetAlpha: number
}

export const SPACING = 30
export const RESTING_RADIUS = 1.0
export const MAX_RADIUS = 2.0
export const INFLUENCE_RADIUS = 135

export const LIGHT_COLOR = '67, 56, 202'
export const LIGHT_RESTING_ALPHA = 0.35
export const LIGHT_MAX_ALPHA = 0.95

export const DARK_COLOR = '180, 166, 255'
export const DARK_RESTING_ALPHA = 0.38
export const DARK_MAX_ALPHA = 0.98

export function getThemeTokens() {
  const dark =
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  return {
    colorRgb: dark ? DARK_COLOR : LIGHT_COLOR,
    restingAlpha: dark ? DARK_RESTING_ALPHA : LIGHT_RESTING_ALPHA,
    maxAlpha: dark ? DARK_MAX_ALPHA : LIGHT_MAX_ALPHA,
  }
}

export function generateDots(width: number, height: number, restingAlpha: number): Dot[] {
  const cols = Math.floor(width / SPACING)
  const rows = Math.floor(height / SPACING)
  const startX = (width - (cols - 1) * SPACING) / 2
  const startY = (height - (rows - 1) * SPACING) / 2
  const dots: Dot[] = []

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push({
        x: Math.round(startX + c * SPACING),
        y: Math.round(startY + r * SPACING),
        currentRadius: RESTING_RADIUS,
        targetRadius: RESTING_RADIUS,
        currentAlpha: restingAlpha,
        targetAlpha: restingAlpha,
      })
    }
  }
  return dots
}

export function drawStaticGrid(
  ctx: CanvasRenderingContext2D,
  dots: Dot[],
  width: number,
  height: number,
  colorRgb: string,
  restingAlpha: number
) {
  ctx.clearRect(0, 0, width, height)
  for (const d of dots) {
    d.currentRadius = RESTING_RADIUS
    d.targetRadius = RESTING_RADIUS
    d.currentAlpha = restingAlpha
    d.targetAlpha = restingAlpha

    ctx.beginPath()
    ctx.arc(d.x, d.y, RESTING_RADIUS, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${colorRgb}, ${restingAlpha})`
    ctx.fill()
  }
}

export function stepDotPhysics(
  dot: Dot,
  isPointerInside: boolean,
  px: number,
  py: number,
  restingAlpha: number,
  maxAlpha: number
): boolean {
  if (isPointerInside) {
    const dist = Math.hypot(dot.x - px, dot.y - py)
    if (dist < INFLUENCE_RADIUS) {
      const factor = Math.cos((dist / INFLUENCE_RADIUS) * (Math.PI / 2))
      dot.targetRadius = RESTING_RADIUS + (MAX_RADIUS - RESTING_RADIUS) * factor
      dot.targetAlpha = restingAlpha + (maxAlpha - restingAlpha) * factor
    } else {
      dot.targetRadius = RESTING_RADIUS
      dot.targetAlpha = restingAlpha
    }
  } else {
    dot.targetRadius = RESTING_RADIUS
    dot.targetAlpha = restingAlpha
  }

  const deltaRadius = dot.targetRadius - dot.currentRadius
  const deltaAlpha = dot.targetAlpha - dot.currentAlpha

  if (Math.abs(deltaRadius) > 0.008 || Math.abs(deltaAlpha) > 0.005) {
    dot.currentRadius += deltaRadius * 0.25
    dot.currentAlpha += deltaAlpha * 0.25
    return true
  }

  dot.currentRadius = dot.targetRadius
  dot.currentAlpha = dot.targetAlpha
  return false
}

export function renderAnimatedGrid(
  ctx: CanvasRenderingContext2D,
  dots: Dot[],
  width: number,
  height: number,
  isPointerInside: boolean,
  px: number,
  py: number,
  colorRgb: string,
  restingAlpha: number,
  maxAlpha: number
): boolean {
  ctx.clearRect(0, 0, width, height)
  let hasActiveTransitions = false

  for (const dot of dots) {
    if (stepDotPhysics(dot, isPointerInside, px, py, restingAlpha, maxAlpha)) {
      hasActiveTransitions = true
    }

    ctx.beginPath()
    ctx.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${colorRgb}, ${dot.currentAlpha.toFixed(3)})`
    ctx.fill()
  }

  return hasActiveTransitions
}

interface CanvasState {
  dots: Dot[]
  width: number
  height: number
  pointerX: number
  pointerY: number
  isPointerInside: boolean
  isAnimating: boolean
  rafId: number | null
}

function updateCanvasDimensions(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  container: HTMLElement,
  state: CanvasState
) {
  const rect = container.getBoundingClientRect()
  state.width = rect.width
  state.height = rect.height
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(state.width * dpr)
  canvas.height = Math.round(state.height * dpr)
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.scale(dpr, dpr)

  const { restingAlpha, colorRgb } = getThemeTokens()
  state.dots = generateDots(state.width, state.height, restingAlpha)
  drawStaticGrid(ctx, state.dots, state.width, state.height, colorRgb, restingAlpha)
}

function attachPointerTracking(
  container: HTMLElement,
  state: CanvasState,
  wakeAnimation: () => void
) {
  const onPointerMove = (e: MouseEvent | PointerEvent) => {
    if ('pointerType' in e && e.pointerType === 'touch') return
    const rect = container.getBoundingClientRect()
    state.pointerX = e.clientX - rect.left
    state.pointerY = e.clientY - rect.top
    state.isPointerInside = true
    wakeAnimation()
  }

  const onPointerLeave = () => {
    state.isPointerInside = false
    wakeAnimation()
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('mousemove', onPointerMove, { passive: true })
    document.addEventListener('mouseleave', onPointerLeave, { passive: true })
    window.addEventListener('blur', onPointerLeave, { passive: true })
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('mousemove', onPointerMove)
      document.removeEventListener('mouseleave', onPointerLeave)
      window.removeEventListener('blur', onPointerLeave)
    }
  }
}

function setupGridObservers(
  container: HTMLElement,
  ctx: CanvasRenderingContext2D,
  state: CanvasState,
  initGrid: () => void
) {
  const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(initGrid) : null
  if (resizeObserver) resizeObserver.observe(container)

  const mutationObserver =
    typeof MutationObserver !== 'undefined'
      ? new MutationObserver(() => {
          if (!state.isAnimating) {
            const { colorRgb, restingAlpha } = getThemeTokens()
            drawStaticGrid(ctx, state.dots, state.width, state.height, colorRgb, restingAlpha)
          }
        })
      : null
  if (mutationObserver) {
    mutationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
  }

  return () => {
    if (resizeObserver) resizeObserver.disconnect()
    if (mutationObserver) mutationObserver.disconnect()
  }
}

export function useInteractiveDotsCanvas(
  containerRef: RefObject<HTMLDivElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>
) {
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state: CanvasState = {
      dots: [],
      width: 0,
      height: 0,
      pointerX: -9999,
      pointerY: -9999,
      isPointerInside: false,
      isAnimating: false,
      rafId: null,
    }

    const initGrid = () => updateCanvasDimensions(canvas, ctx, container, state)

    const renderLoop = () => {
      if (!state.isAnimating) return
      const { colorRgb, restingAlpha, maxAlpha } = getThemeTokens()
      const hasTransitions = renderAnimatedGrid(
        ctx,
        state.dots,
        state.width,
        state.height,
        state.isPointerInside,
        state.pointerX,
        state.pointerY,
        colorRgb,
        restingAlpha,
        maxAlpha
      )
      if (hasTransitions || state.isPointerInside) {
        state.rafId = requestAnimationFrame(renderLoop)
      } else {
        state.isAnimating = false
        state.rafId = null
      }
    }

    const wakeAnimation = () => {
      if (!state.isAnimating) {
        state.isAnimating = true
        state.rafId = requestAnimationFrame(renderLoop)
      }
    }

    const cleanupPointer = attachPointerTracking(container, state, wakeAnimation)
    const cleanupObservers = setupGridObservers(container, ctx, state, initGrid)
    window.addEventListener('resize', initGrid, { passive: true })

    initGrid()

    return () => {
      if (state.rafId) cancelAnimationFrame(state.rafId)
      cleanupPointer()
      cleanupObservers()
      window.removeEventListener('resize', initGrid)
    }
  }, [containerRef, canvasRef])
}
