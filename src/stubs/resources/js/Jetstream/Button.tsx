import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export default function JetButton({
  children,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <button
      {...props}
      className={classNames(
        'inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring focus:ring-gray-300 disabled:opacity-25 transition',
        props.className,
      )}
    >
      {children}
    </button>
  );
}
