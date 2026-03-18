import * as React from 'react';
import { ButtonBoilerplate } from './ButtonBoilerplate';
import { ButtonProps } from './ButtonProps';

export function Button({
  label,
  loading = false,
  onClick,
  className,
  type = 'button',
  icon,
  ...props
}: ButtonProps) {
  return (
    <ButtonBoilerplate
      type={type}
      label={label}
      loading={loading}
      icon={icon}
      onClick={onClick}
      {...props}
    />
  );
}
