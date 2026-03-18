import * as React from 'react';

export function InlineStatusText({
  variant = 'destructive',
  text,
  className,
}: React.ComponentProps<'p'>) {
  const VariantMap: Record<string, string> = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    warning: 'text-warning',
    info: 'text-info',
    destructive: 'text-destructive',
  };

  return (
    <div>
      <p
        data-slot="form-message"
        className={`text-sm ${VariantMap[variant]} ${className}`}
      >
        {text}
      </p>
    </div>
  );
}

export const abc = () => {
  return (
    <>
      <InlineStatusText variant={'info'} />
    </>
  );
};
