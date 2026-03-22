import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

describe('Example Client Test', () => {
  it('should render a basic element', () => {
    render(React.createElement('div', { role: 'banner' }, 'Hello Vitest'))
    expect(screen.getByRole('banner')).toHaveTextContent('Hello Vitest')
  })

  it('assertions work correctly', () => {
    expect(1 + 1).toBe(2)
  })
})
