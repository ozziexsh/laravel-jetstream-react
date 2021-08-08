// @ts-ignore
import { useForm, Head } from '@inertiajs/inertia-react';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import JetAuthenticationCard from '@/Jetstream/AuthenticationCard';
import JetButton from '@/Jetstream/Button';
import JetInput from '@/Jetstream/Input';
import JetLabel from '@/Jetstream/Label';
import JetValidationErrors from '@/Jetstream/ValidationErrors';

export default function TwoFactorChallenge() {
  const route = useRoute();
  const [recovery, setRecovery] = useState(false);
  const form = useForm({
    code: '',
    recovery_code: '',
  });
  const recoveryCodeRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  function toggleRecovery(e: React.FormEvent) {
    e.preventDefault();
    setRecovery(true);

    setTimeout(() => {
      if (recovery) {
        recoveryCodeRef.current?.focus();
        form.setData('code', '');
      } else {
        codeRef.current?.focus();
        form.setData('recovery_code', '');
      }
    }, 100);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    form.post(route('two-factor.login'));
  }

  return (
    <JetAuthenticationCard>
      <Head title="Two-Factor Confirmation" />

      <div className="mb-4 text-sm text-gray-600">
        {recovery
          ? 'Please confirm access to your account by entering one of your emergency recovery codes.'
          : 'Please confirm access to your account by entering the authentication code provided by your authenticator application.'}
      </div>

      <JetValidationErrors className="mb-4" />

      <form onSubmit={onSubmit}>
        {recovery ? (
          <div>
            <JetLabel htmlFor="recovery_code">Recovery Code</JetLabel>
            <JetInput
              id="recovery_code"
              type="text"
              className="mt-1 block w-full"
              value={form.data.recovery_code}
              onChange={e =>
                form.setData('recovery_code', e.currentTarget.value)
              }
              ref={recoveryCodeRef}
              autoComplete="one-time-code"
            />
          </div>
        ) : (
          <div>
            <JetLabel htmlFor="code">Code</JetLabel>
            <JetInput
              id="code"
              type="text"
              inputMode="numeric"
              className="mt-1 block w-full"
              value={form.data.code}
              onChange={e => form.setData('code', e.currentTarget.value)}
              autoFocus
              autoComplete="one-time-code"
              ref={codeRef}
            />
          </div>
        )}

        <div className="flex items-center justify-end mt-4">
          <button
            type="button"
            className="text-sm text-gray-600 hover:text-gray-900 underline cursor-pointer"
            onClick={toggleRecovery}
          >
            {recovery ? 'Use an authentication code' : 'Use a recovery code'}
          </button>

          <JetButton
            className={classNames('ml-4', { 'opacity-25': form.processing })}
            disabled={form.processing}
          >
            Log in
          </JetButton>
        </div>
      </form>
    </JetAuthenticationCard>
  );
}
