import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

const Button = (props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => {
  return <button {...props} className="dark:bg-green-300 dark:text-gray-800 rounded min-w-0 p-2" />;
}

export default Button;