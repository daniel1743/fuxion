
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-input/60 bg-background/50 px-4 py-2 text-sm shadow-premium-soft transition-colors ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50 hover:border-input disabled:cursor-not-allowed disabled:opacity-50",
        "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/30",
        type === "file" && "cursor-pointer transition-colors hover:border-primary hover:bg-primary/5 file:mr-3 file:cursor-pointer file:rounded file:px-1 file:py-0.5 file:transition-colors file:hover:text-primary disabled:cursor-not-allowed disabled:file:cursor-not-allowed",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
