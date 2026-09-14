import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const SurfaceCard = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      elevated = false,
      interactive = false,
      padding = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    const paddingStyles = {
      none: '',
      sm: 'p-3 sm:p-4',
      md: 'p-4 sm:p-5 lg:p-6',
      lg: 'p-5 sm:p-6 lg:p-8'
    };

    const elevationStyles = elevated
      ? 'bg-surface-elevated shadow-sm'
      : 'bg-surface-1 shadow-xs';

    const interactiveStyles = interactive
      ? 'hover:border-brand-200 hover:shadow-sm transition-all duration-150 cursor-pointer'
      : '';

    return (
      <div
        ref={ref}
        className={`rounded-card border border-border-subtle ${elevationStyles} ${paddingStyles[padding]} ${interactiveStyles} ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SurfaceCard.displayName = 'SurfaceCard';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`space-y-1 pb-3 mb-3 border-b border-border-subtle ${className}`.trim()} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <h3 className={`text-sm sm:text-base font-bold text-text-primary tracking-tight ${className}`.trim()} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <p className={`text-xs text-text-secondary leading-relaxed ${className}`.trim()} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={className} {...props}>
    {children}
  </div>
);
