import fs from 'fs';
import path from 'path';
import { MASTER_DOMAINS, MASTER_CONSTRUCTS, MASTER_FACETS } from '../src/lib/profile/masterModelConstants';
import { THEORY_LENSES } from '../src/lib/theoryCouncil/theoryRegistry';
import { resolveConsumerScalePosition, sanitizeMeasurementStatus, sanitizeEpistemicClaimType } from '../src/lib/consumerLanguage';

export interface ConsumerExperienceAuditResult {
  success: boolean;
  metrics: {
    publicPagesCount: number;
    profileSectionsFound: number;
    theoryCouncilLensesCount: number;
    forbiddenTermsClean: boolean;
    scalePositionBandsCount: number;
    depthModesCount: number;
  };
  errors: string[];
  warnings: string[];
}

export async function runConsumerExperienceAudit(): Promise<ConsumerExperienceAuditResult> {
  const root = path.resolve(__dirname, '..');
  const errors: string[] = [];
  const warnings: string[] = [];

  console.log('='.repeat(95));
  console.log('PSYCHE-AI CONSUMER EXPERIENCE, IA & VISUALIZATION AUDIT');
  console.log('='.repeat(95));

  // =========================================================================
  // 1. Public Content Pages & Auth Rebuild Verification
  // =========================================================================
  console.log('\n[1/6] Verifying Public Site, Auth & Governance Pages...');
  const expectedPublicPages = [
    'src/app/page.tsx',
    'src/app/science/page.tsx',
    'src/app/how-it-works/page.tsx',
    'src/app/privacy/page.tsx',
    'src/app/terms/page.tsx',
    'src/app/login/page.tsx',
    'src/app/register/page.tsx',
    'src/app/overview/page.tsx',
    'src/components/layout/PublicNavbar.tsx',
    'src/components/layout/PublicFooter.tsx',
    'src/components/layout/Sidebar.tsx',
  ];

  let publicPagesCount = 0;
  for (const relPath of expectedPublicPages) {
    const fullPath = path.join(root, relPath);
    if (!fs.existsSync(fullPath)) {
      errors.push(`Missing critical public/auth file: ${relPath}`);
    } else {
      publicPagesCount++;
    }
  }

  // Verify Sidebar 4 Consumer Groups
  const sidebarPath = path.join(root, 'src/components/layout/Sidebar.tsx');
  if (fs.existsSync(sidebarPath)) {
    const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
    const requiredGroups = ['ANA SAYFA', 'KEŞFET', 'DERİNLEŞ', 'HESAP'];
    for (const grp of requiredGroups) {
      if (!sidebarContent.includes(grp)) {
        errors.push(`Sidebar is missing consumer group: "${grp}"`);
      }
    }
  }

  // =========================================================================
  // 2. Assessment Experience & Attention Check Hygiene
  // =========================================================================
  console.log('\n[2/6] Verifying Assessment Experience Invariants...');
  const assessmentPagePath = path.join(root, 'src/app/assessment/page.tsx');
  if (fs.existsSync(assessmentPagePath)) {
    const assessmentContent = fs.readFileSync(assessmentPagePath, 'utf8');
    // Ensure "Doğrulama Sorusu" badge was stripped from user UI
    if (assessmentContent.includes('Doğrulama Sorusu') || assessmentContent.includes('bg-amber-500/10 text-amber-600')) {
      errors.push('Assessment UI leaks attention check badge ("Doğrulama Sorusu") to test takers');
    }
  }

  // =========================================================================
  // 3. Profile 15-Section IA & Visualizations
  // =========================================================================
  console.log('\n[3/6] Verifying Unified Profile 15-Section IA & Visualizations...');
  const profileClientViewPath = path.join(root, 'src/components/profile/UnifiedProfileClientViewV2.tsx');
  let profileSectionsFound = 0;

  const requiredProfileComponents = [
    'src/components/profile/ProfileSummarySection.tsx',
    'src/components/profile/ProfileFingerprint.tsx',
    'src/components/profile/DomainWheel.tsx',
    'src/components/profile/FacetExplorerV2.tsx',
    'src/components/results/ResultSummaryHero.tsx',
  ];

  for (const compPath of requiredProfileComponents) {
    if (!fs.existsSync(path.join(root, compPath))) {
      errors.push(`Missing profile component: ${compPath}`);
    }
  }

  if (fs.existsSync(profileClientViewPath)) {
    const profileContent = fs.readFileSync(profileClientViewPath, 'utf8');
    const expectedSectionIds = [
      'section-hero',
      'section-summary',
      'section-fingerprint',
      'section-domains',
      'section-hexaco',
      'section-facets',
      'section-patterns',
      'section-synergies',
      'section-tensions',
      'section-stability',
      'section-theory-council',
      'section-comparisons',
      'section-science',
      'section-exports',
      'section-growth-prep',
    ];

    for (const secId of expectedSectionIds) {
      if (profileContent.includes(secId)) {
        profileSectionsFound++;
      } else {
        errors.push(`Profile IA is missing section anchor: "${secId}"`);
      }
    }
  }

  // =========================================================================
  // 4. Consumer Language & Scale Position System
  // =========================================================================
  console.log('\n[4/6] Verifying Scale Positions & Epistemic Sanitizers...');
  const testScores = [1.2, 2.1, 3.0, 3.8, 4.7];
  const expectedBands = ['VERY_LOW', 'LOW_MID', 'MID', 'MID_HIGH', 'HIGH'];
  let scalePositionBandsCount = 0;

  testScores.forEach((score, idx) => {
    const pos = resolveConsumerScalePosition(score);
    if (pos.bandCode === expectedBands[idx]) {
      scalePositionBandsCount++;
    } else {
      errors.push(`Scale position resolution failed for score ${score}: expected ${expectedBands[idx]}, got ${pos.bandCode}`);
    }
  });

  const sanitizedStatus = sanitizeMeasurementStatus('MEASURED_PRECALIBRATION');
  if (sanitizedStatus !== 'Ölçüldü') {
    errors.push(`Sanitize measurement status failed: expected "Ölçüldü", got "${sanitizedStatus}"`);
  }

  const sanitizedClaim = sanitizeEpistemicClaimType('MEASURED_FINDING');
  if (sanitizedClaim !== 'Ölçülen Dayanak') {
    errors.push(`Sanitize epistemic claim failed: expected "Ölçülen Dayanak", got "${sanitizedClaim}"`);
  }

  // =========================================================================
  // 5. Theory Council Invariants (Exact 10 Lenses)
  // =========================================================================
  console.log('\n[5/6] Verifying Theory Council Governance & Lenses...');
  const theoryCouncilLensesCount = THEORY_LENSES.length;
  if (theoryCouncilLensesCount !== 10) {
    errors.push(`Theory Council must have exactly 10 authoritative lenses; found ${theoryCouncilLensesCount}`);
  }

  const expectedLensIds = [
    'FREUD',
    'JUNG',
    'ADLER',
    'ROGERS',
    'MASLOW',
    'SKINNER',
    'WILLIAM_JAMES',
    'GESTALT',
    'FRANKL',
    'BECK',
  ];

  for (const id of expectedLensIds) {
    if (!THEORY_LENSES.some((l) => l.lensId === id)) {
      errors.push(`Theory Council registry missing required lens: ${id}`);
    }
  }

  // =========================================================================
  // 6. AI Insight V2 Depth Modes & Forbidden Leak Audit
  // =========================================================================
  console.log('\n[6/6] Verifying AI Insight V2 Depth Modes & Anti-Jargon Guardrails...');
  const aiTypesPath = path.join(root, 'src/types/aiInsightV2.ts');
  let depthModesCount = 0;
  if (fs.existsSync(aiTypesPath)) {
    const aiTypesContent = fs.readFileSync(aiTypesPath, 'utf8');
    if (aiTypesContent.includes("'GLANCE'") && aiTypesContent.includes("'NARRATIVE'") && aiTypesContent.includes("'DEEP_ANALYSIS'")) {
      depthModesCount = 3;
    } else {
      errors.push('AIInsightV2 types missing GLANCE | NARRATIVE | DEEP_ANALYSIS depth modes');
    }
  }

  // Static check on consumer-facing files to ensure no forbidden clinical/fake norm jargon
  const filesToScanForJargon = [
    'src/components/results/ResultSummaryHero.tsx',
    'src/components/profile/ProfileSummarySection.tsx',
    'src/components/profile/FacetExplorerV2.tsx',
    'src/app/overview/page.tsx',
  ];

  let forbiddenTermsClean = true;
  const forbiddenPatterns = [
    { pattern: /%98\.4 güvenilirlik/gi, label: 'fake confidence percentage (%98.4)' },
    { pattern: /türkiye ortalamasından yüksek/gi, label: 'fake Turkish population norm' },
    { pattern: /tükenmişlik riski/gi, label: 'un-neutralized clinical risk phrasing' },
    { pattern: /depresyon riski/gi, label: 'clinical diagnosis / depression risk' },
  ];

  for (const rel of filesToScanForJargon) {
    const full = path.join(root, rel);
    if (fs.existsSync(full)) {
      const content = fs.readFileSync(full, 'utf8');
      for (const { pattern, label } of forbiddenPatterns) {
        if (pattern.test(content)) {
          errors.push(`Forbidden term leaked in ${rel}: ${label}`);
          forbiddenTermsClean = false;
        }
      }
    }
  }

  // =========================================================================
  // Summary & Report
  // =========================================================================
  const success = errors.length === 0;

  console.log('\n' + '='.repeat(95));
  console.log(`CONSUMER UX AUDIT ${success ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`- Public & Auth Pages Verified: ${publicPagesCount} / ${expectedPublicPages.length}`);
  console.log(`- Profile IA Sections Verified: ${profileSectionsFound} / 15`);
  console.log(`- Scale Position Bands Verified: ${scalePositionBandsCount} / 5`);
  console.log(`- Theory Council Lenses Verified: ${theoryCouncilLensesCount} / 10`);
  console.log(`- AI Depth Modes: ${depthModesCount} / 3`);
  console.log(`- Consumer Jargon Guard: ${forbiddenTermsClean ? 'CLEAN (No leaks)' : 'VIOLATION DETECTED'}`);
  console.log('='.repeat(95));

  if (errors.length > 0) {
    console.error('\nAudit Errors:');
    errors.forEach((e) => console.error(`  - [ERROR] ${e}`));
  }

  return {
    success,
    metrics: {
      publicPagesCount,
      profileSectionsFound,
      theoryCouncilLensesCount,
      forbiddenTermsClean,
      scalePositionBandsCount,
      depthModesCount,
    },
    errors,
    warnings,
  };
}

// Run directly if invoked from CLI
if (require.main === module) {
  runConsumerExperienceAudit().then((result) => {
    if (!result.success) {
      process.exit(1);
    }
  });
}
