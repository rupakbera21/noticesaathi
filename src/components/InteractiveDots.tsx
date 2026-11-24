'use client'

import React, { useRef } from 'react'
import { useInteractiveDotsCanvas } from './useInteractiveDots'

export function InteractiveDots({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useInteractiveDotsCanvas(containerRef, canvasRef)

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none select-none overflow-hidden z-0 ${className}`}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}
