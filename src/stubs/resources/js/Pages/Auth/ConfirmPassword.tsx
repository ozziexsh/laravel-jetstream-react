// @ts-ignore
import { useForm, Head } from '@inertiajs/inertia-react';
import classNames from 'classnames';
import React from 'react';
import useRoute from '@/Hooks/useRoute';
import JetAuthenticationCard from '@/Jetstream/AuthenticationCard';
import JetButton from '@/Jetstream/Button';
import JetInput from '@/Jetstream/Input';
import JetLabel from '@/Jetstream/Label';
import JetValidationErrors from '@/Jetstream/ValidationErrors';

export default function ConfirmPassword() {
  const route = useRoute();
  const form = useForm({
    password: '',
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    form.post(route('password.confirm'), {
      onFinish: () => form.reset(),
    });
  }

  return (
    <JetAuthenticationCard>
      <Head title="Secure Area" />

      <div className="mb-4 text-sm text-gray-600">
        This is a secure area of the application. Please confirm your password
        before continuing.
      </div>

      <JetValidationErrors className="mb-4" />

      <form onSubmit={onSubmit}>
        <div>
          <JetLabel htmlFor="password">Password</JetLabel>
          <JetInput
            id="password"
            type="password"
            className="mt-1 block w-full"
            value={form.data.password}
            onChange={e => form.setData('password', e.currentTarget.value)}
            required
            autoComplete="current-password"
            autoFocus
          />
        </div>

        <div className="flex justify-end mt-4">
          <JetButton
            className={classNames('ml-4', { 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Confirm
          </JetButton>
        </div>
      </form>
    </JetAuthenticationCard>
  );
}
