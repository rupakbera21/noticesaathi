// src/components/useRegularGlassCursor.ts
'use client'

import { useEffect, useRef } from 'react'
import { toCanvas } from 'html-to-image'
import { RegularGlassRenderer } from './RegularGlassRenderer'
import { REGULAR_GLASS_DEFAULTS, SHADOW_PAD } from './regularGlassShader'

interface SampleParams {
  mouseX: number
  mouseY: number
  circleWidth: number
  circleHeight: number
  dpr: number
}

async function captureAndCropBackground(
  params: SampleParams,
  cropCanvas: HTMLCanvasElement
): Promise<boolean> {
  const { mouseX, mouseY, circleWidth, circleHeight, dpr } = params
  const totalSampleW = circleWidth + SHADOW_PAD * 2
  const totalSampleH = circleHeight + SHADOW_PAD * 2
  const sampleLeft = Math.round(mouseX - totalSampleW / 2)
  const sampleTop = Math.round(mouseY - totalSampleH / 2)

  const interactiveEl = document
    .elementFromPoint(mouseX, mouseY)
    ?.closest(
      'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [role="button"]:not([aria-disabled="true"]), [data-interactive="true"], summary'
    ) as HTMLElement | null

  const targetNode = interactiveEl || document.body
  const isDark = document.documentElement.classList.contains('dark')

  cropCanvas.width = Math.round(totalSampleW * dpr)
  cropCanvas.height = Math.round(totalSampleH * dpr)
  const cropCtx = cropCanvas.getContext('2d')
  if (!cropCtx) return false

  cropCtx.fillStyle = isDark ? '#080914' : '#f8f8fb'
  cropCtx.fillRect(0, 0, cropCanvas.width, cropCanvas.height)

  const captured = await toCanvas(targetNode, {
    pixelRatio: dpr,
    skipFonts: true,
    filter: node => {
      if (node instanceof HTMLElement && node.dataset['cursorLayer']) {
        return false
      }
      return true
    },
  })

  const targetRect = targetNode.getBoundingClientRect()
  const destX = Math.round((targetRect.left - sampleLeft) * dpr)
  const destY = Math.round((targetRect.top - sampleTop) * dpr)

  cropCtx.drawImage(captured, destX, destY)
  return true
}

function copyGlassToDest(
  renderer: RegularGlassRenderer,
  destCanvas: HTMLCanvasElement,
  totalSampleW: number,
  totalSampleH: number,
  dpr: number
) {
  destCanvas.width = Math.round(totalSampleW * dpr)
  destCanvas.height = Math.round(totalSampleH * dpr)
  const destCtx = destCanvas.getContext('2d')
  if (destCtx) {
    destCtx.clearRect(0, 0, destCanvas.width, destCanvas.height)
    destCtx.drawImage(
      renderer.canvas,
      0,
      0,
      destCanvas.width,
      destCanvas.height,
      0,
      0,
      destCanvas.width,
      destCanvas.height
    )
  }
}

interface RenderFrameContext {
  state: { isHovering: boolean; isVisible: boolean; isRendering: boolean }
  mouseCoords: { x: number; y: number }
  cropCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>
  renderer: RegularGlassRenderer | null
  destCanvas: HTMLCanvasElement | null
}

async function renderGlassFrame(ctx: RenderFrameContext): Promise<void> {
  const { state, mouseCoords, cropCanvasRef, renderer, destCanvas } = ctx
  if (!state.isVisible || !state.isHovering || !renderer || !destCanvas || state.isRendering) {
    return
  }

  state.isRendering = true
  try {
    const dpr = window.devicePixelRatio || 1
    const mouseX = mouseCoords.x
    const mouseY = mouseCoords.y
    const circleWidth = 32
    const circleHeight = 32

    if (!cropCanvasRef.current) {
      cropCanvasRef.current = document.createElement('canvas')
    }

    const success = await captureAndCropBackground(
      { mouseX, mouseY, circleWidth, circleHeight, dpr },
      cropCanvasRef.current
    )
    if (success) {
      renderer.renderGlass(
        cropCanvasRef.current,
        circleWidth,
        circleHeight,
        dpr,
        REGULAR_GLASS_DEFAULTS
      )
      copyGlassToDest(
        renderer,
        destCanvas,
        circleWidth + SHADOW_PAD * 2,
        circleHeight + SHADOW_PAD * 2,
        dpr
      )
    }
  } catch {
    // Fallback gracefully on capture error
  } finally {
    state.isRendering = false
  }
}

export function useRegularGlassCursor(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  isHovering: boolean,
  isVisible: boolean
) {
  const stateRef = useRef({ isHovering, isVisible, isRendering: false })
  const mouseCoordsRef = useRef({ x: -9999, y: -9999 })
  const cropCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const rendererRef = useRef<RegularGlassRenderer | null>(null)

  useEffect(() => {
    stateRef.current.isHovering = isHovering
    stateRef.current.isVisible = isVisible
  }, [isHovering, isVisible])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || e.pointerType === 'pen') return
      mouseCoordsRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    try {
      if (!rendererRef.current) {
        rendererRef.current = new RegularGlassRenderer()
      }
    } catch {
      rendererRef.current = null
    }

    let rafId = 0
    let lastTime = 0

    const tick = (time: number) => {
      rafId = requestAnimationFrame(tick)
      if (time - lastTime < 32) return
      lastTime = time
      void renderGlassFrame({
        state: stateRef.current,
        mouseCoords: mouseCoordsRef.current,
        cropCanvasRef,
        renderer: rendererRef.current,
        destCanvas: canvasRef.current,
      })
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      cancelAnimationFrame(rafId)
      rendererRef.current?.destroy()
      rendererRef.current = null
    }
  }, [canvasRef])
}
