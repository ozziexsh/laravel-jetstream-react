import { useForm } from '@inertiajs/inertia-react';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import JetActionSection from '@/Jetstream/ActionSection';
import JetDangerButton from '@/Jetstream/DangerButton';
import JetDialogModal from '@/Jetstream/DialogModal';
import JetInput from '@/Jetstream/Input';
import JetInputError from '@/Jetstream/InputError';
import JetSecondaryButton from '@/Jetstream/SecondaryButton';

export default function DeleteUserForm() {
  const route = useRoute();
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const form = useForm({
    password: '',
  });
  const passwordRef = useRef<HTMLInputElement>(null);

  function confirmUserDeletion() {
    setConfirmingUserDeletion(true);

    setTimeout(() => passwordRef.current?.focus(), 250);
  }

  function deleteUser() {
    form.delete(route('current-user.destroy'), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => passwordRef.current?.focus(),
      onFinish: () => form.reset(),
    });
  }

  function closeModal() {
    setConfirmingUserDeletion(false);
    form.reset();
  }

  return (
    <JetActionSection
      title={'Delete Account'}
      description={'Permanently delete your account.'}
    >
      <div className="max-w-xl text-sm text-gray-600">
        Once your account is deleted, all of its resources and data will be
        permanently deleted. Before deleting your account, please download any
        data or information that you wish to retain.
      </div>

      <div className="mt-5">
        <JetDangerButton onClick={confirmUserDeletion}>
          Delete Account
        </JetDangerButton>
      </div>

      {/* <!-- Delete Account Confirmation Modal --> */}
      <JetDialogModal isOpen={confirmingUserDeletion} onClose={closeModal}>
        <JetDialogModal.Content title={'Delete Account'}>
          Are you sure you want to delete your account? Once your account is
          deleted, all of its resources and data will be permanently deleted.
          Please enter your password to confirm you would like to permanently
          delete your account.
          <div className="mt-4">
            <JetInput
              type="password"
              className="mt-1 block w-3/4"
              placeholder="Password"
              value={form.data.password}
              onChange={e => form.setData('password', e.currentTarget.value)}
            />

            <JetInputError message={form.errors.password} className="mt-2" />
          </div>
        </JetDialogModal.Content>
        <JetDialogModal.Footer>
          <JetSecondaryButton onClick={closeModal}>Cancel</JetSecondaryButton>

          <JetDangerButton
            onClick={deleteUser}
            className={classNames('ml-2', { 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Delete Account
          </JetDangerButton>
        </JetDialogModal.Footer>
      </JetDialogModal>
    </JetActionSection>
  );
}
