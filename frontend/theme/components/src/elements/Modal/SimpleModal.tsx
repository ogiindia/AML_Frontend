import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';

export function SimpleModal({
  isOpen,
  title,
  handleClose,
  children,
  close,
  className,
  size = 'sm',
}: any) {
  if (!isOpen) return null;

  const [open, setopen] = React.useState(false);

  React.useEffect(() => {
    setopen(isOpen);
  }, [isOpen]);

  return (
    <>
      <div className="">
        <Dialog open={open}>
          <DialogContent size={size} handleClose={handleClose}>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>
                <div className="p-2">{children}</div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
