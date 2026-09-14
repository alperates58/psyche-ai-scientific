import React from 'react';
import fs from 'fs';
import path from 'path';
import { headers, cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { ItemBankClientView } from './ItemBankClientView';
import { lintItemBank, analyzeSemanticClusters } from '@/research/item-quality';
import { validateResearchAccess } from '@/lib/researchAuth';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Master Madde Bankası ve Araştırma Matrisi — PsycheAI',
  description: '84 facet, literatür kanıt haritası, çok yöntemli madde havuzu ve psikometrik kalite denetleyicisi'
};

export default async function ItemBankPage() {
  const reqHeaders = headers();
  const reqCookies = cookies();
  const access = await validateResearchAccess(reqHeaders, reqCookies);

  if (!access.authorized) {
    notFound();
  }

  const masterBankPath = path.resolve(process.cwd(), 'data/master-item-bank.json');
  const evidenceMapPath = path.resolve(process.cwd(), 'research/facet-evidence-map.json');
  const constructsPath = path.resolve(process.cwd(), 'data/constructs.json');
  const sourcesPath = path.resolve(process.cwd(), 'data/source-registry.json');
  const instrumentsPath = path.resolve(process.cwd(), 'data/instrument-registry.json');

  const trMatrixPath = path.resolve(process.cwd(), 'research/turkish-validation-matrix.json');

  const items = fs.existsSync(masterBankPath) ? JSON.parse(fs.readFileSync(masterBankPath, 'utf8')) : [];
  const evidenceMap = fs.existsSync(evidenceMapPath) ? JSON.parse(fs.readFileSync(evidenceMapPath, 'utf8')) : [];
  const constructs = fs.existsSync(constructsPath) ? JSON.parse(fs.readFileSync(constructsPath, 'utf8')) : [];
  const sources = fs.existsSync(sourcesPath) ? JSON.parse(fs.readFileSync(sourcesPath, 'utf8')) : [];
  const instruments = fs.existsSync(instrumentsPath) ? JSON.parse(fs.readFileSync(instrumentsPath, 'utf8')) : [];
  const trMatrix = fs.existsSync(trMatrixPath) ? JSON.parse(fs.readFileSync(trMatrixPath, 'utf8')) : [];

  // Run linter and lexical analysis server-side
  const lintResults = lintItemBank(items);
  const semanticReport = analyzeSemanticClusters(
    items.map((it: any) => ({ id: it.id, facetId: it.facetId, text_tr: it.text_tr })),
    0.70
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              FAZ 2.1 — FORENSIC ITEM BANK AUDIT LAYER
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60">
              Canlı Değerlendirme Formu v1.0.0 Dondurulmuştur
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
            Master Psikometrik Madde Bankası & Kanıt Matrisi
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-3xl">
            PsycheAI ontolojisindeki 84 facetin tamamını kapsayan, adli bilimsel provenance denetiminden geçirilmiş,
            lisans güvenli, AI taslağı olarak etiketlenmiş ve ampirik kalibrasyon öncesi kalite denetiminden geçirilmiş araştırma havuzu.
          </p>
        </div>

        {/* Export Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/api/research/export?format=csv"
            download
            className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-xl bg-surface-1 border border-border-strong text-text-primary hover:bg-bg-subtle transition-all shadow-xs"
          >
            Uzman İnceleme Paketi (CSV)
          </a>
          <a
            href="/api/research/export?format=json"
            download
            className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition-all shadow-xs"
          >
            JSON Veri Seti
          </a>
        </div>
      </div>

      {/* Client Interactive View */}
      <ItemBankClientView
        items={items}
        evidenceMap={evidenceMap}
        constructs={constructs}
        sources={sources}
        instruments={instruments}
        trMatrix={trMatrix}
        lintSummary={lintResults.summary}
        itemLintResults={lintResults.itemResults}
        semanticReport={semanticReport}
      />
    </div>
  );
}
