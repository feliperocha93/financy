import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '@/test/test-utils'
import { CategoryPill } from './CategoryPill'

describe('CategoryPill', () => {
  it('renders label text', () => {
    render(<CategoryPill label="Food" color="#3b82f6" />)
    expect(screen.getByText('Food')).toBeInTheDocument()
  })

  it('applies background color from color prop', () => {
    const { container } = render(
      <CategoryPill label="Transport" color="#10b981" />
    )
    const pill = container.querySelector('span')
    expect(pill).toHaveStyle({ backgroundColor: '#10b981' })
  })

  it('merges custom className', () => {
    const { container } = render(
      <CategoryPill label="Other" color="#000" className="custom-class" />
    )
    const pill = container.querySelector('span')
    expect(pill).toHaveClass('custom-class')
  })
})
