import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const tagVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-white",
  {
    variants: {
      variant: {
        blue: "border-blue-dark bg-blue-base",
        blueLight: "border-blue-base bg-blue-light text-blue-dark",
        purple: "border-purple-dark bg-purple-base",
        purpleLight: "border-purple-base bg-purple-light text-purple-dark",
        red: "border-red-dark bg-red-base",
        orange: "border-orange-dark bg-orange-base",
        yellow: "border-yellow-dark bg-yellow-base",
        green: "border-green-dark bg-green-base",
      },
    },
    defaultVariants: {
      variant: "blue",
    },
  }
)

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(tagVariants({ variant, className }))}
      {...props}
    />
  )
)
Tag.displayName = "Tag"

export { Tag, tagVariants }
