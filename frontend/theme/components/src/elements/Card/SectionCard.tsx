import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { gapMap } from '../Map';

interface TableCardProps {
  title?: string;
  subtitle?: string;
  count?: number;
  className?: string;
  customHeaderComponents?: React.ReactNode;
  table?: boolean;
  gap?: number;
  totalElements?: number;
  pageSize?: number;
  currentElement?: number;
  pagingCallback?: (e) => void;
  showPaging?: boolean;
  filterCallback?: () => void;
  refreshCallBack?: () => void;
  children?: React.ReactNode;
  padding?: boolean;
}

export function SectionCard({ title, children, subtitle, gap, className, padding }: TableCardProps) {
  // const clasName = `flex flex-row items-center justify-between space-y-0 pb-2 ${className}`;
  const classname = `space-y-0 pb-2 ${className}`;

  return (
    <>
      <Card className={`${gapMap[gap]}`} padding={padding}>
        {title && (
          <CardHeader className={`${classname}`}>
            <CardTitle className="text-md font-semibold">{title}</CardTitle>
            {subtitle && (<CardDescription>{subtitle}</CardDescription>)}
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
      </Card>
    </>
  );
}
