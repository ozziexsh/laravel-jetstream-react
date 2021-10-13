import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import axios from 'axios';
import classNames from 'classnames';
import React, { useState } from 'react';
import JetActionSection from '@/Jetstream/ActionSection';
import JetButton from '@/Jetstream/Button';
import JetConfirmsPassword from '@/Jetstream/ConfirmsPassword';
import JetDangerButton from '@/Jetstream/DangerButton';
import JetSecondaryButton from '@/Jetstream/SecondaryButton';

export default function TwoFactorAuthenticationForm() {
  const page = usePage<any>();
  const [enabling, setEnabling] = useState(false);
  const [disabling, setDisabling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const twoFactorEnabled = page.props?.user?.two_factor_enabled;

  function enableTwoFactorAuthentication() {
    setEnabling(true);

    axios.post('/user/two-factor-authentication').then(() => {
      Promise.all([showQrCode(), showRecoveryCodes()]).then(() => {
        setEnabling(false);
        Inertia.reload();
      });
    });
  }

  function showQrCode() {
    return axios.get('/user/two-factor-qr-code').then(response => {
      setQrCode(response.data.svg);
    });
  }

  function showRecoveryCodes() {
    return axios.get('/user/two-factor-recovery-codes').then(response => {
      setRecoveryCodes(response.data);
    });
  }

  function regenerateRecoveryCodes() {
    axios.post('/user/two-factor-recovery-codes').then(response => {
      showRecoveryCodes();
    });
  }

  function disableTwoFactorAuthentication() {
    setDisabling(true);

    axios.delete('/user/two-factor-authentication').then(() => {
      setDisabling(false);
      Inertia.reload();
    });
  }

  return (
    <JetActionSection
      title={'Two Factor Authentication'}
      description={
        'Add additional security to your account using two factor authentication.'
      }
    >
      {twoFactorEnabled ? (
        <h3 className="text-lg font-medium text-gray-900">
          You have enabled two factor authentication.
        </h3>
      ) : (
        <h3 className="text-lg font-medium text-gray-900">
          You have not enabled two factor authentication.
        </h3>
      )}

      <div className="mt-3 max-w-xl text-sm text-gray-600">
        <p>
          When two factor authentication is enabled, you will be prompted for a
          secure, random token during authentication. You may retrieve this
          token from your phone's Google Authenticator application.
        </p>
      </div>

      {twoFactorEnabled ? (
        <div>
          {qrCode ? (
            <div>
              <div className="mt-4 max-w-xl text-sm text-gray-600">
                <p className="font-semibold">
                  Two factor authentication is now enabled. Scan the following
                  QR code using your phone's authenticator application.
                </p>
              </div>

              <div
                className="mt-4"
                dangerouslySetInnerHTML={{ __html: qrCode || '' }}
              />
            </div>
          ) : null}

          {recoveryCodes.length > 0 ? (
            <div>
              <div className="mt-4 max-w-xl text-sm text-gray-600">
                <p className="font-semibold">
                  Store these recovery codes in a secure password manager. They
                  can be used to recover access to your account if your two
                  factor authentication device is lost.
                </p>
              </div>

              <div className="grid gap-1 max-w-xl mt-4 px-4 py-4 font-mono text-sm bg-gray-100 rounded-lg">
                {recoveryCodes.map(code => (
                  <div key={code}>{code}</div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5">
        {twoFactorEnabled ? (
          <div>
            {recoveryCodes.length > 0 ? (
              <JetConfirmsPassword onConfirm={regenerateRecoveryCodes}>
                <JetSecondaryButton className="mr-3">
                  Regenerate Recovery Codes
                </JetSecondaryButton>
              </JetConfirmsPassword>
            ) : (
              <JetConfirmsPassword onConfirm={showRecoveryCodes}>
                <JetSecondaryButton className="mr-3">
                  Show Recovery Codes
                </JetSecondaryButton>
              </JetConfirmsPassword>
            )}

            <JetConfirmsPassword onConfirm={disableTwoFactorAuthentication}>
              <JetDangerButton
                className={classNames({ 'opacity-25': disabling })}
                disabled={disabling}
              >
                Disable
              </JetDangerButton>
            </JetConfirmsPassword>
          </div>
        ) : (
          <div>
            <JetConfirmsPassword onConfirm={enableTwoFactorAuthentication}>
              <JetButton
                type="button"
                className={classNames({ 'opacity-25': enabling })}
                disabled={enabling}
              >
                Enable
              </JetButton>
            </JetConfirmsPassword>
          </div>
        )}
      </div>
    </JetActionSection>
  );
}
