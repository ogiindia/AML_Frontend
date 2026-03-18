import { Switch } from 'antd';
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

export function ConfirmToggle({
  id,
  checked,
  children,
  callback,
  ...props
}: React.ComponentProps<'input'>) {
  const [showmodal, setshowmodal] = useState(false);

  function handleDelete() {
    if (callback) callback(id);
    setshowmodal(false);
  }

  const handleClose = () => setshowmodal(false);
  const handleShow = () => setshowmodal(true);

  return (
    <>
      <div>
        <Switch
          size="small"
          defaultChecked={checked}
          checked={checked}
          className={`react-switch`}
          onChange={handleShow}
          onClick={handleShow}
          // onColor={globalstate && globalstate.appPrimaryColor}
          // onHandleColor="#2693e6"
          id={id}
        />

        <Modal show={showmodal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Toggle Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to {checked ? 'disable' : 'enable'} this item?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={handleDelete} {...props}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
