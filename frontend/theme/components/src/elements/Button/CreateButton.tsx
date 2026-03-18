import * as React from 'react';
import { ButtonBoilerplate } from './ButtonBoilerplate';
import { ButtonProps } from './ButtonProps';

export function CreateButton({
  label,
  loading = false,
  onClick,
  className,
  ...props
}: ButtonProps) {
  return (
    <ButtonBoilerplate
      type="button"
      size={'sm'}
      //   className={'w-full'}
      label={label}
      loading={loading}
      icon={'Plus'}
      onClick={onClick}
      {...props}
    />
  );
}
