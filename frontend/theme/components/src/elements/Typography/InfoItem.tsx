import React from 'react';
import { cn } from '../../lib/utils'; // shadcn utility for merging class names

interface InfoItemProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const InfoItem: React.FC<InfoItemProps> = ({
  title,
  children,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-0.5 text-sm', className)}>
      <span className="text-muted-foreground">{title}</span>
      <div className="font-medium">{children}</div>
    </div>
  );
};
