import React from 'react';
import Link from 'next/link';
import { requirePermission } from '@/lib/auth';
import { getOntologyTree } from '@/services/scientificService';
import { EvidenceBadge } from '@/components/admin/scientific/ScientificBadges';
import { Network, ChevronRight, Layers, Database, BookMarked, Scale } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Ontoloji Haritası — PsycheAI Scientific Admin',
  description: '9 Alan, 30 Yapı ve 84 Alt Boyuttan oluşan psikolojik ontoloji hiyerarşisi',
};

export default async function OntologyExplorerPage() {
  await requirePermission('SCIENTIFIC_VIEW');

  const { domains, stats } = await getOntologyTree();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <Network className="w-6 h-6 text-brand-600 shrink-0" />
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              Psikolojik Ontoloji Haritası
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            3 katmanlı hiyerarşik yapı: Alan (Domain) &gt; Yapı (Construct) &gt; Alt Boyut (Facet)
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-surface-1 border border-border-subtle font-semibold text-text-secondary shadow-xs">
            <strong>{stats.totalDomains}</strong> Alan • <strong>{stats.totalConstructs}</strong> Yapı • <strong className="text-brand-700">{stats.totalFacets}</strong> Alt Boyut
          </span>
        </div>
      </div>

      {/* Domain Cards Accordion / Explorer */}
      <div className="space-y-6">
        {domains.map((domain) => (
          <div key={domain.id} className="bg-surface-1 border border-border-subtle rounded-2xl shadow-xs overflow-hidden">
            {/* Domain Header */}
            <div className="px-5 py-4 bg-surface-2/40 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-brand-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {domain.sortOrder}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-text-primary tracking-tight">
                    {domain.nameTr}
                  </h2>
                  <p className="text-[11px] text-text-tertiary italic">
                    {domain.nameEn} ({domain.code})
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs text-text-tertiary">
                <span className="font-semibold text-text-secondary">{domain.constructs.length} Yapı</span>
                <span>•</span>
                <span className="font-semibold text-brand-700">
                  {domain.constructs.reduce((acc, c) => acc + c.facets.length, 0)} Alt Boyut
                </span>
              </div>
            </div>

            {/* Constructs and Facets List */}
            <div className="p-5 space-y-5 divide-y divide-border-subtle">
              {domain.constructs.map((construct, cIdx) => (
                <div key={construct.id} className={cIdx > 0 ? 'pt-5 space-y-3' : 'space-y-3'}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                      <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                        {construct.nameTr} ({construct.code})
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold text-text-tertiary">
                      {construct.facets.length} Facet
                    </span>
                  </div>

                  {/* Facets Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {construct.facets.map((facet) => {
                      const level = facet.validationSummary?.overallTurkishEvidenceLevel || 'NO_DIRECT';

                      return (
                        <Link
                          key={facet.id}
                          href={`/admin/ontology/${facet.id}`}
                          className="p-3.5 rounded-xl border border-border-subtle bg-surface-2/40 hover:bg-bg-subtle hover:border-brand-300 transition-all flex flex-col justify-between space-y-2 group shadow-xs min-h-[44px]"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-text-primary group-hover:text-brand-700 transition-colors line-clamp-1">
                              {facet.nameTr}
                            </span>
                            <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-brand-600 transition-colors shrink-0" />
                          </div>

                          <p className="text-[11px] text-text-secondary line-clamp-2">
                            {facet.descriptionTr}
                          </p>

                          <div className="flex items-center justify-between pt-1 text-[10px]">
                            <EvidenceBadge level={level} size="sm" />
                            <span className="font-semibold text-text-tertiary font-mono">
                              {facet._count.items} Madde
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
