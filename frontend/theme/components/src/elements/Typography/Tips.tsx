import { CircleAlert, Info } from 'lucide-react';
import * as React from 'react';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';

interface TipsProps {
  id?: string;
  label?: string;
  labelType?: string;
  title?: string;
}

export function Tips({ id, label, labelType = 'default', title }: TipsProps) {
  return (
    <>
      <Alert id={id} variant={labelType}>
        {labelType != 'default' ? (
          <CircleAlert className="size-4" />
        ) : (
          <Info className="size-4" />
        )}
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>
          <p
            className={`text-sm`}
            dangerouslySetInnerHTML={{ __html: label }}
          ></p>
          {/* {label} */}
        </AlertDescription>
      </Alert>
    </>
  );
}
