'use client'

import { useEffect, type RefObject } from 'react'

export function useInteractiveCursor(overlayRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    const root = document.documentElement
    const deactivate = () => {
      root.classList.remove('custom-cursor-active')
      overlay.style.opacity = '0'
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || event.pointerType === 'pen') {
        deactivate()
        return
      }

      overlay.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      overlay.style.opacity = '1'
      root.classList.add('custom-cursor-active')
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || event.pointerType === 'pen') deactivate()
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('blur', deactivate)
    document.addEventListener('mouseleave', deactivate)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('blur', deactivate)
      document.removeEventListener('mouseleave', deactivate)
      deactivate()
    }
  }, [overlayRef])
}
