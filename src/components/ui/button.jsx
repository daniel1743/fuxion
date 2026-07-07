import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.97] hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-premium-soft hover:shadow-md",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-premium-soft",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:shadow-premium-soft",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-premium-soft",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        whatsapp:
          "bg-green-600 text-white hover:bg-green-700 shadow-premium-soft hover:shadow-md",
      },
      size: {
        sm: "h-9 min-h-[36px] rounded-xl px-3 text-xs gap-1.5",
        md: "h-11 min-h-[44px] rounded-xl px-5 text-sm gap-2",
        default: "h-11 min-h-[44px] rounded-xl px-5 text-sm gap-2",
        lg: "h-[52px] min-h-[52px] rounded-xl px-6 text-sm gap-2",
        hero: "h-14 min-h-[56px] rounded-xl px-8 text-base gap-2.5",
        icon: "h-10 w-10 rounded-xl",
      },
      fullWidth: {
        true: "w-full sm:w-auto sm:max-w-[360px]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
