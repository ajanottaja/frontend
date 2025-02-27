import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  useEffect,
  useRef,
} from "react";

type ButtonSize = "xsmall" | "small" | "default";

type Button = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  hasFocus?: boolean;
  size?: ButtonSize;
  className?: string;
};

const buttonSizeClasses: Record<ButtonSize, string> = {
  xsmall: "h-7 min-w-7 px-2 py-1 text-xs",
  small: "h-9 min-w-9 px-3 py-1.5 text-sm",
  default: "h-12 min-w-12 px-6 py-3",
};

export const Button = ({ hasFocus = false, size = "default", className, ...props }: Button) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (hasFocus) {
      buttonRef.current?.focus();
    }
  }, [hasFocus]);

  return (
    <button
      {...props}
      ref={buttonRef}
      className={`
        flex items-center justify-center gap-2
        ${buttonSizeClasses[size]}
        rounded-lg
        bg-stone-800/50 
        text-gray-300 font-medium
        transition-all duration-200
        hover:bg-stone-700/50
        focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-stone-900
        disabled:opacity-50 disabled:cursor-not-allowed
        cursor-pointer
        ${className || ''}
      `}
    />
  );
};

type IconPosition = "left" | "right";

type IconButton = Omit<Button, "icon"> & {
  icon: IconDefinition;
  ariaLabel: string;
  iconPosition?: IconPosition;
};

export const IconButton = ({
  hasFocus = false,
  icon,
  ariaLabel,
  children,
  size = "default",
  iconPosition = "left",
  className,
  ...props
}: IconButton) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (hasFocus) {
      buttonRef.current?.focus();
    }
  }, [hasFocus]);

  const iconElement = <FontAwesomeIcon icon={icon} />;

  return (
    <button
      {...props}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        props.onClick?.(e);
      }}
      ref={buttonRef}
      aria-label={ariaLabel}
      className={`
        flex items-center justify-center gap-2
        ${buttonSizeClasses[size]}
        rounded-lg
        bg-stone-800/50 
        text-gray-300 font-medium
        transition-all duration-200
        hover:bg-stone-700/50
        focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-stone-900
        disabled:opacity-50 disabled:cursor-not-allowed
        cursor-pointer
        ${className || ''}
      `}
    >
      {iconPosition === "left" && (
        <>
          {iconElement}
          {children && <span>{children}</span>}
        </>
      )}
      {iconPosition === "right" && (
        <>
          {children && <span>{children}</span>}
          {iconElement}
        </>
      )}
    </button>
  );
};
