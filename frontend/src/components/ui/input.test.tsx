import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '@/test/test-utils'
import { Input } from './input'

describe('Input', () => {
  it('renders input with value', () => {
    render(<Input value="hello" onChange={() => {}} readOnly />)
    expect(screen.getByDisplayValue('hello')).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(
      <Input
        label="Email"
        value=""
        onChange={() => {}}
        readOnly
        data-testid="email-input"
      />
    )
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('shows helper text when provided', () => {
    render(
      <Input
        helperText="Enter your email"
        value=""
        onChange={() => {}}
        readOnly
      />
    )
    expect(screen.getByText(/enter your email/i)).toBeInTheDocument()
  })

  it('supports aria-invalid when error is true', () => {
    render(
      <Input error value="" onChange={() => {}} readOnly aria-label="Field" />
    )
    expect(screen.getByRole('textbox', { name: /field/i })).toHaveAttribute(
      'aria-invalid',
      'true'
    )
  })
})
