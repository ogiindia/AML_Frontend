import { OverlayTrigger, OverlayTriggerProps, Tooltip } from 'react-bootstrap';

import * as React from 'react';

export function ToolTip({
  location = 'right',
  message,
  children,
}: OverlayTriggerProps & React.ComponentProps<'div'>) {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {message}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement={location}
      delay={{ show: 250, hide: 250 }}
      overlay={renderTooltip}
      children={children}
    ></OverlayTrigger>
  );
}
