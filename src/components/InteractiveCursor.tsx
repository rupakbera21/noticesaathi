'use client'

import React, { useRef } from 'react'
import { useInteractiveCursor } from './useInteractiveCursor'
import { useRegularGlassCursor } from './useRegularGlassCursor'

function ArrowheadSvgLight() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      className="block dark:hidden"
      style={{ position: 'absolute', top: '-4.1px', left: '-5.3px' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="cursor-glass-light"
          x1="5.5"
          y1="4.5"
          x2="21"
          y2="21"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#7c6ee6" />
          <stop offset="0.4" stopColor="#5547d6" />
          <stop offset="0.75" stopColor="#4338ca" />
          <stop offset="1" stopColor="#322998" />
        </linearGradient>
        <filter
          id="cursor-shadow-light"
          x="0"
          y="0"
          width="28"
          height="28"
          filterUnits="userSpaceOnUse"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.1" />
          <feOffset dy="1.2" result="blur" />
          <feFlood floodColor="#1d1656" floodOpacity=".36" />
          <feComposite in2="blur" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M 5.3 4.1 Q 6.15 3.55 7.55 4.36 L 21.42 12.05 Q 23.38 13.14 22.27 14.75 Q 21.95 15.17 20.98 15.44 L 14.28 17.17 L 11.21 22.16 Q 10.24 23.63 8.7 22.96 Q 7.89 22.56 7.65 21.12 L 4.43 6.57 Q 4 4.71 5.3 4.1 Z"
        fill="url(#cursor-glass-light)"
        fillOpacity=".93"
        stroke="#221b68"
        strokeOpacity=".82"
        strokeWidth=".75"
        filter="url(#cursor-shadow-light)"
      />
      <path
        d="M 6.35 5.35 Q 6.68 5.12 7.3 5.49 L 20.46 12.72"
        fill="none"
        stroke="#ede9fe"
        strokeOpacity=".45"
        strokeWidth=".8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ArrowheadSvgDark() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      className="hidden dark:block"
      style={{ position: 'absolute', top: '-4.1px', left: '-5.3px' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="cursor-glass-dark"
          x1="5.5"
          y1="4.5"
          x2="21"
          y2="21"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#b4a6ff" />
          <stop offset="0.45" stopColor="#6f61e4" />
          <stop offset="0.8" stopColor="#3e33b0" />
          <stop offset="1" stopColor="#241c78" />
        </linearGradient>
        <filter
          id="cursor-shadow-dark"
          x="0"
          y="0"
          width="28"
          height="28"
          filterUnits="userSpaceOnUse"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" />
          <feOffset dy="1.4" result="blur" />
          <feFlood floodColor="#070712" floodOpacity=".58" />
          <feComposite in2="blur" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M 5.3 4.1 Q 6.15 3.55 7.55 4.36 L 21.42 12.05 Q 23.38 13.14 22.27 14.75 Q 21.95 15.17 20.98 15.44 L 14.28 17.17 L 11.21 22.16 Q 10.24 23.63 8.7 22.96 Q 7.89 22.56 7.65 21.12 L 4.43 6.57 Q 4 4.71 5.3 4.1 Z"
        fill="url(#cursor-glass-dark)"
        fillOpacity=".92"
        stroke="#9d8df8"
        strokeOpacity=".68"
        strokeWidth=".75"
        filter="url(#cursor-shadow-dark)"
      />
      <path
        d="M 6.35 5.35 Q 6.68 5.12 7.3 5.49 L 20.46 12.72"
        fill="none"
        stroke="#ffffff"
        strokeOpacity=".55"
        strokeWidth=".8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function GlassReflections() {
  return (
    <>
      {/* Upper-left soft white reflection */}
      <span
        className="absolute rounded-full pointer-events-none block dark:hidden"
        style={{
          top: '2px',
          left: '3px',
          width: '13px',
          height: '5.5px',
          transform: 'rotate(-35deg)',
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
          filter: 'blur(0.3px)',
        }}
        aria-hidden="true"
      />
      <span
        className="absolute rounded-full pointer-events-none hidden dark:block"
        style={{
          top: '2px',
          left: '3px',
          width: '13px',
          height: '5.5px',
          transform: 'rotate(-35deg)',
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
          filter: 'blur(0.3px)',
        }}
        aria-hidden="true"
      />

      {/* Lower-right faint violet tint */}
      <span
        className="absolute rounded-full pointer-events-none"
        style={{
          bottom: '-2px',
          right: '-2px',
          width: '18px',
          height: '18px',
          background:
            'radial-gradient(circle at 70% 70%, rgba(111, 97, 228, 0.32) 0%, rgba(180, 166, 255, 0.12) 50%, transparent 80%)',
        }}
        aria-hidden="true"
      />
    </>
  )
}

function GlassInnerRim() {
  return (
    <>
      <span
        className="absolute inset-0 rounded-full pointer-events-none block dark:hidden"
        style={{
          boxShadow:
            'inset 0 1.5px 2.5px rgba(255, 255, 255, 0.75), inset -1px -1.5px 3px rgba(99, 85, 220, 0.28)',
        }}
        aria-hidden="true"
      />
      <span
        className="absolute inset-0 rounded-full pointer-events-none hidden dark:block"
        style={{
          boxShadow:
            'inset 0 1.5px 2px rgba(255, 255, 255, 0.45), inset -1px -1.5px 3px rgba(180, 166, 255, 0.25)',
        }}
        aria-hidden="true"
      />
    </>
  )
}

function RegularGlassRing({
  isHovering,
  ringRef,
  glassCanvasRef,
}: {
  isHovering: boolean
  ringRef: React.RefObject<HTMLDivElement | null>
  glassCanvasRef: React.RefObject<HTMLCanvasElement | null>
}) {
  return (
    <div
      ref={ringRef}
      className={`absolute rounded-full overflow-hidden pointer-events-none transition-all duration-150 ease-out motion-reduce:transition-none ${
        isHovering ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
      }`}
      style={{
        width: '32px',
        height: '32px',
        top: '-16px',
        left: '-16px',
        border: '1.75px solid var(--accent-light, #b4a6ff)',
        boxShadow: '0 0 10px rgba(180, 166, 255, 0.4)',
        backgroundColor: 'rgba(180, 166, 255, 0.16)',
      }}
    >
      {/* Fallback CSS glass reflections & rim when WebGL is unavailable */}
      <GlassReflections />
      <GlassInnerRim />

      {/* WebGL Regular Glass output canvas (20px pad centered inside 32px circle) */}
      <canvas
        ref={glassCanvasRef}
        className="absolute pointer-events-none"
        style={{
          width: '72px',
          height: '72px',
          top: '-20px',
          left: '-20px',
        }}
        aria-hidden="true"
      />
    </div>
  )
}

export function InteractiveCursor() {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const glassCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const { isHovering, isVisible } = useInteractiveCursor(overlayRef, ringRef)

  useRegularGlassCursor(glassCanvasRef, isHovering, isVisible)

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      data-testid="interactive-cursor"
      data-cursor-layer="true"
      className="fixed top-0 left-0 pointer-events-none z-[99999] opacity-0 will-change-transform"
      style={{
        transform: 'translate3d(-9999px, -9999px, 0)',
        transition: 'opacity 150ms ease-out',
      }}
    >
      {/* Regular Glass hover ring with WebGL shader output */}
      <RegularGlassRing isHovering={isHovering} ringRef={ringRef} glassCanvasRef={glassCanvasRef} />

      {/* Theme matched glass arrowhead */}
      <ArrowheadSvgLight />
      <ArrowheadSvgDark />
    </div>
  )
}
