import React, { PropsWithChildren } from 'react';
import JetSectionTitle from '@/Jetstream/SectionTitle';

interface Props {
  title: string;
  description: string;
}

export default function JetActionSection({
  title,
  description,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <JetSectionTitle title={title} description={description} />

      <div className="mt-5 md:mt-0 md:col-span-2">
        <div className="px-4 py-5 sm:p-6 bg-white shadow sm:rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
