import axios from 'axios';
import classNames from 'classnames';
import React, { PropsWithChildren, useRef, useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import JetButton from '@/Jetstream/Button';
import JetDialogModal from '@/Jetstream/DialogModal';
import JetInput from '@/Jetstream/Input';
import JetInputError from '@/Jetstream/InputError';
import JetSecondaryButton from '@/Jetstream/SecondaryButton';

interface Props {
  title?: string;
  content?: string;
  button?: string;
  onConfirm(): void;
}

export default function JetConfirmsPassword({
  title = 'Confirm Password',
  content = 'For your security, please confirm your password to continue.',
  button = 'Confirm',
  onConfirm,
  children,
}: PropsWithChildren<Props>) {
  const route = useRoute();
  const [confirmingPassword, setConfirmingPassword] = useState(false);
  const [form, setForm] = useState({
    password: '',
    error: '',
    processing: false,
  });
  const passwordRef = useRef<HTMLInputElement>(null);

  function startConfirmingPassword() {
    axios.get(route('password.confirmation')).then(response => {
      if (response.data.confirmed) {
        onConfirm();
      } else {
        setConfirmingPassword(true);

        setTimeout(() => passwordRef.current?.focus(), 250);
      }
    });
  }

  function confirmPassword() {
    setForm({ ...form, processing: true });

    axios
      .post(route('password.confirm'), {
        password: form.password,
      })
      .then(() => {
        closeModal();
        setTimeout(() => onConfirm(), 250);
      })
      .catch(error => {
        setForm({
          ...form,
          processing: false,
          error: error.response.data.errors.password[0],
        });
        passwordRef.current?.focus();
      });
  }

  function closeModal() {
    setConfirmingPassword(false);
    setForm({ processing: false, password: '', error: '' });
  }

  return (
    <span>
      <span onClick={startConfirmingPassword}>{children}</span>

      <JetDialogModal isOpen={confirmingPassword} onClose={closeModal}>
        <JetDialogModal.Content title={title}>
          {content}

          <div className="mt-4">
            <JetInput
              type="password"
              className="mt-1 block w-3/4"
              placeholder="Password"
              value={form.password}
              onChange={e =>
                setForm({ ...form, password: e.currentTarget.value })
              }
            />

            <JetInputError message={form.error} className="mt-2" />
          </div>
        </JetDialogModal.Content>

        <JetDialogModal.Footer>
          <JetSecondaryButton onClick={closeModal}>Cancel</JetSecondaryButton>

          <JetButton
            className={classNames('ml-2', { 'opacity-25': form.processing })}
            onClick={confirmPassword}
            disabled={form.processing}
          >
            {button}
          </JetButton>
        </JetDialogModal.Footer>
      </JetDialogModal>
    </span>
  );
}
