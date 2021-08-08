import { useForm } from '@inertiajs/inertia-react';
import classNames from 'classnames';
import React, { useRef } from 'react';
import useRoute from '@/Hooks/useRoute';
import JetActionMessage from '@/Jetstream/ActionMessage';
import JetButton from '@/Jetstream/Button';
import JetFormSection from '@/Jetstream/FormSection';
import JetInput from '@/Jetstream/Input';
import JetInputError from '@/Jetstream/InputError';
import JetLabel from '@/Jetstream/Label';

export default function UpdatePasswordForm() {
  const route = useRoute();
  const form = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const passwordRef = useRef<HTMLInputElement>(null);
  const currentPasswordRef = useRef<HTMLInputElement>(null);

  function updatePassword() {
    form.put(route('user-password.update'), {
      errorBag: 'updatePassword',
      preserveScroll: true,
      onSuccess: () => form.reset(),
      onError: () => {
        if (form.errors.password) {
          form.reset('password', 'password_confirmation');
          passwordRef.current?.focus();
        }

        if (form.errors.current_password) {
          form.reset('current_password');
          currentPasswordRef.current?.focus();
        }
      },
    });
  }

  return (
    <JetFormSection
      onSubmit={updatePassword}
      title={'Update Password'}
      description={
        'Ensure your account is using a long, random password to stay secure.'
      }
      renderActions={() => (
        <>
          <JetActionMessage on={form.recentlySuccessful} className="mr-3">
            Saved.
          </JetActionMessage>

          <JetButton
            className={classNames({ 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Save
          </JetButton>
        </>
      )}
    >
      <div className="col-span-6 sm:col-span-4">
        <JetLabel htmlFor="current_password">Current Password</JetLabel>
        <JetInput
          id="current_password"
          type="password"
          className="mt-1 block w-full"
          ref={currentPasswordRef}
          value={form.data.current_password}
          onChange={e =>
            form.setData('current_password', e.currentTarget.value)
          }
          autoComplete="current-password"
        />
        <JetInputError
          message={form.errors.current_password}
          className="mt-2"
        />
      </div>

      <div className="col-span-6 sm:col-span-4">
        <JetLabel htmlFor="password">New Password</JetLabel>
        <JetInput
          id="password"
          type="password"
          className="mt-1 block w-full"
          value={form.data.password}
          onChange={e => form.setData('password', e.currentTarget.value)}
          autoComplete="new-password"
          ref={passwordRef}
        />
        <JetInputError message={form.errors.password} className="mt-2" />
      </div>

      <div className="col-span-6 sm:col-span-4">
        <JetLabel htmlFor="password_confirmation">Confirm Password</JetLabel>
        <JetInput
          id="password_confirmation"
          type="password"
          className="mt-1 block w-full"
          value={form.data.password_confirmation}
          onChange={e =>
            form.setData('password_confirmation', e.currentTarget.value)
          }
          autoComplete="new-password"
        />
        <JetInputError
          message={form.errors.password_confirmation}
          className="mt-2"
        />
      </div>
    </JetFormSection>
  );
}
