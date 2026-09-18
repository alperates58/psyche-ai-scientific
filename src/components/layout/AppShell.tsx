'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';

interface AppShellContextType {
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  triggerButtonRef: React.RefObject<HTMLButtonElement>;
}

const AppShellContext = createContext<AppShellContextType | undefined>(undefined);

export function useAppShell() {
  const context = useContext(AppShellContext);
  if (!context) {
    throw new Error('useAppShell must be used within an AppShell provider');
  }
  return context;
}

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    // Focus restoration: return focus to the trigger button
    setTimeout(() => {
      triggerButtonRef.current?.focus();
    }, 50);
  };
  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  // Close drawer on route change
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [pathname]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    if (isMobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobileMenuOpen]);

  // Trap focus inside drawer when open
  useEffect(() => {
    if (!isMobileMenuOpen || !drawerRef.current) return;

    const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleTabKey);
    return () => window.removeEventListener('keydown', handleTabKey);
  }, [isMobileMenuOpen]);

  // If on admin routes, delegate complete shell ownership to AdminShell inside /admin/layout.tsx
  if (pathname.startsWith('/admin')) {
    return (
      <SessionProvider>
        {children}
      </SessionProvider>
    );
  }

  // Public routes: render public navbar + page + footer without app sidebar
  const isPublicRoute =
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname === '/science' ||
    pathname === '/how-it-works' ||
    pathname === '/privacy' ||
    pathname === '/terms';

  if (isPublicRoute) {
    return (
      <SessionProvider>
        <div className="min-h-screen flex flex-col bg-bg-app text-text-primary antialiased w-full">
          <PublicNavbar />
          <main className="flex-1 w-full">
            {children}
          </main>
          <PublicFooter />
        </div>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider>
      <AppShellContext.Provider
        value={{
          isMobileMenuOpen,
          openMobileMenu,
          closeMobileMenu,
          toggleMobileMenu,
          triggerButtonRef,
        }}
      >
        <div className="min-h-screen flex flex-col lg:flex-row bg-bg-app text-text-primary antialiased w-full">
        {/* 1. Desktop Persistent Sidebar (>= lg) */}
        <div className="hidden lg:block shrink-0">
          <Sidebar />
        </div>

        {/* 2. Mobile Accessible Slide-over Drawer (< lg) */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobil Gezinme Menüsü"
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-text-primary/40 backdrop-blur-xs transition-opacity duration-200"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />

            {/* Slide-over Panel */}
            <div
              ref={drawerRef}
              id="mobile-navigation-drawer"
              className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-surface-1 shadow-2xl border-r border-border-subtle z-50 flex flex-col animate-in slide-in-from-left duration-200"
            >
              <Sidebar isMobile onClose={closeMobileMenu} />
            </div>
          </div>
        )}

        {/* 3. Main Application Area */}
        <div className="flex-1 flex flex-col min-w-0 w-full">
          <Header />
          <main className="flex-1 overflow-y-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </AppShellContext.Provider>
    </SessionProvider>
  );
};
