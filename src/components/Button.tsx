import React, { ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'PRIMARY' | 'SECONDARY';
  asChild?: boolean;
}

export function Button({
  children,
  variant,
  asChild,
  className,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : 'button';

  return (
    <Component
      className={`flex justify-center items-center text-body w-full h-[49px] rounded-[6px] cursor-pointer
      ${className}`}
      {...props}
    >
      <span className="flex justify-center items-center text-[17.5px] font-semibold  w-full">
        {children}
      </span>
    </Component>
  );
}
