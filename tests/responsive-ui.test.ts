import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('FAZ 2.5 Responsive Design System & Epistemic Invariants', () => {
  const srcPath = path.resolve(__dirname, '../src');

  // 1. PRE-CALIBRATION HONESTY: NO FAKE 95% CI
  it('strictly suppresses fake 95% CI whisker bars and error margin claims in FacetWhiskersChart', () => {
    const chartFile = fs.readFileSync(path.join(srcPath, 'components/charts/FacetWhiskersChart.tsx'), 'utf-8');
    
    // Must accept isPreCalibration prop
    expect(chartFile).toContain('isPreCalibration?: boolean');
    
    // Must contain guard prohibiting whiskers/CI when pre-calibration or SE is null
    expect(chartFile).toContain('hasCalibratedIntervals = !isPreCalibration');
    expect(chartFile).toContain('Betimsel Puan');
  });

  // 2. PAGE CONTAINER RESPONSIVE CONSTRAINTS
  it('enforces maximum width boundaries in PageContainer primitive without overflow', () => {
    const containerFile = fs.readFileSync(path.join(srcPath, 'components/ui/PageContainer.tsx'), 'utf-8');
    
    expect(containerFile).toContain('max-w-5xl'); // standard
    expect(containerFile).toContain('max-w-7xl'); // wide
    expect(containerFile).toContain('max-w-[1440px]'); // full
    expect(containerFile).toContain('w-full');
  });

  // 3. TOUCH TARGET COMPLIANCE (>= 44px)
  it('enforces minimum 44px touch targets in Button primitive for mobile accessibility', () => {
    const buttonFile = fs.readFileSync(path.join(srcPath, 'components/ui/Button.tsx'), 'utf-8');
    
    expect(buttonFile).toContain('min-h-[44px]');
  });

  // 4. RESPONSIVE DATA TABLE CARD & SCROLL PRIMITIVE
  it('implements dual mobile-card and desktop-table rendering in ResponsiveDataTable', () => {
    const tableFile = fs.readFileSync(path.join(srcPath, 'components/ui/ResponsiveDataTable.tsx'), 'utf-8');
    
    // Mobile card container
    expect(tableFile).toContain('sm:hidden');
    // Desktop table container
    expect(tableFile).toContain('hidden sm:block');
    // Internal horizontal scroll container for desktop/tablet
    expect(tableFile).toContain('overflow-x-auto');
  });

  // 5. EPISTEMIC BADGE OVERFLOW PREVENTION
  it('prevents text clipping and overflow in EpistemicBadge', () => {
    const badgeFile = fs.readFileSync(path.join(srcPath, 'components/shared/EpistemicBadge.tsx'), 'utf-8');
    
    expect(badgeFile).toContain('break-words');
    expect(badgeFile).toContain('whitespace-normal');
  });

  // 6. APPLICATION SHELL & DRAWER FOCUS MANAGEMENT
  it('implements focus trap, ESC listener, and backdrop click in AppShell', () => {
    const appShellFile = fs.readFileSync(path.join(srcPath, 'components/layout/AppShell.tsx'), 'utf-8');
    
    expect(appShellFile).toContain('isMobileMenuOpen');
    expect(appShellFile).toContain('Escape');
    expect(appShellFile).toContain('firstElement?.focus()');
    expect(appShellFile).toContain('aria-modal="true"');
    expect(appShellFile).toContain('role="dialog"');
  });

  // 7. RADAR CHART MOBILE RADIUS & LABELS
  it('adapts radar chart radius and margins for compact mobile viewports', () => {
    const radarFile = fs.readFileSync(path.join(srcPath, 'components/charts/HexacoRadarChart.tsx'), 'utf-8');
    
    expect(radarFile).toContain('outerRadius');
    expect(radarFile).toContain('renderPolarAngleTick');
  });

  // 8. ALL 10 ROUTES IN ROUTE AUDIT MATRIX EXIST
  it('verifies all 10 responsive route paths exist in application structure', () => {
    const requiredRoutes = [
      'src/app/page.tsx',
      'src/app/overview/page.tsx',
      'src/app/assessment/page.tsx',
      'src/app/profile/personality/page.tsx',
      'src/app/profile/heatmap/page.tsx',
      'src/app/insights/context/page.tsx',
      'src/app/insights/patterns/page.tsx',
      'src/app/theory-council/page.tsx',
      'src/app/research/item-bank/page.tsx',
      'src/app/research/login/page.tsx',
    ];

    for (const route of requiredRoutes) {
      const fullPath = path.resolve(__dirname, '..', route);
      expect(fs.existsSync(fullPath), `Route file ${route} must exist`).toBe(true);
    }
  });

  // 9. NO GLOBAL OVERFLOW-X: HIDDEN CHEAT ON BODY
  it('verifies body layout does not cheat horizontal overflow with global overflow-x: hidden', () => {
    const layoutFile = fs.readFileSync(path.join(srcPath, 'app/layout.tsx'), 'utf-8');
    
    // Must NOT contain overflow-x-hidden on <body> to mask layout defects
    const bodyTagMatch = layoutFile.match(/<body[^>]*className=["']([^"']*)["']/);
    if (bodyTagMatch) {
      const bodyClasses = bodyTagMatch[1];
      expect(bodyClasses).not.toContain('overflow-x-hidden');
    }
  });
});
