import { LoadingComponent } from '@ais/components';
import React, { Suspense, useMemo } from 'react';
import { fetchComponent } from '../api/RemoteComponentAPI';

const DynamicComponent = ({ __id, data, children, ...props }) => {
  const Component = useMemo(() => {
    return React.lazy(async () => fetchComponent(__id));
  }, [__id]);

  return (
    <Suspense fallback={<LoadingComponent />}>
      <Component {...data} {...props}>
        {children}
      </Component>
    </Suspense>
  );
};

export default React.memo(DynamicComponent);
