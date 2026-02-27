import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/test-utils'
import { Button } from './button'

describe('Button', () => {
  it('renders with visible text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('applies variant and size via className', () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>
    )
    const btn = screen.getByRole('button', { name: /delete/i })
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveClass('bg-destructive')
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Submit</Button>)
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button', { name: /disabled/i })).toBeDisabled()
  })
})
