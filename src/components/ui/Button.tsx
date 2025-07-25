import type React from 'react';

type ButtonVariant = 'primary' | 'neutral';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  variant?: ButtonVariant;
}

const getVariantClasses = (variant: ButtonVariant) => {
  switch (variant) {
    case 'neutral':
      return 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2';
    case 'primary':
    default:
      return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  }
};

export function Button(props: ButtonProps) {
  const {
    children,
    loading = false,
    loadingText,
    disabled,
    className,
    variant = 'primary',
    ...rest
  } = props;
  const isDisabled = disabled || loading;

  const buttonContent = (
    <>
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <svg
            className="h-4 w-4 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText || children}
        </div>
      ) : (
        children
      )}
    </>
  );

  const buttonClasses = `flex-1 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${getVariantClasses(variant)} ${className || ''}`;

  return (
    <button {...rest} disabled={isDisabled} className={buttonClasses}>
      {buttonContent}
    </button>
  );
}
