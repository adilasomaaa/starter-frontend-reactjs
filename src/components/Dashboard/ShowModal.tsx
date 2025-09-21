import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import React, { useEffect, useState } from 'react'
import type { DisplayFieldConfig } from '../../types';

function getNestedValue<T>(obj: T, path: string): any {
  return path.split('.').reduce((acc:any, part) => acc && acc[part], obj);
}

interface ShowModalProps<T> {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    data: T | null;
    fields: DisplayFieldConfig<T>[]
}


const ShowModal = <T,> ({isOpen, onClose, title, data, fields} : ShowModalProps<T>) => {
    if(!data) return null;
    
  return (
    <>
        <Modal isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                <ModalBody>
                    <dl className="divide-y divide-gray-100">
                        {fields.map((field) => (
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0" key={field.key}>
                            <dt className="text-sm font-medium leading-6 text-gray-900">{field.label}</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                {field.render ? field.render(data) : getNestedValue(data, field.key)}
                            </dd>
                        </div>
                        ))}
                    </dl>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                    Close
                    </Button>
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>
    </>
  )
}

export default ShowModal