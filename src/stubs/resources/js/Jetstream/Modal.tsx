import { Dialog, Transition } from '@headlessui/react';
import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';
import ReactDOM from 'react-dom';

export interface ModalProps {
  isOpen: boolean;
  onClose(): void;
  maxWidth?: string;
}

export default function JetModal({
  isOpen,
  onClose,
  maxWidth = '2xl',
  children,
}: PropsWithChildren<ModalProps>) {
  const maxWidthClass = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
  }[maxWidth];

  return ReactDOM.createPortal(
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        open={isOpen}
        onClose={onClose}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={classNames(
                'inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full',
                maxWidthClass,
              )}
            >
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>,
    document.body,
  );

  return ReactDOM.createPortal(
    <Transition show={isOpen} leave="duration-200">
      <div className="fixed inset-0 overflow-y-auto px-4 py-6 sm:px-0 z-50">
        <Transition
          show={isOpen}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 transform transition-all"
            onClick={onClose}
          >
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
        </Transition>

        <Transition
          show={isOpen}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            className={classNames(
              'mb-6 bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:mx-auto',
              maxWidthClass,
            )}
          >
            {children}
          </div>
        </Transition>
      </div>
    </Transition>,
    document.body,
  );
}
