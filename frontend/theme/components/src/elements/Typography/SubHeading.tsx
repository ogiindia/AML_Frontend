import * as React from 'react';

export function Subheading({children} : any) {
    return ( <p className="text-muted-foreground text-sm text-balance">
            {children}
          </p>  );
}
