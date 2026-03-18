import React from 'react';

function ReadOnlyField({ title, children, className }) {
  return (
    <>
      <div className="p-1">
        <div className="p-2">
          <span className="mini-card-heading capitalize">{title}</span>
          <div className={`p bold ${className}`}>
            <h5>{children}</h5>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReadOnlyField;
