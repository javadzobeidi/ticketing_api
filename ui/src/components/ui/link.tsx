import * as React from "react"
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom"
import { cn } from "@/lib/utils"

interface LinkProps extends RouterLinkProps {
    // any other props you want to add
}

const Link = React.forwardRef<
  HTMLAnchorElement,
  LinkProps
>(({ className, ...props }, ref) => (
  <RouterLink
    ref={ref}
    className={cn("text-sm font-medium text-primary underline-offset-4 hover:underline", className)}
    {...props}
  />
))
Link.displayName = "Link"

export { Link }
