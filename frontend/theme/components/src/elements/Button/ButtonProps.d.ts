import * as IconMap from 'lucide-react';

export type IconName = keyof typeof IconMap;
export type ButtonProps = {
  label?: string;
  onClick?: (e) => void;
  className?: string;
  loading?: boolean;
  icon?: IconName;
  variant?: string;
} & React.ComponentProps<'button'>;
