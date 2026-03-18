import { Loader2 } from 'lucide-react';
import * as React from 'react';

export function InlineLoadingComponent() {
  return (
    <>
      <Loader2 className={`size-5 animate-spin`} />
    </>
  );
}
