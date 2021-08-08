import React, { PropsWithChildren } from 'react';
import JetModal, { ModalProps } from '@/Jetstream/Modal';

JetDialogModal.Content = function JetDialogModalContent({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <div className="px-6 py-4">
      <div className="text-lg">{title}</div>

      <div className="mt-4">{children}</div>
    </div>
  );
};

JetDialogModal.Footer = function JetDialogModalFooter({
  children,
}: PropsWithChildren<Record<string, unknown>>) {
  return <div className="px-6 py-4 bg-gray-100 text-right">{children}</div>;
};

export default function JetDialogModal({
  children,
  ...modalProps
}: PropsWithChildren<ModalProps>) {
  return <JetModal {...modalProps}>{children}</JetModal>;
}
