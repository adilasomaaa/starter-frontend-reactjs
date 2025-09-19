import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from '@heroui/react';
import type { FormFieldConfig } from '../../types';
import { isEqual } from 'lodash';

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FormFieldConfig[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  isLoading: boolean;
}

const getValueByDotNotation = (obj: Record<string, any>, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const InputModal = ({ isOpen, onClose, title, fields, initialData = {}, onSubmit, isLoading }: InputModalProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Inisialisasi form data saat modal dibuka atau initialData berubah
  useEffect(() => {
    if (isOpen) {
    const initialFormState = fields.reduce((acc, field) => {
        // Gunakan helper function untuk mendapatkan nilai
        const value = getValueByDotNotation(initialData, field.key);
        acc[field.key] = value || field.defaultValue || '';
        return acc;
      }, {} as Record<string, any>);
    
    setFormData(initialFormState);
  }
  }, [isOpen]);

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              {fields.map((field) => {
                switch (field.type) {
                  case 'select':
                    return (
                      <Select
                        key={field.key}
                        label={field.label}
                        placeholder={field.placeholder}
                        selectedKeys={[formData[field.key]]}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                      >
                        {field.options.map((option) => (
                          <SelectItem key={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    );
                  default: // text, email, password
                    return (
                      <Input
                        key={field.key}
                        type={field.type}
                        label={field.label}
                        placeholder={field.placeholder}
                        value={formData[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                      />
                    );
                }
              })}
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="flat" onPress={onClose}>
                Batal
              </Button>
              <Button color="primary" onPress={handleSubmit} isLoading={isLoading}>
                Simpan
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default InputModal;