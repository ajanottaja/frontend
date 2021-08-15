import React, { ButtonHTMLAttributes, DetailedHTMLProps, useEffect, useRef } from 'react';

type Button = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  hasFocus?: boolean;
}

export const Button = ({hasFocus = false, ...props}: Button) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if (hasFocus) {
      buttonRef.current?.focus();
    }
  }, [hasFocus])

  return <button {...props} ref={buttonRef} className="border border-1 dark:border-green-300 dark:text-green-300 border-green-600 text-green-600 rounded min-w-0 p-2 hover:animate-pulse outline-none focus:ring focus:ring-1 focus:ring-green-600 focus:animate-pulse" />;
}

type IconButton = Button & {
  icon: string;
  ariaLabel: string;
}

export const IconButton = ({hasFocus = false, icon, ariaLabel, children, ...props}: IconButton) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    if (hasFocus) {
      buttonRef.current?.focus();
    }
  }, [hasFocus])

  return <button {...props} ref={buttonRef} aria-label={ariaLabel} title={ariaLabel} className="flex flex-row justify-center items-center border border-2 dark:border-green-300 dark:text-green-300 border-green-600 text-green-600 rounded min-w-0 p-2 hover:animate-pulse outline-none focus:ring focus:ring-1 focus:ring-green-600 focus:animate-pulse">
      <span className={`${icon} mr-2`}></span>
      {children}
    </button>;
};
