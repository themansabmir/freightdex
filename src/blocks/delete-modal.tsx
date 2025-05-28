import React from 'react';

import { CircleAlert } from 'lucide-react';
import { Modal } from '@shared/components/Modal';
import { Button, Typography } from '@shared/components';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = 'Delete',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <Modal.Header>
        <div className="flex items-center gap-1 px-3">
          <CircleAlert color="red" className="mt-1 mr-1" />
          <Typography weight="medium" variant="lg" addClass="sub_label">
            {title}
          </Typography>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="sub_label mt-4">
          <Typography variant="sm" addClass="sub_label" align="center">
            {message}
          </Typography>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex gap-2 justify-end px-4">
          <Button variant="neutral" type="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant="destructive" type="solid" onClick={onConfirm} isLoading={isLoading}>
            {confirmText}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
