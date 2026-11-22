export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN'

export interface CircuitBreakerConfig {
  failureThreshold?: number // failures before tripping
  cooldownPeriodMs?: number // how long to stay OPEN before attempting HALF_OPEN
}

/**
 * Resilient Circuit Breaker for AI model provider endpoints.
 * Operates in-memory by default, preventing cascading latency or failure loops.
 */
export class CircuitBreaker {
  private failureCount = 0
  private lastFailureTime = 0
  private state: CircuitState = 'CLOSED'

  private readonly failureThreshold: number
  private readonly cooldownPeriodMs: number

  constructor(config: CircuitBreakerConfig = {}) {
    this.failureThreshold = config.failureThreshold ?? 3
    this.cooldownPeriodMs = config.cooldownPeriodMs ?? 30000 // 30s
  }

  public getState(): CircuitState {
    if (this.state === 'OPEN') {
      const now = Date.now()
      if (now - this.lastFailureTime > this.cooldownPeriodMs) {
        this.state = 'HALF_OPEN'
      }
    }
    return this.state
  }

  public isAvailable(): boolean {
    const s = this.getState()
    return s === 'CLOSED' || s === 'HALF_OPEN'
  }

  public recordSuccess(): void {
    this.failureCount = 0
    this.state = 'CLOSED'
  }

  public recordFailure(): void {
    this.failureCount++
    this.lastFailureTime = Date.now()
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN'
    }
  }

  public reset(): void {
    this.failureCount = 0
    this.lastFailureTime = 0
    this.state = 'CLOSED'
  }
}
