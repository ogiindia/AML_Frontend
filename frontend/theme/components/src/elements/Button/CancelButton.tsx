import * as React from 'react';

import { ButtonBoilerplate } from './ButtonBoilerplate';
import { ButtonProps } from './ButtonProps';

export function CancelButton({
  label,
  loading = false,
  onClick,
  className,
  ...props
}: ButtonProps) {
  return (
    <ButtonBoilerplate
      type="button"
      className={className}
      label={label}
      loading={loading}
      icon={'X'}
      onClick={onClick}
      variant={'link'}
      {...props}
    />
  );
}
