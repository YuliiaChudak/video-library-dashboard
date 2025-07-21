import { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | undefined;
}

export function Input(props: InputProps) {
  const { label, error, value, ...rest } = props;
  const id = useId();

  return (
    <>
      <label
        htmlFor={id}
        className={`text-sm font-medium ${error ? 'text-red-600' : ''}`}
      >
        {error || label}
      </label>
      <input
        {...rest}
        id={id}
        type={rest.type ?? 'text'}
        value={value}
        className={`w-full rounded-md border bg-white px-3 py-2 placeholder-gray-500 focus:border-transparent focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 focus:outline-hidden ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
      />
    </>
  );
}
