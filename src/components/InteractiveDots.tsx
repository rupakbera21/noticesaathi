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
      className={`absolute inset-0 -z-10 pointer-events-none select-none overflow-hidden ${className}`}
      style={{
        maskImage: 'linear-gradient(to bottom, black 0%, black 72%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 72%, transparent 100%)',
      }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}
