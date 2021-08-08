// @ts-ignore
import { InertiaLink, useForm, Head } from '@inertiajs/inertia-react';
import classNames from 'classnames';
import React from 'react';
import useRoute from '@/Hooks/useRoute';
import JetAuthenticationCard from '@/Jetstream/AuthenticationCard';
import JetButton from '@/Jetstream/Button';
import JetCheckbox from '@/Jetstream/Checkbox';
import JetInput from '@/Jetstream/Input';
import JetLabel from '@/Jetstream/Label';
import JetValidationErrors from '@/Jetstream/ValidationErrors';

interface Props {
  canResetPassword: boolean;
  status: string;
}

export default function Login({ canResetPassword, status }: Props) {
  const route = useRoute();
  const form = useForm({
    email: '',
    password: '',
    remember: '',
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    form.post(route('login'), {
      onFinish: () => form.reset('password'),
    });
  }

  return (
    <JetAuthenticationCard>
      <Head title="login" />

      <JetValidationErrors className="mb-4" />

      {status && (
        <div className="mb-4 font-medium text-sm text-green-600">{status}</div>
      )}

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
            autoComplete="current-password"
          />
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <JetCheckbox
              name="remember"
              checked={form.data.remember === 'on'}
              onChange={e =>
                form.setData('remember', e.currentTarget.checked ? 'on' : '')
              }
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
        </div>

        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0 mt-4">
          {canResetPassword && (
            <div>
              <InertiaLink
                href={route('password.request')}
                className="underline text-sm text-gray-600 hover:text-gray-900"
              >
                Forgot your password?
              </InertiaLink>
            </div>
          )}

          <div className="flex items-center justify-end">
            <InertiaLink
              href={route('register')}
              className="underline text-sm text-gray-600 hover:text-gray-900"
            >
              Need an account?
            </InertiaLink>

            <JetButton
              className={classNames('ml-4', { 'opacity-25': form.processing })}
              disabled={form.processing}
            >
              Log in
            </JetButton>
          </div>
        </div>
      </form>
    </JetAuthenticationCard>
  );
}
