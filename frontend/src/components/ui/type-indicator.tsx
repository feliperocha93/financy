import * as React from "react"
import { CheckCircle, Circle } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const typeIndicatorVariants = cva(
  "inline-flex items-center gap-1.5 text-sm [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        created: "text-success",
        sent: "text-destructive",
      },
    },
    defaultVariants: {
      variant: "created",
    },
  }
)

export interface TypeIndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof typeIndicatorVariants> {
  label: string
}

const TypeIndicator = React.forwardRef<HTMLSpanElement, TypeIndicatorProps>(
  ({ className, variant, label, ...props }, ref) => {
    const Icon = variant === "sent" ? Circle : CheckCircle
    return (
      <span
        ref={ref}
        className={cn(typeIndicatorVariants({ variant, className }))}
        {...props}
      >
        <Icon aria-hidden />
        {label}
      </span>
    )
  }
)
TypeIndicator.displayName = "TypeIndicator"

export { TypeIndicator, typeIndicatorVariants }
