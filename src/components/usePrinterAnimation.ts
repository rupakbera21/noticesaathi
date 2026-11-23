'use client'

import React, { useEffect, useRef, useState } from 'react'
import { AnalysisResponse } from './NoticeModalsAndResults'

export type AnimationPhase = 'idle' | 'feeding-in' | 'processing' | 'printing-out' | 'settled'

interface UsePrinterAnimationProps {
  loading: boolean
  analysis: AnalysisResponse | null
  onScrollToResult?: () => void
}

function checkReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function useScrollScrubbing(
  phase: AnimationPhase,
  hasAnalysis: boolean,
  containerRef: React.RefObject<HTMLDivElement | null>,
  setFeedProgress: (val: number) => void,
  setPrintProgress: (val: number) => void
) {
  useEffect(() => {
    if (phase !== 'settled' || !hasAnalysis) return

    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const scrollRange = 350
      const relativeOffset = rect.top - 120
      if (relativeOffset > 0 && relativeOffset < scrollRange) {
        const reverseRatio = relativeOffset / scrollRange
        setPrintProgress(Math.max(0, 1 - reverseRatio))
        setFeedProgress(Math.max(0, 1 - reverseRatio))
      } else if (relativeOffset <= 0) {
        setPrintProgress(1)
        setFeedProgress(1)
      } else {
        setPrintProgress(0)
        setFeedProgress(0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [phase, hasAnalysis, containerRef, setFeedProgress, setPrintProgress])
}

function useFloatingResultObserver(
  phase: AnimationPhase,
  hasAnalysis: boolean,
  setShowViewResultPill: (val: boolean) => void
) {
  useEffect(() => {
    if (phase !== 'settled' || !hasAnalysis) return
    if (typeof IntersectionObserver === 'undefined') return
    const resultsEl = document.getElementById('analysis-results-section')
    if (!resultsEl) return

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]
        if (entry) {
          setShowViewResultPill(!entry.isIntersecting)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(resultsEl)
    return () => observer.disconnect()
  }, [phase, hasAnalysis, setShowViewResultPill])
}

export function usePrinterAnimation({
  loading,
  analysis,
  onScrollToResult,
}: UsePrinterAnimationProps) {
  const [phase, setPhase] = useState<AnimationPhase>('idle')
  const [feedProgress, setFeedProgress] = useState(0)
  const [printProgress, setPrintProgress] = useState(0)
  const [showViewResultPill, setShowViewResultPill] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasAutoScrolled = useRef(false)

  // 1. Feeding in on Loading
  useEffect(() => {
    if (!loading) return
    hasAutoScrolled.current = false
    const prefersReduced = checkReducedMotion()

    let frameId: number
    const start = performance.now()
    const duration = prefersReduced ? 0 : 300

    frameId = requestAnimationFrame(now => {
      setPhase('feeding-in')
      const step = (current: number) => {
        const elapsed = current - start
        const progress = duration === 0 ? 1 : Math.min(1, elapsed / duration)
        setFeedProgress(progress)
        if (progress < 1) {
          frameId = requestAnimationFrame(step)
        } else {
          setPhase('processing')
        }
      }
      step(now)
    })
    return () => cancelAnimationFrame(frameId)
  }, [loading])

  // 2. Printing out on Analysis
  useEffect(() => {
    if (!loading && analysis) {
      const prefersReduced = checkReducedMotion()

      let frameId: number
      const start = performance.now()
      const duration = prefersReduced ? 0 : 450

      frameId = requestAnimationFrame(now => {
        setPhase('printing-out')
        const step = (current: number) => {
          const elapsed = current - start
          const progress = duration === 0 ? 1 : Math.min(1, elapsed / duration)
          setPrintProgress(progress)
          if (progress < 1) {
            frameId = requestAnimationFrame(step)
          } else {
            setPhase('settled')
            if (!hasAutoScrolled.current && onScrollToResult) {
              hasAutoScrolled.current = true
              onScrollToResult()
            }
          }
        }
        step(now)
      })
      return () => cancelAnimationFrame(frameId)
    }

    if (!loading && !analysis) {
      const frameId = requestAnimationFrame(() => {
        setPhase('idle')
        setFeedProgress(0)
        setPrintProgress(0)
      })
      return () => cancelAnimationFrame(frameId)
    }
  }, [loading, analysis, onScrollToResult])

  useScrollScrubbing(phase, !!analysis, containerRef, setFeedProgress, setPrintProgress)
  useFloatingResultObserver(phase, !!analysis, setShowViewResultPill)

  return { phase, feedProgress, printProgress, showViewResultPill, containerRef }
}
