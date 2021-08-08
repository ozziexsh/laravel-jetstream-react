import classNames from 'classnames';
import React, { forwardRef } from 'react';

const JetInput = forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
>((props, ref) => (
  <input
    {...props}
    ref={ref}
    className={classNames(
      'border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm',
      props.className,
    )}
  />
));

export default JetInput;
