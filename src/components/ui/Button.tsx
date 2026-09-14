import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles honoring design.md (light-first, 10px radius, calm scientific aesthetic)
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 select-none touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-xs active:bg-brand-800',
      secondary: 'bg-surface-1 hover:bg-bg-subtle text-text-primary border border-border-default shadow-xs',
      outline: 'bg-transparent hover:bg-bg-subtle text-text-primary border border-border-default',
      ghost: 'bg-transparent hover:bg-bg-subtle text-text-secondary hover:text-text-primary',
      danger: 'bg-danger-50 hover:bg-danger-600 hover:text-white text-danger-600 border border-danger-600/30'
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs min-h-[44px] sm:min-h-[36px]',
      md: 'px-4 py-2 text-xs md:text-sm min-h-[44px]',
      lg: 'px-6 py-2.5 text-sm md:text-base min-h-[48px]'
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`.trim()}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : leftIcon ? (
          <span className="mr-2 inline-flex items-center">{leftIcon}</span>
        ) : null}
        <span>{children}</span>
        {rightIcon && !isLoading ? (
          <span className="ml-2 inline-flex items-center">{rightIcon}</span>
        ) : null}
      </button>
    );
  }
);

Button.displayName = 'Button';
