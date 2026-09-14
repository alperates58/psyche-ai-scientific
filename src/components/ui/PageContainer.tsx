import React from 'react';

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'standard' | 'wide' | 'full';
}

/**
 * Standardized responsive page container enforcing fluid spacing
 * and width constraints according to analytical depth requirements.
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  variant = 'standard',
  className = '',
  ...props
}) => {
  const widthClasses = {
    // Standard: Focused assessment / profile narrative (max-w-5xl: 1024px)
    standard: 'max-w-5xl',
    // Wide: Dashboards, multi-column analytics, theory council (max-w-7xl: 1280px)
    wide: 'max-w-7xl',
    // Full: Data-dense tables, research item bank, admin views (max-w-[1440px])
    full: 'max-w-[1440px]'
  };

  return (
    <div
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 ${widthClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
};
