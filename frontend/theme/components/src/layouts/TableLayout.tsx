import * as React from 'react';

export function TableLayout({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={`flex min-h-svh flex-col items-stretch justify-start gap-6 p-3 ${className}`}
    >
      <div className={`flex w-full flex-col gap-6`}>{children}</div>
    </div>
  );
}
