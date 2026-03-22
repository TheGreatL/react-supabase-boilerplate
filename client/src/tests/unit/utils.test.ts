import { describe, expect, it } from 'vitest'
import { cn } from '@/shared/lib/utils'

describe('cn utility', () => {
  it('merges tailwind classes correctly', () => {
    const result = cn('px-2 py-2', 'py-4')
    // py-4 should override py-2
    expect(result).toContain('px-2')
    expect(result).toContain('py-4')
    expect(result).not.toContain('py-2')
  })

  it('handles conditional classes', () => {
    const result = cn('base', 'is-true', 'is-false')
    expect(result).toBe('base is-true')
  })

  it('handles undefined and null gracefully', () => {
    const result = cn('base', undefined, null)
    expect(result).toBe('base')
  })
})
