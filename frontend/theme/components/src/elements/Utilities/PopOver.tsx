import * as React from 'react';
import { useRef, useState } from 'react';
import { Overlay, Popover } from 'react-bootstrap';
import { Gear } from 'react-bootstrap-icons';

export function PopOver({ children, size, show }: any) {
  const ref = useRef(null);
  const [popOver, SetPopover] = useState(false);
  const [popOverTarget, SetPopOverTarget] = useState();

  const storePopOver = (event) => {
    SetPopOverTarget(event.target);
    SetPopover(!popOver);
  };

  const OverLayPopOver = () => (
    <Overlay
      show={popOver}
      target={popOverTarget}
      placement="bottom"
      container={ref}
      containerPadding={40}
      children={
        <Popover id="popover-contained">
          <Popover.Body>{children}</Popover.Body>
        </Popover>
      }
    ></Overlay>
  );

  return (
    <>
      <div ref={ref}>
        <span className={`cursor-pointer`} onClick={storePopOver}>
          <Gear size={size} />
        </span>
        <OverLayPopOver>{children}</OverLayPopOver>
      </div>
    </>
  );
}
