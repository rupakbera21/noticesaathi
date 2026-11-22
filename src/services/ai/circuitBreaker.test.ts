import { CircuitBreaker } from './circuitBreaker'

describe('Circuit Breaker Engine', () => {
  it('starts in CLOSED state and remains available', () => {
    const breaker = new CircuitBreaker({ failureThreshold: 3, cooldownPeriodMs: 500 })
    expect(breaker.getState()).toBe('CLOSED')
    expect(breaker.isAvailable()).toBe(true)
  })

  it('trips to OPEN state after reaching failure threshold', () => {
    const breaker = new CircuitBreaker({ failureThreshold: 3, cooldownPeriodMs: 500 })
    breaker.recordFailure()
    expect(breaker.getState()).toBe('CLOSED')
    breaker.recordFailure()
    expect(breaker.getState()).toBe('CLOSED')
    breaker.recordFailure()
    expect(breaker.getState()).toBe('OPEN')
    expect(breaker.isAvailable()).toBe(false)
  })

  it('transitions to HALF_OPEN after cooldown period expires', async () => {
    const breaker = new CircuitBreaker({ failureThreshold: 2, cooldownPeriodMs: 50 })
    breaker.recordFailure()
    breaker.recordFailure()
    expect(breaker.getState()).toBe('OPEN')

    await new Promise(r => setTimeout(r, 60))
    expect(breaker.getState()).toBe('HALF_OPEN')
    expect(breaker.isAvailable()).toBe(true)
  })

  it('recovers to CLOSED upon recordSuccess or reset', () => {
    const breaker = new CircuitBreaker({ failureThreshold: 2 })
    breaker.recordFailure()
    breaker.recordFailure()
    expect(breaker.getState()).toBe('OPEN')

    breaker.recordSuccess()
    expect(breaker.getState()).toBe('CLOSED')

    breaker.recordFailure()
    breaker.reset()
    expect(breaker.getState()).toBe('CLOSED')
  })
})
