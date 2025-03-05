
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        outline: "border border-input bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "bg-white/20 backdrop-blur-lg border border-white/20 text-foreground hover:bg-white/30 shadow-sm",
        success: "bg-green-500 text-white hover:bg-green-600",
        warning: "bg-amber-500 text-white hover:bg-amber-600",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        subtle: "bg-slate-100 text-slate-900 hover:bg-slate-200",
        accent: "bg-blue-100 text-blue-900 hover:bg-blue-200",
      },
      size: {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-9 px-4 py-2 text-sm",
        lg: "h-14 px-8 py-4 text-lg",
        xl: "h-16 px-10 py-5 text-xl",
        icon: "h-9 w-9",
        "icon-sm": "h-7 w-7",
        "icon-lg": "h-11 w-11",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        scale: "transition-transform hover:scale-105 active:scale-95",
        slide: "transition-transform hover:-translate-y-1 active:translate-y-0",
        glow: "transition-shadow hover:shadow-md hover:shadow-primary/25",
      },
      rounded: {
        default: "rounded-lg",
        full: "rounded-full",
        sm: "rounded-md",
        lg: "rounded-xl",
        none: "rounded-none",
      },
      elevated: {
        true: "shadow-md hover:shadow-lg transition-shadow",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      animation: "none",
      rounded: "default",
      elevated: false,
    },
  }
);

export interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant, size, animation, rounded, elevated, isLoading, leftIcon, rightIcon, children, ...props }, ref) => (
    <Button
      className={cn(buttonVariants({ variant, size, animation, rounded, elevated, className }))}
      ref={ref}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {!isLoading && leftIcon}
      {children}
      {!isLoading && rightIcon}
    </Button>
  )
);

CustomButton.displayName = "CustomButton";

export { CustomButton, buttonVariants };
