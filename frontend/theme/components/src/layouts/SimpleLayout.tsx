import * as React from 'react';

export function SimpleLayout({ children }: React.ReactNode) {
  return (
    <div className="flex flex-1 flex-col muted">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4">
          {children}
        </div>
      </div>
    </div>
  );
}
