import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

export interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  label?: string
  helperText?: string
  error?: boolean
  containerClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      helperText,
      error = false,
      disabled = false,
      containerClassName,
      id: idProp,
      ...props
    },
    ref
  ) => {
    const id = React.useId()
    const inputId = idProp ?? id

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
              "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed md:text-sm",
              error
                ? "border-destructive focus-visible:ring-destructive text-destructive placeholder:text-destructive/80 pl-9"
                : "border-input text-foreground focus-visible:ring-primary",
              disabled &&
                "border-dashed bg-muted text-muted-foreground cursor-not-allowed opacity-70",
              className
            )}
            ref={ref}
            aria-invalid={error}
            aria-describedby={helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          {error && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-destructive">
              <X className="size-4" aria-hidden />
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
