import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';
import JetSectionTitle from '@/Jetstream/SectionTitle';

interface Props {
  title: string;
  description: string;
  renderActions?(): JSX.Element;
  onSubmit(): void;
}

export default function JetFormSection({
  onSubmit,
  renderActions,
  title,
  description,
  children,
}: PropsWithChildren<Props>) {
  const hasActions = !!renderActions;

  return (
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <JetSectionTitle title={title} description={description} />

      <div className="mt-5 md:mt-0 md:col-span-2">
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div
            className={classNames(
              'px-4 py-5 bg-white sm:p-6 shadow',
              hasActions
                ? 'sm:rounded-tl-md sm:rounded-tr-md'
                : 'sm:rounded-md',
            )}
          >
            <div className="grid grid-cols-6 gap-6">{children}</div>
          </div>

          {hasActions && (
            <div className="flex items-center justify-end px-4 py-3 bg-gray-50 text-right sm:px-6 shadow sm:rounded-bl-md sm:rounded-br-md">
              {renderActions?.()}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
