'use client'

import { useEffect, useRef, useState } from 'react'

const INTERACTIVE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [role="button"]:not([aria-disabled="true"]), [data-interactive="true"], summary'

export function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) return false
  return !!target.closest(INTERACTIVE_SELECTOR)
}

function handlePointerEnterLeave(
  overlayRef: React.RefObject<HTMLDivElement | null>,
  setIsVisible: (v: boolean) => void
) {
  const onLeave = () => {
    setIsVisible(false)
    document.documentElement.classList.remove('custom-cursor-active')
    if (overlayRef.current) overlayRef.current.style.opacity = '0'
  }
  document.addEventListener('mouseleave', onLeave)
  window.addEventListener('blur', onLeave)
  return () => {
    document.removeEventListener('mouseleave', onLeave)
    window.removeEventListener('blur', onLeave)
  }
}

export function useInteractiveCursor(
  overlayRef: React.RefObject<HTMLDivElement | null>,
  ringRef: React.RefObject<HTMLDivElement | null>
) {
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const isHoveringRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const deactivate = () => {
      setIsVisible(false)
      document.documentElement.classList.remove('custom-cursor-active')
      if (overlayRef.current) overlayRef.current.style.opacity = '0'
    }

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || e.pointerType === 'pen') {
        deactivate()
        return
      }

      const overlay = overlayRef.current
      if (!overlay) return

      overlay.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      overlay.style.opacity = '1'

      if (!document.documentElement.classList.contains('custom-cursor-active')) {
        document.documentElement.classList.add('custom-cursor-active')
        setIsVisible(true)
      }

      const hovering = isInteractiveTarget(e.target)
      if (hovering !== isHoveringRef.current) {
        isHoveringRef.current = hovering
        setIsHovering(hovering)
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || e.pointerType === 'pen') {
        deactivate()
      }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    const cleanupLeave = handlePointerEnterLeave(overlayRef, setIsVisible)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      cleanupLeave()
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [overlayRef, ringRef])

  return { isHovering, isVisible }
}
