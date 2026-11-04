import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-[#ccff00]/30 dark:bg-[#ccff00]/10 dark:text-[#ccff00]",
        secondary:
          "border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-zinc-300",
        outline:
          "border border-slate-300 dark:border-white/15 text-slate-600 dark:text-zinc-400",
        success:
          "border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
        warning:
          "border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
        danger:
          "border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  pulse?: boolean;
}

function Badge({
  className,
  variant,
  dot = false,
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
          )}
          <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
        </span>
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
