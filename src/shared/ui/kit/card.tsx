
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/lib/utils"

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "border-gray-200 bg-white",
        primary: "border-blue-200 bg-blue-50",
        secondary: "border-gray-100 bg-gray-50",
        success: "border-green-200 bg-green-50",
        warning: "border-amber-200 bg-amber-50",
        danger: "border-red-200 bg-red-50",
        gradient: "border-transparent bg-gradient-to-br from-blue-50 to-indigo-50",
        glass: "border-white/20 bg-white/10 backdrop-blur-sm",
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
        none: "p-0",
      },
      hoverable: {
        true: "transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
        false: "",
      },
      clickable: {
        true: "cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.99]",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      hoverable: false,
      clickable: false,
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, hoverable, clickable, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, size, hoverable, clickable }), className)}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-6", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"



interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: "square" | "video" | "auto"
}

const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(
  ({ className, aspectRatio = "auto", alt = "", ...props }, ref) => {
    const aspectClasses = {
      square: "aspect-square",
      video: "aspect-video",
      auto: "",
    }

    return (
      <div className="overflow-hidden">
        <img
          ref={ref}
          alt={alt}
          className={cn(
            "w-full h-auto object-cover transition-transform duration-300 hover:scale-105",
            aspectClasses[aspectRatio],
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
CardImage.displayName = "CardImage"

interface CardBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "success" | "warning" | "danger"
}

const CardBadge = React.forwardRef<HTMLDivElement, CardBadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variantClasses = {
      default: "bg-gray-100 text-gray-800",
      primary: "bg-blue-100 text-blue-800",
      success: "bg-green-100 text-green-800",
      warning: "bg-amber-100 text-amber-800",
      danger: "bg-red-100 text-red-800",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CardBadge.displayName = "CardBadge"


interface CardIconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  variant?: "default" | "primary" | "success" | "warning" | "danger"
}

const CardIcon = React.forwardRef<HTMLDivElement, CardIconProps>(
  ({ className, icon, variant = "default", children, ...props }, ref) => {
    const variantClasses = {
      default: "bg-gray-100 text-gray-600",
      primary: "bg-blue-100 text-blue-600",
      success: "bg-green-100 text-green-600",
      warning: "bg-amber-100 text-amber-600",
      danger: "bg-red-100 text-red-600",
    }

    return (
      <div
        ref={ref}
        className={cn("flex items-start gap-4", className)}
        {...props}
      >
        {icon && (
          <div className={cn("p-3 rounded-lg", variantClasses[variant])}>
            {icon}
          </div>
        )}
        <div className="flex-1">{children}</div>
      </div>
    )
  }
)
CardIcon.displayName = "CardIcon"


interface StatCardProps extends CardProps {
  title: string
  value: string | number
  description?: string
  change?: number 
  icon?: React.ReactNode
  trend?: "up" | "down" | "neutral"
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ title, value, description, change, icon, trend, className, ...props }, ref) => {
    const getTrendColor = () => {
      if (trend === "up") return "text-green-600 bg-green-50"
      if (trend === "down") return "text-red-600 bg-red-50"
      return "text-gray-600 bg-gray-50"
    }

    const getTrendIcon = () => {
      if (trend === "up") return "↑"
      if (trend === "down") return "↓"
      return ""
    }

    return (
      <Card
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <p className="text-2xl font-bold mt-2">{value}</p>
              {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              )}
              {change !== undefined && (
                <div
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium mt-3",
                    getTrendColor()
                  )}
                >
                  <span>{getTrendIcon()}</span>
                  <span>{Math.abs(change)}%</span>
                </div>
              )}
            </div>
            {icon && (
              <div className="p-3 bg-gray-100 rounded-lg text-gray-600">
                {icon}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)
StatCard.displayName = "StatCard"


interface ActionCardProps extends CardProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
}

const ActionCard = React.forwardRef<HTMLDivElement, ActionCardProps>(
  ({ title, description, actionLabel, onAction, icon, className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "flex flex-col justify-between hover:shadow-lg transition-shadow duration-300",
          className
        )}
        {...props}
      >
        <CardContent className="p-6">
          {icon && (
            <div className="mb-4 p-3 bg-blue-100 rounded-lg inline-block text-blue-600">
              {icon}
            </div>
          )}
          <CardTitle className="mb-2">{title}</CardTitle>
          {description && (
            <p className="text-gray-600 text-sm mb-4">{description}</p>
          )}
        </CardContent>
        {actionLabel && onAction && (
          <div className="p-6 pt-0">
            <button
              onClick={onAction}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
            >
              {actionLabel}
              <span>→</span>
            </button>
          </div>
        )}
      </Card>
    )
  }
)
ActionCard.displayName = "ActionCard"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardImage,
  CardBadge,
  CardIcon,
  StatCard,
  ActionCard,
}