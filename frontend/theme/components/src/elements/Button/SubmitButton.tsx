import * as React from 'react';
import { ButtonBoilerplate } from './ButtonBoilerplate';
import { ButtonProps } from './ButtonProps';

export function SubmitButton({
  label,
  loading = false,
  onClick,
  className,
  ...props
}: ButtonProps) {
  return (
    <ButtonBoilerplate
      type="submit"
      //   className={'w-full'}
      label={label}
      loading={loading}
      icon={'Upload'}
      onClick={onClick}
      {...props}
    />
  );
}
