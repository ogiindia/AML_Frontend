import * as React from 'react';

interface InputHelperProps {
  id?: string;
  text?: string;
  variant?: string;
}

export const VariantMap = {
  default: 'text-primary',
  destructive: 'text-desctructive',
  warning: 'text-warning',
  info: '',
};

export function InputHelper({ text, variant = 'info' }: InputHelperProps) {
  return (
    <>
      <p
        className={`${VariantMap[variant]} text-muted-foreground text-sm text-balance`}
      >
        {text}
      </p>
    </>
  );
}
