import React, { PropsWithChildren } from 'react';

interface Props {
  value?: string;
  htmlFor?: string;
}

export default function InputLabel({
  value,
  htmlFor,
  children,
}: PropsWithChildren<Props>) {
  return (
    <label
      className="block font-medium text-sm text-gray-700 dark:text-gray-300"
      htmlFor={htmlFor}
    >
      {value || children}
    </label>
  );
}
