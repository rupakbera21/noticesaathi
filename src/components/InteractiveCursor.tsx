'use client'

import React, { useRef } from 'react'
import { useInteractiveCursor } from './useInteractiveCursor'

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

export function InteractiveCursor() {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  useInteractiveCursor(overlayRef)

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      data-testid="interactive-cursor"
      className="fixed top-0 left-0 pointer-events-none z-[99999] opacity-0 will-change-transform"
      style={{
        transform: 'translate3d(-9999px, -9999px, 0)',
        transition: 'opacity 150ms ease-out',
      }}
    >
      {/* Theme matched glass arrowhead */}
      <ArrowheadSvgLight />
      <ArrowheadSvgDark />
    </div>
  )
}
