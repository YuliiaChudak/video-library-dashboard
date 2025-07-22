import type React from 'react';
import Link from 'next/link';

type ButtonLinkVariant = 'primary' | 'secondary';

interface ButtonLinkProps extends React.RefAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href: string;
  variant?: ButtonLinkVariant;
}

export function ButtonLink({
  children,
  href,
  variant = 'primary',
  ...props
}: ButtonLinkProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 focus:ring-2 focus:ring-blue-500 rounded p-1';
      case 'primary':
      default:
        return 'inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
    }
  };

  return (
    <Link href={href} className={getVariantClasses()} {...props}>
      {children}
    </Link>
  );
}
