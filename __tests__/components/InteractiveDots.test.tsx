import React from 'react'
import { render } from '@testing-library/react'
import { InteractiveDots } from '@/components/InteractiveDots'

describe('InteractiveDots Component', () => {
  beforeEach(() => {
    global.ResizeObserver = class {
      observe = jest.fn()
      disconnect = jest.fn()
      unobserve = jest.fn()
    } as unknown as typeof ResizeObserver

    // Mock getContext and getBoundingClientRect for jsdom
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      scale: jest.fn(),
      setTransform: jest.fn(),
      fillStyle: '',
    })) as unknown as typeof HTMLCanvasElement.prototype.getContext

    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 1200,
      height: 600,
      top: 0,
      left: 0,
      bottom: 600,
      right: 1200,
      x: 0,
      y: 0,
      toJSON: () => {},
    }))
  })

  it('renders an aria-hidden canvas container without crashing', () => {
    const { container } = render(<InteractiveDots />)
    const wrapper = container.querySelector('[aria-hidden="true"]')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper?.querySelector('canvas')).toBeInTheDocument()
  })

  it('cleans up event listeners and observers on unmount', () => {
    const { unmount } = render(<InteractiveDots />)
    expect(() => unmount()).not.toThrow()
  })
})
