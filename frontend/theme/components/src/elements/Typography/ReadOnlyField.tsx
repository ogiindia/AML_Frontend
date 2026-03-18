import * as React from 'react';

export function ReadOnlyField({ title, children, className }) {
  return (
    <>
      <div className="p-1">
        <div className="p-2">
          <div className="text-xs text-slate-500">{title}</div>
          <div className={`mt-1 font-medium ${className}`}>{children}</div>
          {/* <span className="mini-card-heading capitalize">{title}</span>
          <div className={`p bold ${className}`}>
            <h5>{children}</h5>
          </div> */}
        </div>
      </div>
    </>
  );
}
