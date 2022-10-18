import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  useEffect,
  useRef,
} from "react";

type Button = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  hasFocus?: boolean;
};

export const Button = ({ hasFocus = false, ...props }: Button) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (hasFocus) {
      buttonRef.current?.focus();
    }
  }, [hasFocus]);

  return (
    <button
      ref={buttonRef}
      display="flex"
      flex="row"
      justify="center"
      align="items-center"
      p="2 <sm:1"
      animate="hover:pulse focus:pulse"
      border="1 dark-50 hover:green-300 focus:green-300 rounded"
      outline="focus:none"
      text="gray-200 <sm:sm"
      {...props}
    />
  );
};

type IconButton = Omit<Button, "icon"> & {
  icon: IconDefinition;
  ariaLabel: string;
};

export const IconButton = ({
  hasFocus = false,
  icon,
  ariaLabel,
  children,
  ...props
}: IconButton) => {
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
      display="flex"
      flex={`row ${props.flex ?? ""}`}
      justify="content-center"
      align="items-center"
      p="2"
      animate="hover:pulse focus:pulse"
      border="dark-50 1 hover:green-300 focus:green-300 rounded"
      outline="focus:none"
      text={`gray-200 ${props.text ?? ""}`}
    >
      <span m="r-2">
        <FontAwesomeIcon icon={icon} />
      </span>
      {children}
    </button>
  );
};
