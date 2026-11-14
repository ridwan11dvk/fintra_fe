import { cn } from "@railfinance/core/lib";
import { usePrefersReducedMotion } from "@railfinance/core/hooks";
import { CheckCircle2, Circle, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type StepStatus = "completed" | "current" | "pending";
export type StepOrientation = "horizontal" | "vertical";

export interface Step {
  label: string;
  status: StepStatus;
  description?: string;
  icon?: LucideIcon | ReactNode;
}

interface InvoiceTrackerProps {
  steps: Step[];
  orientation?: StepOrientation;
  className?: string;
  "aria-label"?: string;
  onStepClick?: (index: number, step: Step) => void;
  interactive?: boolean;
}

interface StepIconProps {
  status: StepStatus;
  icon?: LucideIcon | ReactNode;
  "aria-hidden"?: boolean;
}

function getStatusLabel(status: StepStatus): string {
  switch (status) {
    case "completed":
      return "completed";
    case "current":
      return "in progress";
    case "pending":
      return "pending";
    default:
      return "";
  }
}

function isReactComponent(icon: LucideIcon | ReactNode): icon is LucideIcon {
  // Check if the icon is a Lucide component (function or forwardRef)
  return (
    typeof icon === "function" ||
    (typeof icon === "object" && icon !== null && "$$typeof" in icon)
  );
}

function StepIcon({
  status,
  icon,
  "aria-hidden": ariaHidden = true,
}: Readonly<StepIconProps>) {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Use custom icon if provided
  if (icon) {
    if (isReactComponent(icon)) {
      const IconComponent = icon;
      return (
        <>
          <IconComponent
            className={cn(
              "size-6 transition-all duration-300",
              status === "completed" || status === "current"
                ? "text-primary"
                : "text-muted-foreground",
              !prefersReducedMotion &&
                status === "completed" &&
                "animate-step-complete",
            )}
            aria-hidden={ariaHidden}
          />
          {status === "current" && (
            <span
              className={cn(
                "absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary",
                !prefersReducedMotion && "animate-pulse",
              )}
            />
          )}
        </>
      );
    }
    // It's a ReactNode (JSX element)
    return <>{icon}</>;
  }

  // Default icons
  if (status === "completed") {
    return (
      <CheckCircle2
        className={cn(
          "size-6 text-primary",
          !prefersReducedMotion && "animate-step-complete",
        )}
        aria-hidden={ariaHidden}
      />
    );
  }
  if (status === "current") {
    return (
      <CheckCircle2
        className={cn(
          "size-6 text-primary",
          !prefersReducedMotion && "animate-pulse",
        )}
        aria-hidden={ariaHidden}
      />
    );
  }
  return (
    <Circle className="size-6 text-muted-foreground" aria-hidden={ariaHidden} />
  );
}

interface StepProps {
  step: Step;
  index: number;
  totalSteps: number;
  onStepClick?: (index: number, step: Step) => void;
  interactive?: boolean;
}

function getStepActions(
  interactive: boolean,
  onStepClick: ((index: number, step: Step) => void) | undefined,
  index: number,
  step: Step,
) {
  const isClickable = Boolean(interactive && onStepClick);

  const handleClick = () => {
    if (interactive && onStepClick) {
      onStepClick(index, step);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return { isClickable, handleClick, handleKeyDown };
}

function HorizontalStep({
  step,
  index,
  totalSteps,
  onStepClick,
  interactive,
}: Readonly<StepProps>) {
  const { isClickable, handleClick, handleKeyDown } = getStepActions(
    Boolean(interactive),
    onStepClick,
    index,
    step,
  );

  return (
    <li
      className="flex flex-1 flex-col items-center"
      aria-label={`Step ${index + 1} of ${totalSteps}: ${step.label}, ${getStatusLabel(step.status)}`}
      aria-current={step.status === "current" ? "step" : undefined}
    >
      <div className="flex items-center">
        <button
          type="button"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          disabled={!isClickable}
          className={cn(
            "flex items-center justify-center rounded-full p-1 transition-all duration-200",
            isClickable &&
              "cursor-pointer hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            !isClickable && "cursor-default",
          )}
          aria-label={
            isClickable ? `Click to view details for ${step.label}` : undefined
          }
        >
          <StepIcon status={step.status} icon={step.icon} aria-hidden={true} />
        </button>
        {index < totalSteps - 1 && (
          <div
            className={cn(
              "ml-1 h-0.5 w-12 md:w-20",
              step.status === "completed" || step.status === "current"
                ? "bg-primary"
                : "bg-muted",
            )}
            aria-hidden="true"
          />
        )}
      </div>
    </li>
  );
}

function HorizontalTracker({
  steps,
  onStepClick,
  interactive,
}: Readonly<{
  steps: Step[];
  onStepClick?: (index: number, step: Step) => void;
  interactive?: boolean;
}>) {
  const isClickable = Boolean(interactive && onStepClick);

  return (
    <div className="w-full">
      {/* Progress Icons and Lines */}
      <ol
        className="flex items-center justify-between"
        aria-label="Invoice progress steps"
      >
        {steps.map((step, index) => (
          <HorizontalStep
            key={step.label}
            step={step}
            index={index}
            totalSteps={steps.length}
            onStepClick={onStepClick}
            interactive={interactive}
          />
        ))}
      </ol>
      {/* Step Labels */}
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        {steps.map((step, index) => (
          <button
            key={step.label}
            type="button"
            disabled={!isClickable}
            onClick={() => onStepClick?.(index, step)}
            className={cn(
              "w-20 text-center",
              isClickable &&
                "cursor-pointer hover:text-foreground transition-colors",
            )}
          >
            {step.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function VerticalStep({
  step,
  index,
  totalSteps,
  onStepClick,
  interactive,
}: Readonly<StepProps>) {
  const { isClickable, handleClick, handleKeyDown } = getStepActions(
    Boolean(interactive),
    onStepClick,
    index,
    step,
  );

  return (
    <li
      className="flex gap-4"
      aria-label={`Step ${index + 1} of ${totalSteps}: ${step.label}, ${getStatusLabel(step.status)}`}
      aria-current={step.status === "current" ? "step" : undefined}
    >
      {/* Icon and Line Column */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          disabled={!isClickable}
          className={cn(
            "flex items-center justify-center rounded-full p-1 transition-all duration-200",
            isClickable &&
              "cursor-pointer hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            !isClickable && "cursor-default",
          )}
          aria-label={
            isClickable ? `Click to view details for ${step.label}` : undefined
          }
        >
          <StepIcon status={step.status} icon={step.icon} aria-hidden={true} />
        </button>
        {index < totalSteps - 1 && (
          <div
            className={cn(
              "my-1 h-full w-0.5 min-h-[40px]",
              step.status === "completed" || step.status === "current"
                ? "bg-primary"
                : "bg-muted",
            )}
            aria-hidden="true"
          />
        )}
      </div>
      {/* Content */}
      <div className={cn("pb-6", index === totalSteps - 1 && "pb-0")}>
        <button
          type="button"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          disabled={!isClickable}
          className={cn(
            "text-left transition-colors duration-200",
            isClickable &&
              "cursor-pointer hover:text-foreground focus:outline-none focus-visible:underline",
            step.status === "completed" || step.status === "current"
              ? "text-foreground font-medium"
              : "text-muted-foreground",
          )}
        >
          <p className="text-sm font-medium">{step.label}</p>
        </button>
        {step.description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {step.description}
          </p>
        )}
      </div>
    </li>
  );
}

function VerticalTracker({
  steps,
  onStepClick,
  interactive,
}: Readonly<{
  steps: Step[];
  onStepClick?: (index: number, step: Step) => void;
  interactive?: boolean;
}>) {
  return (
    <ul className="w-full" aria-label="Invoice progress steps">
      {steps.map((step, index) => (
        <VerticalStep
          key={step.label}
          step={step}
          index={index}
          totalSteps={steps.length}
          onStepClick={onStepClick}
          interactive={interactive}
        />
      ))}
    </ul>
  );
}

export function InvoiceTracker({
  steps,
  orientation = "horizontal",
  className,
  "aria-label": ariaLabel,
  onStepClick,
  interactive,
}: Readonly<InvoiceTrackerProps>) {
  // Calculate progress for screen readers
  const completedSteps = steps.filter((s) => s.status === "completed").length;
  const progress = Math.round((completedSteps / steps.length) * 100);

  return (
    <fieldset
      className={cn("w-full", className)}
      aria-label={
        ariaLabel ||
        `Invoice progress: ${progress}% complete, ${completedSteps} of ${steps.length} steps completed`
      }
    >
      {/* Hidden progress bar for screen readers */}
      <progress
        className="sr-only"
        value={completedSteps}
        max={steps.length}
        aria-valuetext={`Invoice progress: ${completedSteps} of ${steps.length} steps completed`}
      />

      {orientation === "horizontal" ? (
        <HorizontalTracker
          steps={steps}
          onStepClick={onStepClick}
          interactive={interactive}
        />
      ) : (
        <VerticalTracker
          steps={steps}
          onStepClick={onStepClick}
          interactive={interactive}
        />
      )}
    </fieldset>
  );
}
