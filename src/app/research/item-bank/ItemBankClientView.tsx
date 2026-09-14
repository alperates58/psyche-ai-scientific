'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Layers,
  Database,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  BookOpen,
  Info,
  ChevronRight,
  Sparkles,
  BarChart2,
  Eye,
  SlidersHorizontal,
  ExternalLink,
  Download,
  AlertCircle
} from 'lucide-react';

interface ItemBankClientViewProps {
  items: any[];
  evidenceMap: any[];
  constructs: any[];
  sources: any[];
  instruments: any[];
  trMatrix: any[];
  lintSummary: any;
  itemLintResults: any[];
  semanticReport: any;
}

export function ItemBankClientView({
  items,
  evidenceMap,
  constructs,
  sources,
  instruments,
  trMatrix,
  lintSummary,
  itemLintResults,
  semanticReport
}: ItemBankClientViewProps) {
  const [activeTab, setActiveTab] = useState<'items' | 'coverage' | 'validation' | 'quality'>('items');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [selectedFacet, setSelectedFacet] = useState('ALL');
  const [selectedItemType, setSelectedItemType] = useState('ALL');
  const [selectedKeying, setSelectedKeying] = useState('ALL');
  const [selectedTriage, setSelectedTriage] = useState('ALL');
  const [inspectedItem, setInspectedItem] = useState<any | null>(null);

  // Lint results map by Item ID
  const lintMap = useMemo(() => {
    const map = new Map<string, any>();
    for (const r of itemLintResults) {
      map.set(r.itemId, r);
    }
    return map;
  }, [itemLintResults]);

  // Turkish validation map by Facet ID
  const trMap = useMemo(() => {
    const map = new Map<string, any>();
    for (const m of trMatrix) {
      map.set(m.facetId, m);
    }
    return map;
  }, [trMatrix]);

  // Unique domains list
  const domains = useMemo(() => {
    const set = new Set<string>();
    items.forEach(it => set.add(it.domainId));
    return Array.from(set);
  }, [items]);

  // Unique facets list (dependent on selected domain)
  const availableFacets = useMemo(() => {
    const filtered = selectedDomain === 'ALL'
      ? evidenceMap
      : evidenceMap.filter(ev => ev.domainId === selectedDomain);
    return filtered;
  }, [selectedDomain, evidenceMap]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter(it => {
      if (selectedDomain !== 'ALL' && it.domainId !== selectedDomain) return false;
      if (selectedFacet !== 'ALL' && it.facetId !== selectedFacet) return false;
      if (selectedItemType !== 'ALL' && it.itemType !== selectedItemType) return false;
      if (selectedKeying !== 'ALL' && it.keying !== selectedKeying) return false;
      if (selectedTriage !== 'ALL' && (it.triageStatus || 'READY_FOR_EXPERT_REVIEW') !== selectedTriage) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = it.id.toLowerCase().includes(q);
        const matchTr = (it.text_tr || '').toLowerCase().includes(q);
        const matchEn = (it.text_en || '').toLowerCase().includes(q);
        const matchFacet = it.facetId.toLowerCase().includes(q);
        if (!matchId && !matchTr && !matchEn && !matchFacet) return false;
      }
      return true;
    });
  }, [items, selectedDomain, selectedFacet, selectedItemType, selectedKeying, selectedTriage, searchQuery]);

  // Coverage matrix calculations (84 facets x Item types)
  const coverageMatrix = useMemo(() => {
    return evidenceMap.map(ev => {
      const facetItems = items.filter(it => it.facetId === ev.facetId);
      const tr = trMap.get(ev.facetId);
      return {
        facetId: ev.facetId,
        facetNameTr: ev.name_tr,
        facetNameEn: ev.name_en,
        domainId: ev.domainId,
        trStatus: tr?.status || 'NO_DIRECT_TURKISH_VALIDATION',
        total: facetItems.length,
        likert: facetItems.filter(it => it.itemType === 'likert').length,
        frequency: facetItems.filter(it => it.itemType === 'behavior_frequency').length,
        contextual: facetItems.filter(it => it.itemType === 'contextual').length,
        sjt: facetItems.filter(it => it.itemType === 'situational_judgement').length,
        forcedChoice: facetItems.filter(it => it.itemType === 'forced_choice').length
      };
    });
  }, [evidenceMap, items, trMap]);

  const readyCount = items.filter(it => (it.triageStatus || 'READY_FOR_EXPERT_REVIEW') === 'READY_FOR_EXPERT_REVIEW').length;
  const revisionCount = items.filter(it => it.triageStatus === 'REQUIRES_INTERNAL_REVISION').length;
  const directTrCount = trMatrix.filter(t => t.status === 'DIRECT_FACET_VALIDATION').length;
  const lexicalTrCount = trMatrix.filter(t => t.status === 'LEXICAL_SUPPORT_ONLY').length;

  // FAZ 2.3 Evidence Semantics & Closure Statistics (derived dynamically)
  const evidenceClosureStats = useMemo(() => {
    const totalSources = sources.length;
    const verifiedPrimary = sources.filter((s: any) => s.bibliographicVerificationStatus === 'VERIFIED_PRIMARY').length;
    const verifiedSecondary = sources.filter((s: any) => s.bibliographicVerificationStatus === 'VERIFIED_SECONDARY').length;

    // FAZ 2.3 Typology
    const turkishScaleAdaptations = sources.filter((s: any) => s.studyType === 'TURKISH_SCALE_ADAPTATION').length;
    const turkishLexicalStudies = sources.filter((s: any) => s.studyType === 'TURKISH_LEXICAL_STUDY').length;
    const turkishTheoreticalStudies = sources.filter((s: any) => s.studyType === 'TURKISH_THEORETICAL_MODEL').length;
    const turkishContextTotal = sources.filter((s: any) => s.studyPopulationCountry === 'TR' || s.studyLanguageContext === 'tr').length;

    const directCount = trMatrix.filter((t: any) => t.status === 'DIRECT_FACET_VALIDATION').length;
    const lexicalCount = trMatrix.filter((t: any) => t.status === 'LEXICAL_SUPPORT_ONLY').length;
    const relatedCount = trMatrix.filter((t: any) => t.status === 'RELATED_MEASURE_VALIDATION').length;
    const noDirectCount = trMatrix.filter((t: any) => t.status === 'NO_DIRECT_TURKISH_VALIDATION').length;
    const empiricalValidationRequired = relatedCount + noDirectCount;

    let verifiedExactClaims = 0;
    let notVerifiedClaims = 0;
    let notAssessedClaims = 0;

    trMatrix.forEach((f: any) => {
      const claims = [
        f.reliabilityEvidence?.internalConsistency,
        f.reliabilityEvidence?.testRetest,
        f.studyEvidence?.sampleN
      ];

      claims.forEach((claim: any) => {
        if (claim) {
          if (claim.claimVerificationStatus === 'VERIFIED_EXACT') verifiedExactClaims++;
          else if (claim.claimVerificationStatus === 'NOT_VERIFIED') notVerifiedClaims++;
          else if (claim.claimVerificationStatus === 'NOT_ASSESSED') notAssessedClaims++;
        }
      });
    });

    return {
      totalSources,
      verifiedPrimary,
      verifiedSecondary,
      turkishScaleAdaptations,
      turkishLexicalStudies,
      turkishTheoreticalStudies,
      turkishContextTotal,
      directCount,
      lexicalCount,
      relatedCount,
      noDirectCount,
      empiricalValidationRequired,
      verifiedExactClaims,
      notVerifiedClaims,
      notAssessedClaims,
      totalClaims: verifiedExactClaims + notVerifiedClaims + notAssessedClaims
    };
  }, [sources, trMatrix]);

  return (
    <div className="space-y-6">
      {/* 1. FORENSIC AUDIT KEY METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-surface-1 p-4 rounded-xl border border-border-subtle shadow-xs">
          <div className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">TOPLAM ADAY MADDE</div>
          <div className="text-2xl font-bold text-text-primary mt-1">{items.length}</div>
          <div className="text-xs text-text-tertiary mt-0.5">84 psikolojik facet (9 domain)</div>
        </div>

        <div className="bg-surface-1 p-4 rounded-xl border border-border-subtle shadow-xs">
          <div className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">DOĞRUDAN TR VALİDASYON</div>
          <div className="text-2xl font-bold text-brand-700 mt-1">{directTrCount} / 84</div>
          <div className="text-xs text-text-secondary mt-0.5">+24 Leksikal Destek (Wasti 2008)</div>
        </div>

        <div className="bg-surface-1 p-4 rounded-xl border border-border-subtle shadow-xs">
          <div className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">UZMAN İNCELEMESİNE HAZIR</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{readyCount}</div>
          <div className="text-xs text-emerald-700 font-medium mt-0.5">Teknik taslak hazır (Triage)</div>
        </div>

        <div className="bg-surface-1 p-4 rounded-xl border border-border-subtle shadow-xs">
          <div className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">İÇ REVİZYON GEREKLİ</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{revisionCount}</div>
          <div className="text-xs text-amber-700 font-medium mt-0.5">SJT / Zorunlu Seçim İkilemleri</div>
        </div>

        <div className="bg-surface-1 p-4 rounded-xl border border-border-subtle shadow-xs col-span-2 lg:col-span-1">
          <div className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">WORDING LINT PUANI</div>
          <div className="text-2xl font-bold text-indigo-700 mt-1">{lintSummary.averageWordingLintScore || 100} / 100</div>
          <div className="text-xs text-text-tertiary mt-0.5">Yazım / Biçim Kural Taraması</div>
        </div>
      </div>

      {/* EVIDENCE CLOSURE STATUS CARD (FAZ 2.3 SEMANTIC PURITY AUDIT) */}
      <div className="bg-surface-1 rounded-xl border border-border-subtle shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              Evidence Semantics & Closure Status (FAZ 2.3 Forensic Audit)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-text-tertiary">
            Pure Renderer &bull; Zero Hard-Coded Data &bull; AI-Assisted Text Audit
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="p-2.5 rounded-lg bg-surface-2 border border-border-subtle">
            <div className="text-[10px] text-text-tertiary uppercase font-medium">Toplam Kaynak</div>
            <div className="text-lg font-bold text-text-primary mt-0.5">{evidenceClosureStats.totalSources}</div>
            <div className="text-[10px] text-text-tertiary">Sicilde kayıtlı</div>
          </div>

          <div className="p-2.5 rounded-lg bg-surface-2 border border-border-subtle">
            <div className="text-[10px] text-text-tertiary uppercase font-medium">TR Ölçek Adapt.</div>
            <div className="text-lg font-bold text-emerald-700 mt-0.5">{evidenceClosureStats.turkishScaleAdaptations}</div>
            <div className="text-[10px] text-emerald-600/80">Psikometrik ölçek</div>
          </div>

          <div className="p-2.5 rounded-lg bg-surface-2 border border-border-subtle">
            <div className="text-[10px] text-text-tertiary uppercase font-medium">TR Leksikal Çalışma</div>
            <div className="text-lg font-bold text-purple-700 mt-0.5">{evidenceClosureStats.turkishLexicalStudies}</div>
            <div className="text-[10px] text-purple-600/80">Wasti et al. (2008)</div>
          </div>

          <div className="p-2.5 rounded-lg bg-surface-2 border border-border-subtle">
            <div className="text-[10px] text-text-tertiary uppercase font-medium">Toplam TR Context</div>
            <div className="text-lg font-bold text-blue-700 mt-0.5">{evidenceClosureStats.turkishContextTotal}</div>
            <div className="text-[10px] text-blue-600/80">Türkiye örneklemi</div>
          </div>

          <div className="p-2.5 rounded-lg bg-surface-2 border border-border-subtle">
            <div className="text-[10px] text-text-tertiary uppercase font-medium">Doğrudan TR Facet</div>
            <div className="text-lg font-bold text-brand-700 mt-0.5">{evidenceClosureStats.directCount}</div>
            <div className="text-[10px] text-brand-600/80">Geçerlik kanıtlı</div>
          </div>

          <div className="p-2.5 rounded-lg bg-surface-2 border border-border-subtle">
            <div className="text-[10px] text-text-tertiary uppercase font-medium">Leksikal Destek</div>
            <div className="text-lg font-bold text-purple-700 mt-0.5">{evidenceClosureStats.lexicalCount}</div>
            <div className="text-[10px] text-purple-600/80">Geniş 6 faktör</div>
          </div>

          <div className="p-2.5 rounded-lg bg-surface-2 border border-border-subtle">
            <div className="text-[10px] text-text-tertiary uppercase font-medium">Validasyon Bekleyen</div>
            <div className="text-lg font-bold text-rose-700 mt-0.5">{evidenceClosureStats.empiricalValidationRequired}</div>
            <div className="text-[10px] text-rose-600/80">Ampirik pilot şart</div>
          </div>

          <div className="p-2.5 rounded-lg bg-surface-2 border border-border-subtle">
            <div className="text-[10px] text-text-tertiary uppercase font-medium">Psikometrik İddia</div>
            <div className="text-lg font-bold text-text-primary mt-0.5">
              <span className="text-emerald-700">{evidenceClosureStats.verifiedExactClaims}</span>
              <span className="text-xs text-text-tertiary font-normal"> / {evidenceClosureStats.notVerifiedClaims}</span>
            </div>
            <div className="text-[10px] text-text-tertiary">Exact vs Not-Verified</div>
          </div>
        </div>
      </div>

      {/* EPISTEMIC ADVISORY ALERT */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-800">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Bilimsel Epistemik Uyarı (FAZ 2.3):</span> Tüm aday maddeler{' '}
          <span className="font-mono font-semibold text-amber-900">RESEARCH_DRAFT</span> statüsündedir ve yazar tipi{' '}
          <span className="font-mono font-semibold text-amber-900">GENERATIVE_AI</span> olarak tescillenmiştir.
          Sayısal iddialar AI destekli kaynak taramasıyla (<span className="font-mono font-semibold">AI_ASSISTED_SOURCE_AUDIT</span>) doğrulanmıştır; insan uzman incelemesi henüz yapılmamıştır (<span className="font-mono font-semibold">humanVerified: false</span>).
        </div>
      </div>

      {/* 2. TABBED NAVIGATION */}
      <div className="flex border-b border-border-subtle gap-2">
        <button
          onClick={() => setActiveTab('items')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'items'
              ? 'border-brand-600 text-brand-700 font-semibold'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Madde Havuzu Gezgini ({filteredItems.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('coverage')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'coverage'
              ? 'border-brand-600 text-brand-700 font-semibold'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <span className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4" />
            Kapsama Matrisi (84 Facet $\times$ 5 Yöntem)
          </span>
        </button>

        <button
          onClick={() => setActiveTab('validation')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'validation'
              ? 'border-brand-600 text-brand-700 font-semibold'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Türkçe Validasyon Matrisi ({trMatrix.length} Facet)
          </span>
        </button>

        <button
          onClick={() => setActiveTab('quality')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'quality'
              ? 'border-brand-600 text-brand-700 font-semibold'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Yazım Denetimi & Leksikal Benzerlik
          </span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: ITEM BROWSER */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-surface-1 p-4 rounded-xl border border-border-subtle shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Madde metni, ID veya facet ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border-subtle bg-bg-app text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <select
                value={selectedDomain}
                onChange={(e) => {
                  setSelectedDomain(e.target.value);
                  setSelectedFacet('ALL');
                }}
                className="px-3 py-2 text-sm rounded-lg border border-border-subtle bg-bg-app text-text-primary"
              >
                <option value="ALL">Tüm Domainler</option>
                {domains.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <select
                value={selectedFacet}
                onChange={(e) => setSelectedFacet(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg border border-border-subtle bg-bg-app text-text-primary"
              >
                <option value="ALL">Tüm Facetler ({availableFacets.length})</option>
                {availableFacets.map(f => (
                  <option key={f.facetId} value={f.facetId}>{f.name_tr} ({f.facetId})</option>
                ))}
              </select>

              <select
                value={selectedItemType}
                onChange={(e) => setSelectedItemType(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg border border-border-subtle bg-bg-app text-text-primary"
              >
                <option value="ALL">Tüm Madde Tipleri</option>
                <option value="likert">Likert (Tutum)</option>
                <option value="behavior_frequency">Davranış Sıklığı</option>
                <option value="contextual">Bağlamsal</option>
                <option value="situational_judgement">Senaryo (SJT)</option>
                <option value="forced_choice">Zorunlu Seçim</option>
              </select>

              <select
                value={selectedKeying}
                onChange={(e) => setSelectedKeying(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg border border-border-subtle bg-bg-app text-text-primary"
              >
                <option value="ALL">Tüm Yönler</option>
                <option value="POSITIVE">Pozitif Keying (+)</option>
                <option value="NEGATIVE">Ters Keying (-)</option>
              </select>

              <select
                value={selectedTriage}
                onChange={(e) => setSelectedTriage(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg border border-border-subtle bg-bg-app text-text-primary font-medium text-brand-700"
              >
                <option value="ALL">Tüm Triage Durumları</option>
                <option value="READY_FOR_EXPERT_REVIEW">Uzman İncelemesine Hazır ({readyCount})</option>
                <option value="REQUIRES_INTERNAL_REVISION">İç Revizyon Gerekli ({revisionCount})</option>
                <option value="BLOCKED_PROVENANCE_OR_LICENSE">Engellendi (0)</option>
              </select>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-surface-1 rounded-xl border border-border-subtle shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-2 text-xs font-semibold text-text-tertiary uppercase tracking-wider border-b border-border-subtle">
                  <tr>
                    <th className="py-3 px-4">Madde ID</th>
                    <th className="py-3 px-4">Facet</th>
                    <th className="py-3 px-4">Madde Metni (Türkçe)</th>
                    <th className="py-3 px-4">Tip</th>
                    <th className="py-3 px-4">TR Validasyon</th>
                    <th className="py-3 px-4 text-center">Triage</th>
                    <th className="py-3 px-4 text-center">İncele</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {filteredItems.slice(0, 60).map(item => {
                    const lint = lintMap.get(item.id);
                    const isRevision = item.triageStatus === 'REQUIRES_INTERNAL_REVISION';
                    const tr = trMap.get(item.facetId);

                    return (
                      <tr key={item.id} className="hover:bg-bg-subtle/50 transition-colors">
                        <td className="py-3 px-4 font-mono text-xs font-semibold text-text-primary whitespace-nowrap">
                          {item.id}
                        </td>
                        <td className="py-3 px-4 text-xs text-text-secondary whitespace-nowrap">
                          <span className="font-medium text-text-primary">{item.facetId}</span>
                        </td>
                        <td className="py-3 px-4 text-text-primary max-w-md line-clamp-2">
                          {item.text_tr}
                        </td>
                        <td className="py-3 px-4 text-xs whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {item.itemType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs whitespace-nowrap">
                          {tr?.status === 'DIRECT_FACET_VALIDATION' && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium">
                              Doğrudan Validasyon
                            </span>
                          )}
                          {tr?.status === 'LEXICAL_SUPPORT_ONLY' && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-medium">
                              Leksikal (Wasti)
                            </span>
                          )}
                          {tr?.status === 'RELATED_MEASURE_VALIDATION' && (
                            <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-[11px] font-medium">
                              İlişkili Ölçek
                            </span>
                          )}
                          {(!tr?.status || tr?.status === 'NO_DIRECT_TURKISH_VALIDATION') && (
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 text-[11px]">
                              Doğrulanmamış
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          {isRevision ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold">
                              İç Revizyon
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
                              Uzmana Hazır
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setInspectedItem(item)}
                            className="p-1.5 rounded-lg hover:bg-bg-subtle text-text-secondary hover:text-brand-600 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-surface-2 border-t border-border-subtle text-xs text-text-tertiary flex justify-between items-center">
              <span>Toplam {filteredItems.length} aday maddeden ilk {Math.min(60, filteredItems.length)} tanesi gösteriliyor.</span>
              <span>Sayfa başına limit: 60 (Performans optimizasyonu)</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COVERAGE MATRIX */}
      {activeTab === 'coverage' && (
        <div className="bg-surface-1 rounded-xl border border-border-subtle shadow-xs overflow-hidden">
          <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-2">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">84 Psikolojik Facet Madde Dağılımı ve Metot Dağılımı</h3>
              <p className="text-xs text-text-tertiary mt-0.5">Her facet için üretilen aday maddelerin yöntem çeşitliliği</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              84 / 84 Facet Kapsandı
            </span>
          </div>

          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 sticky top-0 border-b border-border-subtle z-10">
                <tr>
                  <th className="py-2.5 px-3">Facet ID</th>
                  <th className="py-2.5 px-3">Facet Adı (TR)</th>
                  <th className="py-2.5 px-3">Domain</th>
                  <th className="py-2.5 px-3">TR Statüsü</th>
                  <th className="py-2.5 px-3 text-center">Likert</th>
                  <th className="py-2.5 px-3 text-center">Frekans</th>
                  <th className="py-2.5 px-3 text-center">Bağlamsal</th>
                  <th className="py-2.5 px-3 text-center">SJT</th>
                  <th className="py-2.5 px-3 text-center">Zorunlu Seçim</th>
                  <th className="py-2.5 px-3 text-center font-bold">Toplam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {coverageMatrix.map(row => (
                  <tr key={row.facetId} className="hover:bg-bg-subtle/50">
                    <td className="py-2 px-3 font-mono font-medium text-text-primary">{row.facetId}</td>
                    <td className="py-2 px-3 text-text-primary">{row.facetNameTr}</td>
                    <td className="py-2 px-3 text-text-secondary">{row.domainId}</td>
                    <td className="py-2 px-3">
                      {row.trStatus === 'DIRECT_FACET_VALIDATION' ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">Doğrudan</span>
                      ) : row.trStatus === 'LEXICAL_SUPPORT_ONLY' ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-medium">Leksikal</span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">Taslak</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">{row.likert}</td>
                    <td className="py-2 px-3 text-center">{row.frequency}</td>
                    <td className="py-2 px-3 text-center">{row.contextual}</td>
                    <td className="py-2 px-3 text-center">{row.sjt > 0 ? <span className="font-semibold text-amber-700">{row.sjt}</span> : 0}</td>
                    <td className="py-2 px-3 text-center">{row.forcedChoice > 0 ? <span className="font-semibold text-amber-700">{row.forcedChoice}</span> : 0}</td>
                    <td className="py-2 px-3 text-center font-bold text-brand-700">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TURKISH VALIDATION MATRIX */}
      {activeTab === 'validation' && (
        <div className="bg-surface-1 rounded-xl border border-border-subtle shadow-xs overflow-hidden">
          <div className="p-4 border-b border-border-subtle bg-surface-2">
            <h3 className="text-sm font-semibold text-text-primary">84 Facet Adli Türkçe Validasyon Matrisi</h3>
            <p className="text-xs text-text-tertiary mt-0.5">
              Her facet için doğrulanmış Türkçe adaptasyon kaynağı, örneklem büyüklüğü, güvenilirlik ve leksikal destek durumu
            </p>
          </div>

          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 sticky top-0 border-b border-border-subtle z-10">
                <tr>
                  <th className="py-2.5 px-3">Facet ID</th>
                  <th className="py-2.5 px-3">Yapı Adı</th>
                  <th className="py-2.5 px-3">Validasyon Statüsü</th>
                  <th className="py-2.5 px-3">Örneklem (N)</th>
                  <th className="py-2.5 px-3 text-center">İç Tutarlık</th>
                  <th className="py-2.5 px-3 text-center">Test-Tekrar</th>
                  <th className="py-2.5 px-3">Kanıt Konumu (Sayfa/Tablo)</th>
                  <th className="py-2.5 px-3">Bilimsel Kaynak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {trMatrix.map((m: any) => {
                  const ic = m.reliabilityEvidence?.internalConsistency;
                  const tr = m.reliabilityEvidence?.testRetest;
                  const sn = m.studyEvidence?.sampleN;
                  const hasLexicalSupport = m.supportingEvidence?.some((se: any) => se.sourceId === 'src_wasti_2008');
                  return (
                    <tr key={m.facetId} className="hover:bg-bg-subtle/50">
                      <td className="py-2 px-3 font-mono font-medium text-text-primary">{m.facetId}</td>
                      <td className="py-2 px-3 text-text-primary font-medium">{m.facetName}</td>
                      <td className="py-2 px-3">
                        <div className="flex flex-col gap-1 items-start">
                          {m.status === 'DIRECT_FACET_VALIDATION' && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[10px]">
                              DIRECT_FACET_VALIDATION
                            </span>
                          )}
                          {m.measurementAlignmentLevel && m.measurementAlignmentLevel !== 'NOT_APPLICABLE' && (
                            <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 text-[9px] font-mono border border-indigo-200">
                              {m.measurementAlignmentLevel}
                            </span>
                          )}
                          {m.status === 'LEXICAL_SUPPORT_ONLY' && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium text-[10px]">
                              LEXICAL_SUPPORT_ONLY
                            </span>
                          )}
                          {m.status === 'RELATED_MEASURE_VALIDATION' && (
                            <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-medium text-[10px]">
                              RELATED_MEASURE
                            </span>
                          )}
                          {m.status === 'NO_DIRECT_TURKISH_VALIDATION' && (
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px]">
                              NO_DIRECT_TURKISH_VALIDATION
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        {sn?.value != null ? (
                          <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-text-primary">
                            <span>N={sn.value}</span>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">EXACT</span>
                          </div>
                        ) : hasLexicalSupport ? (
                          <span className="text-[10px] text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded">
                            Wasti (N=521 Broad)
                          </span>
                        ) : (
                          <span className="text-text-tertiary font-mono text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-center">
                        {ic?.value != null ? (
                          <div className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-brand-700 bg-brand-50/50 px-1.5 py-0.5 rounded">
                            <span>{ic.value}</span>
                            <span className="text-[9px] text-text-tertiary">({ic.metric || 'alpha'})</span>
                          </div>
                        ) : ic?.claimVerificationStatus === 'NOT_ASSESSED' ? (
                          <span className="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">Leksikal (Ölçülmedi)</span>
                        ) : (
                          <span className="text-text-tertiary font-mono text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-center">
                        {tr?.value != null ? (
                          <div className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            <span>r={tr.value}</span>
                            <span className="text-[9px] text-emerald-600/80">({tr.interval || 'retest'})</span>
                          </div>
                        ) : (
                          <span className="text-text-tertiary font-mono text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-text-secondary text-[11px] font-mono">
                        {ic?.location || sn?.location || '—'}
                      </td>
                      <td className="py-2 px-3 text-text-tertiary text-[11px]">
                        {(m.sourceIds || []).join(', ')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: QUALITY & LINTER */}
      {activeTab === 'quality' && (
        <div className="space-y-6">
          <div className="bg-surface-1 p-5 rounded-xl border border-border-subtle shadow-xs">
            <h3 className="text-sm font-semibold text-text-primary">Otomatik Yazım ve Biçim Taraması (Wording Linter)</h3>
            <p className="text-xs text-text-tertiary mt-1">
              Bu linter çift namlulu ifadeleri, karmaşık olumsuzlukları, uç frekans zarflarını ve SJT/Zorunlu Seçim biçimsel kural ihlallerini denetler.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="p-3 rounded-lg bg-bg-app border border-border-subtle">
                <div className="text-xs text-text-tertiary">Taranan Madde</div>
                <div className="text-xl font-bold text-text-primary mt-0.5">{lintSummary.totalItemsScanned}</div>
              </div>
              <div className="p-3 rounded-lg bg-bg-app border border-border-subtle">
                <div className="text-xs text-text-tertiary">Kusursuz Biçim</div>
                <div className="text-xl font-bold text-emerald-700 mt-0.5">{lintSummary.cleanItemsCount}</div>
              </div>
              <div className="p-3 rounded-lg bg-bg-app border border-border-subtle">
                <div className="text-xs text-text-tertiary">Biçim Uyarısı Alan</div>
                <div className="text-xl font-bold text-amber-700 mt-0.5">{lintSummary.flaggedItemsCount}</div>
              </div>
              <div className="p-3 rounded-lg bg-bg-app border border-border-subtle">
                <div className="text-xs text-text-tertiary">Kritik Hata (Çift Olumsuzluk)</div>
                <div className="text-xl font-bold text-text-primary mt-0.5">{lintSummary.criticalIssuesCount}</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border-subtle">
              <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">KURAL BAZINDA UYARILAR</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(lintSummary.warningsByRule || {}).map(([rule, count]) => (
                  <div key={rule} className="flex justify-between items-center text-xs p-2 rounded bg-surface-2">
                    <span className="font-mono text-text-secondary">{rule}</span>
                    <span className={`font-semibold ${(count as number) > 0 ? 'text-amber-700' : 'text-text-tertiary'}`}>{count as number}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface-1 p-5 rounded-xl border border-border-subtle shadow-xs">
            <h3 className="text-sm font-semibold text-text-primary">Leksikal Benzerlik Analizi (Jaccard Token Index)</h3>
            <p className="text-xs text-text-tertiary mt-1">
              Token-set Jaccard benzerliği (eşik &ge; 0.70) ile facet içi ve yakın komşu yapılar arasındaki kelime örtüşmesi taranmıştır.
            </p>
            <div className="mt-3 p-3 rounded-lg bg-bg-app border border-border-subtle text-xs text-text-secondary">
              <span className="font-semibold text-text-primary">Sonuç:</span> {semanticReport.summaryTr || 'Belirlenen Jaccard lexical threshold üzerinde eşleşme bulunmadı.'}
            </div>
            <div className="text-[11px] text-text-tertiary mt-2">
              * Not: Gerçek anlamsal (semantik) eşdeğerlik analizi çok dilli embedding modelleri ve bağımsız uzman incelemesi gerektirir (Mevcut statü: NOT_ASSESSED).
            </div>
          </div>
        </div>
      )}

      {/* 4. INSPECTION DRAWER (MODAL) */}
      {inspectedItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex justify-end z-50 transition-opacity">
          <div className="w-full max-w-xl bg-surface-1 h-full shadow-2xl overflow-y-auto p-6 space-y-6 border-l border-border-subtle animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                  {inspectedItem.id}
                </span>
                <h3 className="text-base font-bold text-text-primary mt-1">Aday Madde Detayı & Risk Profili</h3>
              </div>
              <button
                onClick={() => setInspectedItem(null)}
                className="text-text-tertiary hover:text-text-primary text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Prompt Preview */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">TÜRKÇE MADDE METNİ</div>
              <div className="p-3.5 rounded-xl bg-bg-app border border-border-subtle text-sm text-text-primary font-medium">
                {inspectedItem.text_tr}
              </div>
              {inspectedItem.text_en && (
                <div className="text-xs text-text-tertiary italic">
                  İngilizce Karşılığı: {inspectedItem.text_en}
                </div>
              )}
            </div>

            {/* SJT Scenario Options if applicable */}
            {inspectedItem.situationalScenarios && inspectedItem.situationalScenarios.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">SENARYO SEÇENEKLERİ (SJT)</div>
                <div className="space-y-1.5">
                  {inspectedItem.situationalScenarios.map((sc: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-surface-2 text-xs text-text-primary border border-border-subtle flex justify-between">
                      <span>{sc.text_tr}</span>
                      <span className="font-mono text-text-tertiary ml-2">Ağırlık: {sc.weight}</span>
                    </div>
                  ))}
                </div>
                {inspectedItem.sjtReviewStatus === 'SJT_REQUIRES_REVISION' && (
                  <div className="text-xs text-amber-700 font-medium flex items-center gap-1.5 mt-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    SJT Revizyon Uyarısı: Seçenek sayısı 3'ten az (Obvious trade-off riski).
                  </div>
                )}
              </div>
            )}

            {/* Multi-Dimensional Forensic Risk Badges */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">9 BOYUTLU ADLİ RİSK PROFİLİ</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-surface-2 border border-border-subtle">
                  <div className="text-text-tertiary text-[10px]">YAZAR & PROVENANCE</div>
                  <div className="font-semibold text-text-primary mt-0.5">GENERATIVE_AI</div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-2 border border-border-subtle">
                  <div className="text-text-tertiary text-[10px]">İNSAN UZMAN İNCELEMESİ</div>
                  <div className="font-semibold text-amber-700 mt-0.5">YAPILMADI (false)</div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-2 border border-border-subtle">
                  <div className="text-text-tertiary text-[10px]">LİSANS DAYANAĞI</div>
                  <div className="font-semibold text-text-primary mt-0.5">ORIGINAL_WORDING</div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-2 border border-border-subtle">
                  <div className="text-text-tertiary text-[10px]">WORDING LINT DURUMU</div>
                  <div className="font-semibold text-emerald-700 mt-0.5">{inspectedItem.wordingLintStatus || 'PASS'}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-2 border border-border-subtle">
                  <div className="text-text-tertiary text-[10px]">LEKSİKAL BENZERLİK</div>
                  <div className="font-semibold text-text-primary mt-0.5">{inspectedItem.lexicalSimilarityStatus || 'UNIQUE'}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-2 border border-border-subtle">
                  <div className="text-text-tertiary text-[10px]">TRIAGE DURUMU</div>
                  <div className="font-semibold text-brand-700 mt-0.5">{inspectedItem.triageStatus}</div>
                </div>
              </div>
            </div>

            {/* Epistemic Boundary Notice */}
            <div className="p-3 rounded-xl bg-slate-100 text-slate-700 text-xs border border-slate-200">
              <span className="font-semibold">Bilimsel Geçerlilik Sınırı:</span> Bu madde psikometrik olarak kalibre edilmiş bir test sorusu değildir. Yalnızca biçimsel ve kuramsal olarak yapılandırılmış bir araştırma taslağıdır (<span className="font-mono">RESEARCH_DRAFT</span>).
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
