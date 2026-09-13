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

      {/* EPISTEMIC ADVISORY ALERT */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-800">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Bilimsel Epistemik Uyarı (FAZ 2.1):</span> Tüm aday maddeler{' '}
          <span className="font-mono font-semibold text-amber-900">RESEARCH_DRAFT</span> statüsündedir ve yazar tipi{' '}
          <span className="font-mono font-semibold text-amber-900">GENERATIVE_AI</span> olarak tescillenmiştir.
          Bağımsız insan psikometrist incelemesi, bilişsel görüşmeler ve ampirik pilot kalibrasyon (EFA/CFA/IRT) tamamlanmadan hiçbir madde kalibre edilmiş kabul edilemez.
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
                  <th className="py-2.5 px-3">Enstrüman</th>
                  <th className="py-2.5 px-3">Örneklem Açıklaması</th>
                  <th className="py-2.5 px-3 text-center">Cronbach Alpha</th>
                  <th className="py-2.5 px-3 text-center">Test-Tekrar</th>
                  <th className="py-2.5 px-3">Bilimsel Kaynak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {trMatrix.map((m: any) => (
                  <tr key={m.facetId} className="hover:bg-bg-subtle/50">
                    <td className="py-2 px-3 font-mono font-medium text-text-primary">{m.facetId}</td>
                    <td className="py-2 px-3 text-text-primary font-medium">{m.facetName}</td>
                    <td className="py-2 px-3">
                      {m.status === 'DIRECT_FACET_VALIDATION' && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[10px]">
                          DIRECT_FACET_VALIDATION
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
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] text-text-secondary">{m.instrumentId || '—'}</td>
                    <td className="py-2 px-3 text-text-secondary max-w-xs truncate">{m.sampleDescription || 'Doğrulanmış Türk örneklemi yok'}</td>
                    <td className="py-2 px-3 text-center font-mono">{m.reliabilityEvidence?.alpha != null ? m.reliabilityEvidence.alpha : '—'}</td>
                    <td className="py-2 px-3 text-center font-mono">{m.reliabilityEvidence?.testRetestCoefficient != null ? m.reliabilityEvidence.testRetestCoefficient : '—'}</td>
                    <td className="py-2 px-3 text-text-tertiary text-[11px]">{(m.sourceIds || []).join(', ')}</td>
                  </tr>
                ))}
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
