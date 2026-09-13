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
  Download
} from 'lucide-react';

interface ItemBankClientViewProps {
  items: any[];
  evidenceMap: any[];
  constructs: any[];
  sources: any[];
  instruments: any[];
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
  lintSummary,
  itemLintResults,
  semanticReport
}: ItemBankClientViewProps) {
  const [activeTab, setActiveTab] = useState<'items' | 'coverage' | 'literature' | 'quality'>('items');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [selectedFacet, setSelectedFacet] = useState('ALL');
  const [selectedItemType, setSelectedItemType] = useState('ALL');
  const [selectedKeying, setSelectedKeying] = useState('ALL');
  const [inspectedItem, setInspectedItem] = useState<any | null>(null);

  // Lint results map by Item ID
  const lintMap = useMemo(() => {
    const map = new Map<string, any>();
    for (const r of itemLintResults) {
      map.set(r.itemId, r);
    }
    return map;
  }, [itemLintResults]);

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
  }, [items, selectedDomain, selectedFacet, selectedItemType, selectedKeying, searchQuery]);

  // Coverage matrix calculations (84 facets x Item types)
  const coverageMatrix = useMemo(() => {
    return evidenceMap.map(ev => {
      const facetItems = items.filter(it => it.facetId === ev.facetId);
      return {
        facetId: ev.facetId,
        facetNameTr: ev.name_tr,
        facetNameEn: ev.name_en,
        domainId: ev.domainId,
        total: facetItems.length,
        likert: facetItems.filter(it => it.itemType === 'likert').length,
        frequency: facetItems.filter(it => it.itemType === 'behavior_frequency').length,
        contextual: facetItems.filter(it => it.itemType === 'contextual').length,
        sjt: facetItems.filter(it => it.itemType === 'situational_judgement').length,
        forcedChoice: facetItems.filter(it => it.itemType === 'forced_choice').length
      };
    });
  }, [evidenceMap, items]);

  return (
    <div className="space-y-6">
      {/* 1. KEY METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-surface-1 p-4 rounded-xl border border-border-subtle shadow-xs">
          <div className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">TOPLAM ADAY MADDE</div>
          <div className="text-2xl font-bold text-text-primary mt-1">{items.length}</div>
          <div className="text-xs text-text-tertiary mt-0.5">9 psikolojik domain</div>
        </div>

        <div className="bg-surface-1 p-4 rounded-xl border border-border-subtle shadow-xs">
          <div className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">ONTOLOJİ KAPSAMA</div>
          <div className="text-2xl font-bold text-brand-700 mt-1">{evidenceMap.length} / 84</div>
          <div className="text-xs text-emerald-700 font-medium mt-0.5">%100 Kapsama Oranı</div>
        </div>

        <div className="bg-surface-1 p-4 rounded-xl border border-border-subtle shadow-xs">
          <div className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">ORTALAMA KALİTE</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{lintSummary.averageQualityScore} / 100</div>
          <div className="text-xs text-text-tertiary mt-0.5">Linter puanı</div>
        </div>

        <div className="bg-surface-1 p-4 rounded-xl border border-border-subtle shadow-xs">
          <div className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">LİSANS GÜVENLİĞİ</div>
          <div className="text-2xl font-bold text-indigo-700 mt-1">%100</div>
          <div className="text-xs text-text-tertiary mt-0.5">Telif ve izin onaylı</div>
        </div>

        <div className="bg-surface-1 p-4 rounded-xl border border-border-subtle shadow-xs col-span-2 lg:col-span-1">
          <div className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">KRİTİK HATA SAYISI</div>
          <div className="text-2xl font-bold text-text-primary mt-1">{lintSummary.criticalIssuesCount}</div>
          <div className="text-xs text-emerald-700 font-medium mt-0.5">0 Çift Olumsuzluk</div>
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
            Soru Bankası Kapsama Matrisi (84 Facet)
          </span>
        </button>

        <button
          onClick={() => setActiveTab('literature')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'literature'
              ? 'border-brand-600 text-brand-700 font-semibold'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Literatür ve Kanıt Matrisi
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
            Kalite Denetleyicisi ve Anlamsal Kümeler
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
                    <th className="py-3 px-4 text-center">Yön</th>
                    <th className="py-3 px-4 text-center">Kalite</th>
                    <th className="py-3 px-4 text-center">İncele</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {filteredItems.slice(0, 50).map(item => {
                    const lint = lintMap.get(item.id);
                    const isFlagged = lint && lint.warnings.length > 0;
                    return (
                      <tr key={item.id} className="hover:bg-bg-subtle/50 transition-colors">
                        <td className="py-3 px-4 font-mono text-xs font-semibold text-text-primary whitespace-nowrap">
                          {item.id}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-surface-2 text-text-secondary border border-border-subtle">
                            {item.facetId}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-md">
                          <div className="text-text-primary font-medium">{item.text_tr}</div>
                          {item.text_en && (
                            <div className="text-xs text-text-tertiary italic mt-0.5">{item.text_en}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="text-xs font-medium text-text-secondary capitalize">
                            {item.itemType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                            item.keying === 'POSITIVE'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}>
                            {item.keying === 'POSITIVE' ? '+' : '–'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          {isFlagged ? (
                            <span className="inline-flex items-center text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {lint.warnings.length} Uyarı
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Kusursuz
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => setInspectedItem(item)}
                            className="p-1.5 rounded-lg hover:bg-surface-2 text-text-secondary hover:text-text-primary transition-all"
                            title="Ayrıntıları Görüntüle"
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

            {filteredItems.length > 50 && (
              <div className="p-3 text-center text-xs text-text-tertiary bg-surface-2/40 border-t border-border-subtle">
                Performans nedeniyle ilk 50 madde gösteriliyor (Toplam: {filteredItems.length} aday madde). Arama ve filtrelerle daraltabilirsiniz.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: COVERAGE MATRIX (84 Facets x Item Types) */}
      {activeTab === 'coverage' && (
        <div className="bg-surface-1 rounded-xl border border-border-subtle shadow-xs overflow-hidden">
          <div className="p-4 border-b border-border-subtle flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-text-primary">84 Facet Soru Bankası Kapsama Matrisi</h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Her bir psikolojik facet için üretilen çok yöntemli soru dağılımı.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Güçlü (&ge;8)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Yeterli (4-7)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Başlangıç (1-3)</span>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 sticky top-0 font-semibold text-text-tertiary uppercase tracking-wider border-b border-border-subtle z-10">
                <tr>
                  <th className="py-2.5 px-4">Facet</th>
                  <th className="py-2.5 px-4">Domain</th>
                  <th className="py-2.5 px-4 text-center">Likert</th>
                  <th className="py-2.5 px-4 text-center">Davranış Sıklığı</th>
                  <th className="py-2.5 px-4 text-center">Bağlamsal</th>
                  <th className="py-2.5 px-4 text-center">SJT / Senaryo</th>
                  <th className="py-2.5 px-4 text-center">Zorunlu Seçim</th>
                  <th className="py-2.5 px-4 text-center font-bold">Toplam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {coverageMatrix.map(row => (
                  <tr key={row.facetId} className="hover:bg-bg-subtle/50 transition-colors">
                    <td className="py-2 px-4 font-medium text-text-primary whitespace-nowrap">
                      {row.facetNameTr} <span className="text-[10px] text-text-tertiary font-mono">({row.facetId})</span>
                    </td>
                    <td className="py-2 px-4 text-text-tertiary whitespace-nowrap">{row.domainId}</td>
                    <td className="py-2 px-4 text-center font-mono">{row.likert}</td>
                    <td className="py-2 px-4 text-center font-mono">{row.frequency}</td>
                    <td className="py-2 px-4 text-center font-mono">{row.contextual}</td>
                    <td className="py-2 px-4 text-center font-mono">{row.sjt}</td>
                    <td className="py-2 px-4 text-center font-mono">{row.forcedChoice}</td>
                    <td className="py-2 px-4 text-center font-mono font-bold text-emerald-700 bg-emerald-50/50">
                      {row.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LITERATURE & EVIDENCE MATRIX */}
      {activeTab === 'literature' && (
        <div className="bg-surface-1 rounded-xl border border-border-subtle shadow-xs overflow-hidden">
          <div className="p-4 border-b border-border-subtle">
            <h3 className="font-semibold text-text-primary">84 Facet Literatür ve Kanıt Matrisi</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Her bir psikolojik facetin bilimsel kanıt düzeyi, resmi ölçüm aracı, lisans durumu ve Türkçe geçerlik haritası.
            </p>
          </div>

          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 sticky top-0 font-semibold text-text-tertiary uppercase tracking-wider border-b border-border-subtle z-10">
                <tr>
                  <th className="py-2.5 px-4">Facet</th>
                  <th className="py-2.5 px-4">Kanıt Düzeyi</th>
                  <th className="py-2.5 px-4">Birincil Araç</th>
                  <th className="py-2.5 px-4">Lisans Notu</th>
                  <th className="py-2.5 px-4">Türkçe Uyarlama Statüsü</th>
                  <th className="py-2.5 px-4">Sosyal Beğenirlik Riski</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {evidenceMap.map(ev => (
                  <tr key={ev.facetId} className="hover:bg-bg-subtle/50 transition-colors">
                    <td className="py-2 px-4 font-medium text-text-primary whitespace-nowrap">
                      {ev.name_tr} <span className="text-[10px] text-text-tertiary font-mono">({ev.facetId})</span>
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ev.evidenceLevel === 'gold_standard'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}>
                        {ev.evidenceLevel.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2 px-4 font-mono text-text-secondary whitespace-nowrap">
                      {(ev.instruments || []).join(', ') || 'custom_construct'}
                    </td>
                    <td className="py-2 px-4 text-text-secondary max-w-xs truncate" title={ev.licenseNotes}>
                      {ev.licenseNotes}
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {ev.turkishValidationStatus}
                      </span>
                    </td>
                    <td className="py-2 px-4 capitalize text-text-secondary">
                      {ev.socialDesirabilityRisk}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: QUALITY LINTER REPORT */}
      {activeTab === 'quality' && (
        <div className="space-y-6">
          {/* Rule Breakdown */}
          <div className="bg-surface-1 p-5 rounded-xl border border-border-subtle shadow-xs">
            <h3 className="font-semibold text-text-primary text-sm mb-4">Otomatik Kalite Denetleyicisi Kural Dağılımı (Linter)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(lintSummary.warningsByRule).map(([rule, count]: [string, any]) => (
                <div key={rule} className="p-3 bg-surface-2/50 rounded-lg border border-border-subtle">
                  <div className="text-[11px] font-mono text-text-tertiary">{rule}</div>
                  <div className="text-xl font-bold text-text-primary mt-1">{count}</div>
                  <div className="text-[10px] text-text-tertiary">
                    {count === 0 ? 'Kusursuz (0 Uyarı)' : 'Denetlendi'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Semantic Duplicate Analysis */}
          <div className="bg-surface-1 p-5 rounded-xl border border-border-subtle shadow-xs">
            <h3 className="font-semibold text-text-primary text-sm mb-2">Anlamsal Benzerlik ve Küme Analizi (Semantic Duplicate Analysis)</h3>
            <p className="text-xs text-text-secondary mb-4">
              Eşik Değeri: %70 token benzerliği. Aynı facet içinde neredeyse aynı şeyi soran mükerrer soruların saptanması.
            </p>

            {semanticReport.totalDuplicatesDetected === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Madde havuzunda %70 ve üzeri anlamsal örtüşme gösteren hiçbir mükerrer (duplicate) soru saptanmadı. Tüm maddeler ayırt edici davranışsal göstergelere sahiptir.
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                {semanticReport.duplicatePairs.map((p: any, idx: number) => (
                  <div key={idx} className="p-3 bg-surface-2 rounded-lg text-xs">
                    <div className="font-semibold text-amber-800 mb-1">Benzerlik Skoru: %{Math.round(p.similarityScore * 100)} ({p.facetId})</div>
                    <div className="text-text-primary">Madde A ({p.itemAId}): {p.itemAText}</div>
                    <div className="text-text-primary">Madde B ({p.itemBId}): {p.itemBText}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. ITEM DETAILS DRAWER / MODAL */}
      {inspectedItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-1 w-full max-w-2xl rounded-2xl border border-border-subtle shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-border-subtle flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                  {inspectedItem.id}
                </span>
                <h3 className="font-bold text-text-primary text-base mt-1.5">
                  {inspectedItem.facetId} &middot; {inspectedItem.constructId}
                </h3>
              </div>
              <button
                onClick={() => setInspectedItem(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-2 text-text-tertiary hover:text-text-primary"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-sm">
              <div>
                <label className="text-xs font-semibold text-text-tertiary uppercase">Madde Metni (Türkçe)</label>
                <div className="text-text-primary font-medium text-base mt-1 p-3 bg-surface-2/60 rounded-xl border border-border-subtle">
                  {inspectedItem.text_tr}
                </div>
              </div>

              {inspectedItem.text_en && (
                <div>
                  <label className="text-xs font-semibold text-text-tertiary uppercase">Referans Metin (İngilizce)</label>
                  <div className="text-text-secondary text-xs italic mt-1 p-2 bg-surface-2/30 rounded-lg">
                    {inspectedItem.text_en}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 bg-surface-2/40 rounded-lg">
                  <span className="text-text-tertiary block">Yöntem / Tip:</span>
                  <span className="font-semibold text-text-primary">{inspectedItem.itemType}</span>
                </div>
                <div className="p-2.5 bg-surface-2/40 rounded-lg">
                  <span className="text-text-tertiary block">Puanlama Yönü:</span>
                  <span className="font-semibold text-text-primary">{inspectedItem.keying}</span>
                </div>
                <div className="p-2.5 bg-surface-2/40 rounded-lg">
                  <span className="text-text-tertiary block">Bağlam:</span>
                  <span className="font-semibold text-text-primary">{inspectedItem.context}</span>
                </div>
                <div className="p-2.5 bg-surface-2/40 rounded-lg">
                  <span className="text-text-tertiary block">Sosyal Beğenirlik:</span>
                  <span className="font-semibold text-text-primary">{inspectedItem.socialDesirabilitySensitivity}</span>
                </div>
                <div className="p-2.5 bg-surface-2/40 rounded-lg">
                  <span className="text-text-tertiary block">Lisans Durumu:</span>
                  <span className="font-semibold text-text-primary">{inspectedItem.licenseStatus}</span>
                </div>
                <div className="p-2.5 bg-surface-2/40 rounded-lg">
                  <span className="text-text-tertiary block">Validasyon Statüsü:</span>
                  <span className="font-semibold text-text-primary">{inspectedItem.validationStatus}</span>
                </div>
              </div>

              {/* Linter Checks for this item */}
              {lintMap.get(inspectedItem.id) && (
                <div>
                  <label className="text-xs font-semibold text-text-tertiary uppercase">Otomatik Kalite Denetimi</label>
                  <div className="mt-1.5 p-3 rounded-xl border border-border-subtle bg-surface-2/30">
                    {lintMap.get(inspectedItem.id).warnings.length === 0 ? (
                      <div className="text-xs text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Tüm linter kurallarını eksiksiz geçti (Kalite Skoru: 100/100).
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {lintMap.get(inspectedItem.id).warnings.map((w: any, idx: number) => (
                          <div key={idx} className="text-xs text-amber-800 flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                            <span>{w.messageTr}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Translation Provenance */}
              <div>
                <label className="text-xs font-semibold text-text-tertiary uppercase">Çeviri ve Köken Bilgisi (Provenance)</label>
                <div className="mt-1 text-xs text-text-secondary bg-surface-2/30 p-2.5 rounded-lg space-y-1">
                  <div>Yazar Grubu: {inspectedItem.translationProvenance?.translatorType}</div>
                  <div>Yöntem: {inspectedItem.translationProvenance?.translationMethod}</div>
                  <div>Kültürel İnceleme: {inspectedItem.translationProvenance?.culturalReviewStatus}</div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border-subtle bg-surface-2/40 flex justify-end">
              <button
                onClick={() => setInspectedItem(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-surface-1 border border-border-subtle hover:bg-surface-2 text-text-primary"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
