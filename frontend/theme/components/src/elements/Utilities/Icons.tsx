// import { toCamelCase } from '@ais/utils';
// import * as React from 'react';
// import * as IconMap from 'react-bootstrap-icons';

// export const IconWrapper = ({
//   iconName,
//   size = 14,
//   color = 'inherit',
//   className = '',
// }: any) => {
//   if (typeof iconName == 'string' && iconName.includes('false')) return null;
//   if (typeof iconName === 'boolean' && !iconName) return null;
//   const IconComponent = IconMap[toCamelCase(iconName)];
//   if (!IconComponent) {
//     console.warn(`Icon with name ${iconName} does not exists...`);
//     return null;
//   }

//   return <IconComponent size={size} color={color} className={className} />;
// };

import * as IconMap from 'lucide-react';

import { cn } from '../../lib/utils';

import * as React from 'react';

export type IconName = keyof typeof IconMap;

interface IconProps {
  name?: IconName;
  className?: string;
  size?: number;
  icon?: IconName;
  onClick?: () => void;
}

export const Icons = ({ name, className, size = 5, icon, onClick }: IconProps) => {
  // console.log('name : ' + name);

  const LucideIcon = IconMap[(name || icon).toString()];

  if (!LucideIcon) return null;

  return <LucideIcon className={cn('stroke-current', className)} size={size} onClick={onClick} />;
};
