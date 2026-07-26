"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Avatar({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)} {...props} />
}

function AvatarImage({ className, src, alt, ...props }: React.ComponentProps<"img">) {
  const [loaded, setLoaded] = React.useState(false)

  return (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      className={cn("aspect-square size-full", !loaded && "hidden", className)}
      onLoad={() => setLoaded(true)}
      {...props}
    />
  )
}

function AvatarFallback({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("bg-muted flex size-full items-center justify-center rounded-full", className)} {...props} />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
