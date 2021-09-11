import React, { PropsWithChildren } from 'react';

interface Props {
  message?: string;
  className?: string;
}

export default function JetInputError({
  message,
  className,
  children,
}: PropsWithChildren<Props>) {
  if (!message && !children) {
    return null;
  }
  return (
    <div className={className}>
      <p className="text-sm text-red-600">{message || children}</p>
    </div>
  );
}
