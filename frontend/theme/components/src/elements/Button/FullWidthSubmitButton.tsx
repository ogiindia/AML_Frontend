import React from 'react';
import { ButtonBoilerplate } from './ButtonBoilerplate';
import { ButtonProps } from './ButtonProps';

export const FullWidthSubmitButton = ({
  label,
  loading = false,
  onClick,
  className,
  ...props
}: ButtonProps) => (
  <ButtonBoilerplate
    type="submit"
    className={'w-full'}
    label={label}
    loading={loading}
    onClick={onClick}
    {...props}
  />
);
