import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { AlertTriangleIcon } from 'lucide-react';
import React from 'react'

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    isLoading: boolean
}

const DeleteModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }: DeleteModalProps) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <AlertTriangleIcon className="text-red-500" />
              {title}
            </ModalHeader>
            <ModalBody>
              <p>{message}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="flat" onPress={onClose}>
                Batal
              </Button>
              <Button color="danger" onPress={onConfirm} isLoading={isLoading}>
                Ya, Hapus
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default DeleteModal