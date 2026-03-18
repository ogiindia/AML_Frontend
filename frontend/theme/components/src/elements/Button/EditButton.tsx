import * as React from 'react';
import { ButtonBoilerplate } from './ButtonBoilerplate';
import { ButtonProps } from './ButtonProps';

export function EditButton({
  label,
  loading = false,
  onClick,
  className,
  ...props
}: ButtonProps) {
  return (
    <ButtonBoilerplate
      type="button"
      //   className={'w-full'}
      label={label}
      loading={loading}
      size={'sm'}
      icon={'Edit'}
      onClick={onClick}
      {...props}
    />
  );
}
