import React, { PropsWithChildren } from 'react';

interface Props {
  value?: string;
  htmlFor?: string;
}

export default function JetLabel({
  value,
  htmlFor,
  children,
}: PropsWithChildren<Props>) {
  return (
    <label
      className="block font-medium text-sm text-gray-700"
      htmlFor={htmlFor}
    >
      {value || children}
    </label>
  );
}
