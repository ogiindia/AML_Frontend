import * as React from 'react';

export function PlainLayout({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={`bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 ${className}`}
    >
      <div className={`flex w-full flex-col gap-6`}>{children}</div>
    </div>
  );
}
