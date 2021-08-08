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

interface Props {
  token: string;
  email: string;
}

export default function ResetPassword({ token, email }: Props) {
  const route = useRoute();
  const form = useForm({
    token,
    email,
    password: '',
    password_confirmation: '',
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    form.post(route('password.update'), {
      onFinish: () => form.reset('password', 'password_confirmation'),
    });
  }

  return (
    <JetAuthenticationCard>
      <Head title="Reset Password" />

      <JetValidationErrors className="mb-4" />

      <form onSubmit={onSubmit}>
        <div>
          <JetLabel htmlFor="email">Email</JetLabel>
          <JetInput
            id="email"
            type="email"
            className="mt-1 block w-full"
            value={form.data.email}
            onChange={e => form.setData('email', e.currentTarget.value)}
            required
            autoFocus
          />
        </div>

        <div className="mt-4">
          <JetLabel htmlFor="password">Password</JetLabel>
          <JetInput
            id="password"
            type="password"
            className="mt-1 block w-full"
            value={form.data.password}
            onChange={e => form.setData('password', e.currentTarget.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="mt-4">
          <JetLabel htmlFor="password_confirmation">Confirm Password</JetLabel>
          <JetInput
            id="password_confirmation"
            type="password"
            className="mt-1 block w-full"
            value={form.data.password_confirmation}
            onChange={e =>
              form.setData('password_confirmation', e.currentTarget.value)
            }
            required
            autoComplete="new-password"
          />
        </div>

        <div className="flex items-center justify-end mt-4">
          <JetButton
            className={classNames({ 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Reset Password
          </JetButton>
        </div>
      </form>
    </JetAuthenticationCard>
  );
}
