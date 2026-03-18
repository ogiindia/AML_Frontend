import { Check2, Exclamation, Info } from 'react-bootstrap-icons';

import React from 'react';


export function StatusBlock({ message, icon = null, type = 'success' } : any) {
  const renderIcons = () => {
    if (icon) return icon;

    switch (type) {
      case 'success':
        return <Check2 size={30} />;
      case 'error':
        return <Exclamation size={30} />;
      case 'info':
        return <Info size={30} />;
      default:
        <></>;
    }
  };

  return (
    <>
      <div className={`error-text status-${type}`}>
        <p>
          {renderIcons()}
          <span>{message || type}</span>
        </p>
      </div>
    </>
  );
}