import * as React from 'react';

const widthMap: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  na: '',
};

export function PageCenterLayout({
  className,
  children,
  title,
  logo,
  size = 'sm',
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={`flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 ${className}`}
    >
      <div className={`flex w-full ${widthMap[size]} flex-col gap-6`}>
        {title && (
          <a
            href="#"
            className="flex items-center gap-2 self-center font-medium"
          >
            {title}
          </a>
        )}
        {children}
      </div>
    </div>
  );
}
