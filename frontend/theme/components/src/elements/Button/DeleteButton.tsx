import React, { useState } from 'react';
import { DialogFooter } from '../../components/ui/dialog';
import { SimpleModal } from '../Modal';
import { ButtonBoilerplate } from './ButtonBoilerplate';

interface DeleteButtonProps {
  children: React.ReactNode;
  callback: () => void;
  title?: string;
  desc?: string;
}

export function DeleteButton({
  children,
  callback,
  title = 'Delete Confirmation',
  desc = 'Are you sure you want to delete this item? This action cannot be undone.',
  loading = false,
  ...props
}: DeleteButtonProps & React.ComponentProps<'button'>) {
  const [showmodal, setshowmodal] = useState(false);

  function handleDelete() {
    if (callback) callback();
    setshowmodal(false);
  }

  const handleClose = () => setshowmodal(false);
  const handleShow = () => setshowmodal(true);

  return (
    <div>
      <ButtonBoilerplate
        variant="destructive"
        onClick={() => setshowmodal(true)}
        icon={'Trash'}
        size={'sm'}
        {...props}
        label={children}
      />

      <SimpleModal handleClose={handleClose} title={title} isOpen={showmodal}>
        {desc}
        <DialogFooter>
          <ButtonBoilerplate variant="secondary" onClick={handleClose}>
            Cancel
          </ButtonBoilerplate>
          <ButtonBoilerplate
            variant="destructive"
            loading={loading}
            onClick={handleDelete}
            {...props}
          >
            Confirm
          </ButtonBoilerplate>
        </DialogFooter>
      </SimpleModal>
      {/* <Modal show={showmodal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this item? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} {...props}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  );
}
