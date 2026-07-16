import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-semibold ring-offset-background transition-all duration-[250ms] ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuxion focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.96] hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        default:
          "bg-fuxion text-white hover:bg-fuxion-light shadow-premium-soft hover:shadow-premium-hover",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-premium-soft",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:shadow-premium-soft",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-premium-soft",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-fuxion underline-offset-4 hover:underline",
        whatsapp:
          "bg-whatsapp text-white hover:bg-whatsapp-hover shadow-premium-soft hover:shadow-premium-hover",
      },
      size: {
        sm: "h-11 min-h-[44px] sm:h-9 sm:min-h-[36px] rounded-xl px-3 text-xs gap-1.5 min-w-[44px] sm:min-w-0",
        md: "h-11 min-h-[44px] rounded-xl px-5 text-sm gap-2 min-w-[44px]",
        default: "h-11 min-h-[44px] rounded-xl px-5 text-sm gap-2 min-w-[44px]",
        lg: "h-[52px] min-h-[52px] rounded-xl px-6 text-sm gap-2 min-w-[44px]",
        hero: "h-14 min-h-[56px] rounded-xl px-8 text-base gap-2.5 min-w-[44px]",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center",
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
