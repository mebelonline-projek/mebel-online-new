import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-maroon focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-maroon text-white hover:bg-maroon-light shadow-sm",
        secondary:
          "border-transparent bg-orange text-white hover:bg-orange-light shadow-sm",
        outline:
          "border-border text-foreground hover:bg-muted",
        maroon:
          "border-transparent bg-maroon/10 text-maroon hover:bg-maroon/20",
        orange:
          "border-transparent bg-orange/10 text-orange hover:bg-orange/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        className={cn(badgeVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
