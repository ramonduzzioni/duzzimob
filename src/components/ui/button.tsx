import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-lime-400 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-sm dark:bg-[#ccff00] dark:text-black dark:font-semibold dark:hover:bg-[#b8e600] dark:hover:shadow-[0_0_20px_rgba(204,255,0,0.35)] dark:shadow-[0_0_15px_rgba(204,255,0,0.2)]",
        outline:
          "border border-slate-300 dark:border-white/10 bg-white dark:bg-white/[0.03] text-foreground hover:bg-slate-100 dark:hover:bg-white/[0.08] hover:border-slate-400 dark:hover:border-white/20 shadow-xs",
        secondary:
          "bg-slate-100 dark:bg-[#1c2126] text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-[#252b32] border border-slate-200 dark:border-white/5",
        ghost:
          "text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5",
        danger:
          "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3.5 text-xs",
        lg: "h-12 px-7 text-base font-semibold",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
