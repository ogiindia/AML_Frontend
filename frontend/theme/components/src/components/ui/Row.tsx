import * as React from 'react';
import { alignMap, gapMap, justifyMap } from '../../elements/Map';

interface RowProps {
  children?: React.ReactNode;
  justify?: string; // 'start' | 'center' | 'end' | 'between'
  align?: string; // 'start' | 'center' | 'end' | 'stretch'
  gap?: string; // specify unit like 4 , 6 etc
  className?: string;
  direction?: string;
  nowrap?: boolean;
}

export const Row = ({
  children,
  justify = 'start',
  align = 'stretch',
  gap = '4',
  className = '',
  direction = 'row',
  nowrap = false,
}: RowProps & React.ComponentProps<"div">) => {
  const flexDirection = direction === 'row' ? 'flex-row' : 'flex-col';

  return (
    <div
      className={`flex ${nowrap ? '' : 'flex-wrap'} ${flexDirection} ${justifyMap[justify]} ${alignMap[align]} ${gapMap[gap]} ${className}`}
    >
      {children}
    </div>
  );
};
