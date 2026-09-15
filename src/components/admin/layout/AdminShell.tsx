'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AuthUser } from '@/lib/auth';

export interface AdminShellProps {
  user: AuthUser;
  children: React.ReactNode;
}

export const AdminShell: React.FC<AdminShellProps> = ({ user, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-bg-app text-text-primary antialiased w-full">
      {/* 1. Desktop Persistent Admin Sidebar (>= lg) */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar />
      </div>

      {/* 2. Mobile Accessible Slide-over Drawer (< lg) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Admin Mobil Gezinme Menüsü"
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
            id="admin-mobile-navigation-drawer"
            className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-surface-1 shadow-2xl border-r border-border-subtle z-50 flex flex-col animate-in slide-in-from-left duration-200"
          >
            <AdminSidebar isMobile onClose={closeMobileMenu} />
          </div>
        </div>
      )}

      {/* 3. Main Administration Workspace */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <AdminHeader
          user={user}
          onToggleMobileMenu={toggleMobileMenu}
          triggerButtonRef={triggerButtonRef}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
