import * as React from "react"
import { Check, X } from "lucide-react"

import { cn } from "@/lib/utils"

export interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  label?: string
  helperText?: string
  error?: boolean
  valid?: boolean
  containerClassName?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      helperText,
      error = false,
      valid = false,
      disabled = false,
      containerClassName,
      id: idProp,
      startIcon,
      endIcon,
      ...props
    },
    ref
  ) => {
    const id = React.useId()
    const inputId = idProp ?? id
    const hasStartIcon = Boolean(startIcon)
    const hasEndIcon = Boolean(endIcon)
    const hasValidIcon = valid && !error

    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium leading-none",
              error ? "text-destructive" : "text-foreground",
              disabled && "text-muted-foreground"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={type}
            disabled={disabled}
            className={cn(
              "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed md:text-sm",
              "border-input text-foreground focus-visible:ring-[var(--gray-400)]",
              error && "pl-9 placeholder:text-destructive/80",
              !error && hasStartIcon && "pl-9",
              (hasEndIcon || hasValidIcon) && "pr-9",
              hasEndIcon && hasValidIcon && "pr-14",
              disabled &&
                "border-dashed bg-muted text-muted-foreground cursor-not-allowed opacity-70",
              className
            )}
            ref={ref}
            aria-invalid={error}
            aria-describedby={helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          {hasStartIcon && !error && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground [&_svg]:size-4">
              {startIcon}
            </span>
          )}
          {error && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-destructive" aria-hidden>
              <X className="size-4" />
            </span>
          )}
          {(hasValidIcon || hasEndIcon) && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 [&_svg]:size-4">
              {hasValidIcon && (
                <span className="pointer-events-none text-[var(--feedback-success)] shrink-0" aria-hidden>
                  <Check className="size-4" />
                </span>
              )}
              {hasEndIcon && (
                <span className="text-muted-foreground flex items-center shrink-0">
                  {endIcon}
                </span>
              )}
            </span>
          )}
        </div>
        {helperText && (
          <p
            id={`${inputId}-helper`}
            className={cn(
              "text-[0.8rem]",
              error ? "text-destructive" : "text-foreground",
              disabled && "text-muted-foreground"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
