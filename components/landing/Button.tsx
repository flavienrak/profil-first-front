import React from 'react';

export default function Button({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none animate-subtle-pulse';

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[#5a0df0] to-[#0052cc] text-white hover:from-primary-700 hover:to-secondary-700',
    secondary:
      'bg-white text-primary-600 border border-primary-200 hover:bg-gray-50',
    outline:
      'bg-transparent text-white border-2 border-white hover:bg-white/10',
  };

  const sizeClasses = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-6 py-3',
    lg: 'text-lg px-8 py-4',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
