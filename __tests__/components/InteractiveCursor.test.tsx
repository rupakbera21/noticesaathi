import React from 'react'
import { render, act } from '@testing-library/react'
import { InteractiveCursor } from '@/components/InteractiveCursor'
import { isInteractiveTarget } from '@/components/useInteractiveCursor'

describe('InteractiveCursor Component', () => {
  beforeEach(() => {
    document.documentElement.className = ''
    if (typeof global.PointerEvent === 'undefined') {
      // Polyfill PointerEvent for jsdom
      // @ts-expect-error Mocking PointerEvent in JSDOM
      global.PointerEvent = class extends MouseEvent {
        pointerType: string
        constructor(type: string, params: PointerEventInit = {}) {
          super(type, params)
          this.pointerType = params.pointerType || 'mouse'
        }
      }
    }
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))
  })

  it('renders an aria-hidden, pointer-events-none cursor overlay', () => {
    const { container } = render(<InteractiveCursor />)
    const cursor = container.querySelector('[data-testid="interactive-cursor"]')
    expect(cursor).toBeInTheDocument()
    expect(cursor).toHaveAttribute('aria-hidden', 'true')
    expect(cursor).toHaveClass('pointer-events-none')
  })

  it('activates custom-cursor-active on mouse pointermove and hides on mouseleave', () => {
    render(<InteractiveCursor />)
    expect(document.documentElement.classList.contains('custom-cursor-active')).toBe(false)

    act(() => {
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          clientX: 200,
          clientY: 150,
          pointerType: 'mouse',
        })
      )
    })

    expect(document.documentElement.classList.contains('custom-cursor-active')).toBe(true)

    act(() => {
      document.dispatchEvent(new MouseEvent('mouseleave'))
    })

    expect(document.documentElement.classList.contains('custom-cursor-active')).toBe(false)
  })

  it('detects interactive elements via isInteractiveTarget', () => {
    const button = document.createElement('button')
    const icon = document.createElement('span')
    button.appendChild(icon)
    document.body.appendChild(button)

    expect(isInteractiveTarget(button)).toBe(true)
    expect(isInteractiveTarget(icon)).toBe(true)

    const div = document.createElement('div')
    document.body.appendChild(div)
    expect(isInteractiveTarget(div)).toBe(false)

    const link = document.createElement('a')
    link.href = '/trust'
    document.body.appendChild(link)
    expect(isInteractiveTarget(link)).toBe(true)

    const disabledBtn = document.createElement('button')
    disabledBtn.disabled = true
    document.body.appendChild(disabledBtn)
    expect(isInteractiveTarget(disabledBtn)).toBe(false)
  })

  it('activates custom cursor on physical mouse move even when primary pointer reports coarse', () => {
    // Simulate device reporting coarse primary pointer (e.g. Windows touchscreen laptop with mouse)
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: query.includes('(pointer: coarse)'),
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    const { container } = render(<InteractiveCursor />)
    const overlay = container.querySelector('[data-testid="interactive-cursor"]') as HTMLElement

    act(() => {
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          clientX: 320,
          clientY: 240,
          pointerType: 'mouse',
        })
      )
    })

    expect(document.documentElement.classList.contains('custom-cursor-active')).toBe(true)
    expect(overlay.style.transform).toBe('translate3d(320px, 240px, 0)')
    expect(overlay.style.opacity).toBe('1')
  })

  it('leaves native behavior in place and deactivates custom cursor on touch input', () => {
    const { container } = render(<InteractiveCursor />)
    const overlay = container.querySelector('[data-testid="interactive-cursor"]') as HTMLElement

    // Mouse activates
    act(() => {
      window.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 100, clientY: 100, pointerType: 'mouse' })
      )
    })
    expect(document.documentElement.classList.contains('custom-cursor-active')).toBe(true)

    // Touch event deactivates custom cursor and leaves native behavior
    act(() => {
      window.dispatchEvent(
        new PointerEvent('pointerdown', { clientX: 120, clientY: 120, pointerType: 'touch' })
      )
    })
    expect(document.documentElement.classList.contains('custom-cursor-active')).toBe(false)
    expect(overlay.style.opacity).toBe('0')
  })
})
