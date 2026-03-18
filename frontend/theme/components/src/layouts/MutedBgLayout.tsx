import * as React from 'react';

export function MutedBgLayout({ children }: React.ReactNode) {
  return (
    <div className="bg-muted flex flex-1 flex-col min-h-[90vh]">
      <div className="@container/main flex flex-1 flex-col ">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4">
          {children}
        </div>
      </div>
    </div>
  );
}
