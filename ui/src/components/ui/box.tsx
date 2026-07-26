import * as React from "react"
import { cn } from "@/lib/utils"

const Box = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { as?: React.ElementType }
>(({ className, as: Comp = 'div', ...props }, ref) => (
  <Comp
    ref={ref}
    className={cn(className)}
    {...props}
  />
))
Box.displayName = "Box"

export { Box }
