import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from '@heroui/react';
import type { FormFieldConfig } from '../../types';
import { isEqual } from 'lodash';

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FormFieldConfig[];
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
  register: any;
  errors: any;
  setValue: any;
  watch: any;
}

const getValueByDotNotation = (obj: Record<string, any>, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const InputModal = ({ isOpen, 
  onClose, 
  title, 
  fields, 
  onSubmit, 
  isLoading, 
  register, 
  errors,
  setValue,
  watch 
}: InputModalProps) => {

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
      <ModalContent>
        {(onClose) => (
          <form onSubmit={onSubmit}>
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
                        selectedKeys={watch(field.key) ? [watch(field.key)] : []}
                        onChange={(e) => setValue(field.key, e.target.value, { shouldValidate: true })}
                        isInvalid={!!errors[field.key]}
                        errorMessage={errors[field.key]?.message as string}
                      >
                        {field.options?.map((option) => (
                          <SelectItem key={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    );
                  case 'multi-select':
                    return (
                      <Select
                        key={field.key}
                        label={field.label}
                        placeholder={field.placeholder}
                        selectionMode="multiple"
                        selectedKeys={(watch(field.key) || []).map(String)}
                        onSelectionChange={(keys: Set<string>) => {
                          const numericValues = Array.from(keys).map(key => Number(key));
                          setValue(field.key, numericValues, { shouldValidate: true });
                        }}
                        isInvalid={!!errors[field.key]}
                        errorMessage={errors[field.key]?.message as string}
                      >
                        {field.options?.map((option) => (
                          // 3. Hapus properti 'value', cukup 'key' saja
                          <SelectItem key={String(option.value)}> 
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    );
                  default: // text, email, password
                    return (
                      <div key={field.key}>
                        <Input
                          type={field.type}
                          label={field.label}
                          placeholder={field.placeholder}
                          {...register(field.key)}
                          isInvalid={!!errors[field.key]}
                          errorMessage={errors[field.key]?.message as string}
                        />
                      </div>
                    );
                }
              })}
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="flat" onPress={onClose}>
                Batal
              </Button>
              <Button color="primary" type="submit" isLoading={isLoading}>
                Simpan
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default InputModal;