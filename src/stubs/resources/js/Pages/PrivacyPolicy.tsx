import React from 'react';
import JetAuthenticationCardLogo from '@/Jetstream/AuthenticationCardLogo';
// @ts-ignore
import { Head } from '@inertiajs/inertia-react';

interface Props {
  policy: string;
}

export default function PrivacyPolicy({ policy }: Props) {
  return (
    <div>
      <Head title="Privacy Policy" />

      <div className="font-sans text-gray-900 antialiased">
        <div className="pt-4 bg-gray-100">
          <div className="min-h-screen flex flex-col items-center pt-6 sm:pt-0">
            <div>
              <JetAuthenticationCardLogo />
            </div>

            <div
              className="w-full sm:max-w-2xl mt-6 p-6 bg-white shadow-md overflow-hidden sm:rounded-lg prose"
              dangerouslySetInnerHTML={{ __html: policy }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
