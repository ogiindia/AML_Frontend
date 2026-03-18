import * as React from 'react';
import { Separator } from '../../components/ui/separator';

interface DividerProps {
  orientation?: string; //vertical or horizontal,
  decorative?: string;
  className?: string;
}

export function Divider({
  className,
  orientation = 'vertical',
  decorative = true,
}: DividerProps & React.ComponentProps<'div'>) {
  return (
    <Separator
      className={className}
      orientation={orientation}
      decorative={decorative}
    />
  );
}
