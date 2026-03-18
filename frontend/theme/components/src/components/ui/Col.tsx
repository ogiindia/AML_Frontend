import * as React from 'react';
import { widthMap } from '../../elements/Map';
interface ColProps {
  children?: React.ReactNode;
  span?: string; //width like 1/2 1/3 etc
  md?: string;
  lg?: string;
  xl?: string;
  className?: string;
  padding?: boolean;
}

export function Col({
  children,
  span = '12',
  md,
  lg,
  xl,
  className = '',
  padding = true,
}: ColProps & React.ComponentProps<"div">) {
  const base = widthMap[span] || `w-full`;
  const mdClass = md ? `md:${widthMap[md]}` : '';
  const lgClass = lg ? `lg:${widthMap[lg]}` : '';
  const xlClass = xl ? `xl:${widthMap[xl]}` : '';


  return (
    <div
      className={`${padding && 'px-2 md-4'}  ${base} ${mdClass} ${lgClass} ${xlClass} ${className}`}
    >
      {children}
    </div>
  );
}
