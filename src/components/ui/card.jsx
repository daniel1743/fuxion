import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "bg-card text-card-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        default: "rounded-card border border-border/50 shadow-elevation-1 hover:shadow-elevation-2",
        product: "group relative rounded-card overflow-hidden border border-border flex flex-col h-full hover:border-primary hover:shadow-elevation-3 hover:-translate-y-0.5",
        feature: "rounded-card border border-emerald-100 dark:border-border flex flex-col h-full hover:border-primary hover:shadow-elevation-3 hover:-translate-y-0.5 p-8",
        trust: "rounded-card border border-white/30 dark:border-emerald-900/30 bg-white/70 dark:bg-card/70 backdrop-blur-sm shadow-elevation-1 hover:shadow-elevation-2 h-full flex flex-col p-5 gap-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Card = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant, className }))}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight text-lg", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// For product variants and default variants
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 mt-auto", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

const CardMedia = React.forwardRef(({ className, src, alt, ...props }, ref) => (
  <div ref={ref} className={cn("w-full overflow-hidden bg-secondary flex-shrink-0", className)} {...props}>
    <img
      src={src}
      alt={alt || "Card Media"}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  </div>
))
CardMedia.displayName = "CardMedia"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardMedia, cardVariants }
