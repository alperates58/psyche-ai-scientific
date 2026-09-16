'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createNewItemAction } from '@/actions/scientificAdminActions';
import {
  Database,
  Layers,
  HelpCircle,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

interface DomainCascade {
  id: string;
  nameTr: string;
  nameEn: string;
  constructs: {
    id: string;
    nameTr: string;
    nameEn: string;
    facets: {
      id: string;
      code: string;
      nameTr: string;
      nameEn: string;
    }[];
  }[];
}

interface InstrumentOption {
  id: string;
  code: string;
  name: string;
  licenseType: string;
}

interface ItemAuthoringFormProps {
  ontologyCascade: DomainCascade[];
  instruments: InstrumentOption[];
}

export const ItemAuthoringForm: React.FC<ItemAuthoringFormProps> = ({
  ontologyCascade,
  instruments,
}) => {
  const router = useRouter();

  // Cascading selections
  const [selectedDomainId, setSelectedDomainId] = useState<string>(ontologyCascade[0]?.id || '');
  const [selectedConstructId, setSelectedConstructId] = useState<string>('');
  const [selectedFacetId, setSelectedFacetId] = useState<string>('');

  // Item metadata
  const [itemCode, setItemCode] = useState('');
  const [isKeyed, setIsKeyed] = useState<boolean>(true); // true = regular (+), false = reverse (-)
  const [isAttentionCheck, setIsAttentionCheck] = useState<boolean>(false);
  const [instrumentId, setInstrumentId] = useState<string>('');

  // Version prompt & notes
  const [promptTr, setPromptTr] = useState('');
  const [promptEn, setPromptEn] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derived constructs based on selected domain
  const availableConstructs = useMemo(() => {
    const domain = ontologyCascade.find((d) => d.id === selectedDomainId);
    return domain?.constructs || [];
  }, [ontologyCascade, selectedDomainId]);

  // Derived facets based on selected construct
  const availableFacets = useMemo(() => {
    const construct = availableConstructs.find((c) => c.id === selectedConstructId);
    return construct?.facets || [];
  }, [availableConstructs, selectedConstructId]);

  // Handle Domain Change
  const handleDomainChange = (domainId: string) => {
    setSelectedDomainId(domainId);
    const domain = ontologyCascade.find((d) => d.id === domainId);
    const firstConstruct = domain?.constructs[0];
    setSelectedConstructId(firstConstruct?.id || '');
    setSelectedFacetId(firstConstruct?.facets[0]?.id || '');
  };

  // Handle Construct Change
  const handleConstructChange = (constructId: string) => {
    setSelectedConstructId(constructId);
    const construct = availableConstructs.find((c) => c.id === constructId);
    setSelectedFacetId(construct?.facets[0]?.id || '');
  };

  // Initialize cascade on mount if empty
  React.useEffect(() => {
    if (availableConstructs.length > 0 && !selectedConstructId) {
      setSelectedConstructId(availableConstructs[0].id);
    }
  }, [availableConstructs, selectedConstructId]);

  React.useEffect(() => {
    if (availableFacets.length > 0 && !selectedFacetId) {
      setSelectedFacetId(availableFacets[0].id);
    }
  }, [availableFacets, selectedFacetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedFacetId) {
      setError('Lütfen bir alt boyut (facet) seçiniz.');
      return;
    }

    setLoading(true);

    try {
      const res = await createNewItemAction({
        facetId: selectedFacetId,
        itemCode: itemCode.trim().toUpperCase(),
        itemType: 'LIKERT_5',
        isKeyed,
        isAttentionCheck,
        instrumentId: instrumentId ? instrumentId : null,
        promptTr: promptTr.trim(),
        promptEn: promptEn.trim(),
        notes: notes.trim() || undefined,
      });

      if (!res.success) {
        setError(res.error || 'Madde oluşturulamadı.');
        setLoading(false);
        return;
      }

      router.push(`/admin/item-bank/${res.data.item.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Beklenmedik bir hata oluştu.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs animate-in fade-in duration-200">
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start space-x-2.5 shadow-xs">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <div>
            <p className="font-bold">Madde Oluşturulamadı</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* 1. Ontology Mapping Section */}
      <div className="p-6 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center">
            <Layers className="w-4 h-4 mr-2 text-brand-600" />
            1. Psikolojik Boyut Eşleşmesi (Ontology Chain)
          </h2>
          <p className="text-[11px] text-text-tertiary mt-0.5">
            Maddenin ölçümleyeceği Alan (Domain), Ana Yapı (Construct) ve Alt Boyut (Facet) seçimi
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Domain Selection */}
          <div>
            <label className="block font-semibold text-text-primary mb-1.5">
              Alan (Domain) <span className="text-rose-600">*</span>
            </label>
            <select
              value={selectedDomainId}
              onChange={(e) => handleDomainChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 font-medium"
            >
              {ontologyCascade.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nameTr} ({d.nameEn})
                </option>
              ))}
            </select>
          </div>

          {/* Construct Selection */}
          <div>
            <label className="block font-semibold text-text-primary mb-1.5">
              Ana Yapı (Construct) <span className="text-rose-600">*</span>
            </label>
            <select
              value={selectedConstructId}
              onChange={(e) => handleConstructChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 font-medium"
            >
              {availableConstructs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameTr}
                </option>
              ))}
            </select>
          </div>

          {/* Facet Selection */}
          <div>
            <label className="block font-semibold text-text-primary mb-1.5">
              Alt Boyut (Facet) <span className="text-rose-600">*</span>
            </label>
            <select
              value={selectedFacetId}
              onChange={(e) => setSelectedFacetId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 font-bold text-brand-700"
            >
              {availableFacets.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nameTr} ({f.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Item Code & Scoring Properties */}
      <div className="p-6 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center">
            <Database className="w-4 h-4 mr-2 text-brand-600" />
            2. Madde Kodu & Puanlama Yönü
          </h2>
          <p className="text-[11px] text-text-tertiary mt-0.5">
            Benzersiz madde kodu, ters kodlama ve dikkat kontrolü ayarları
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-text-primary mb-1.5">
              Benzersiz Madde Kodu <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
              placeholder="Örn: BIG5_NEO_N_01 veya HEX_O_12"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 uppercase"
            />
            <p className="text-[11px] text-text-tertiary mt-1">
              Büyük harf, rakam ve alt çizgi önerilir.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-text-primary mb-1.5">
              Kaynak Envanter / Lisans İlişkisi (İsteğe Bağlı)
            </label>
            <select
              value={instrumentId}
              onChange={(e) => setInstrumentId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              <option value="">Özgün / Bağımsız Araştırma Maddesi (Envanter Yok)</option>
              {instruments.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} ({inst.licenseType})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Scoring direction & attention check */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Reverse scoring toggle */}
          <div className="p-4 rounded-xl bg-surface-2/50 border border-border-subtle space-y-2">
            <span className="block font-bold text-text-primary text-xs">Puanlama Yönü (isKeyed Semantiği)</span>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="isKeyed"
                  checked={isKeyed === true}
                  onChange={() => setIsKeyed(true)}
                  className="text-brand-600 focus:ring-brand-500"
                />
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Normal Puanlama (+)
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="isKeyed"
                  checked={isKeyed === false}
                  onChange={() => setIsKeyed(false)}
                  className="text-brand-600 focus:ring-brand-500"
                />
                <span className="font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Ters Puanlama (-)
                </span>
              </label>
            </div>
            <p className="text-[11px] text-text-tertiary">
              Ters puanlanan sorularda 1 puan 5 puana, 2 puan 4 puana dönüştürülerek hesaplanır.
            </p>
          </div>

          {/* Attention Check toggle */}
          <div className="p-4 rounded-xl bg-surface-2/50 border border-border-subtle space-y-2">
            <span className="block font-bold text-text-primary text-xs">Dikkat & Geçerlik Kontrolü</span>
            <label className="flex items-center space-x-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isAttentionCheck}
                onChange={(e) => setIsAttentionCheck(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-border-strong"
              />
              <span className="font-semibold text-text-primary">
                Bu soru bir dikkat kontrolü (Attention Check) sorusudur
              </span>
            </label>
            <p className="text-[11px] text-text-tertiary">
              İşaretlenirse katılımcının rastgele yanıt verme olasılığı puanlama motorunca denetlenir.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Initial Version Prompts */}
      <div className="p-6 bg-surface-1 border border-border-subtle rounded-2xl shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center">
            <FileText className="w-4 h-4 mr-2 text-brand-600" />
            3. İlk Sürüm (v1) Önerme Metinleri & Ölçek
          </h2>
          <p className="text-[11px] text-text-tertiary mt-0.5">
            Yeni madde ilk olarak v1 (DRAFT / RESEARCH_DRAFT) durumunda, standart 5 seçenekli Likert ölçeğiyle başlatılacaktır.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-text-primary mb-1.5">
              Türkçe Önerme Metni (TR) <span className="text-rose-600">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={promptTr}
              onChange={(e) => setPromptTr(e.target.value)}
              placeholder="Örn: Yeni insanlarla tanışmaktan büyük keyif alırım."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-text-primary mb-1.5">
              İngilizce Orijinal / Referans Metin (EN) <span className="text-rose-600">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={promptEn}
              onChange={(e) => setPromptEn(e.target.value)}
              placeholder="e.g. I really enjoy meeting new people."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none italic"
            />
          </div>

          <div>
            <label className="block font-semibold text-text-primary mb-1.5">
              Yazar Notu / Psikometrik Açıklama
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Örn: IPIP maddesinden Türkçeye adapte edildi."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2/60 border border-border-subtle text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>
        </div>

        {/* Provenance Banner */}
        <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/60 text-blue-900 text-[11px] flex items-center justify-between">
          <span>
            Yazar Kökeni: <strong>ADMIN_AUTHORED</strong> (Yönetici Girişi) • Durum: <strong>DRAFT / RESEARCH_DRAFT</strong>
          </span>
          <span className="text-blue-700 font-semibold">Standart 5'li Likert Ölçeği Otomatik Oluşturulur</span>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Link
          href="/admin/item-bank"
          className="inline-flex items-center px-4 py-2.5 rounded-xl border border-border-subtle bg-surface-1 hover:bg-surface-2 text-text-secondary font-semibold transition-colors min-h-[42px]"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Madde Bankasına Dön
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-xs transition-colors disabled:opacity-50 min-h-[42px]"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Maddeyi ve v1 Sürümünü Oluştur
        </button>
      </div>
    </form>
  );
};
