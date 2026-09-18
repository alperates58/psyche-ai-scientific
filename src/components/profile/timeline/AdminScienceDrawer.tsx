'use client';

import React, { useState } from 'react';
import { MeasurementEpoch, FacetTrajectory } from '@/types/longitudinal';
import { Terminal, Shield, ChevronDown, ChevronUp, Database, FileText } from 'lucide-react';

interface AdminScienceDrawerProps {
  epochs: MeasurementEpoch[];
  trajectories: FacetTrajectory[];
  userId: string;
}

export function AdminScienceDrawer({ epochs, trajectories, userId }: AdminScienceDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-slate-300 bg-slate-900 text-slate-100 p-5 shadow-sm">
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2.5">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-mono font-semibold tracking-wide text-slate-200">
            BİLİMSEL DENETİM & TEKNİK METAVERİ PANELİ (FAZ 2.20 SCIENTIFIC AUDIT)
          </span>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[11px] font-mono text-slate-300 hover:bg-slate-700"
        >
          {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          <span>{isOpen ? 'Gizle' : 'İncele'}</span>
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 space-y-4 border-t border-slate-800 pt-4 text-xs font-mono">
          <div>
            <span className="text-slate-400">User Identity (Internal ID):</span>{' '}
            <span className="text-emerald-400">{userId}</span>
          </div>

          <div>
            <h4 className="font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-indigo-400" />
              Ölçüm Dönemleri ve Snapshot Kayıtları ({epochs.length} Epoch):
            </h4>
            <div className="space-y-2">
              {epochs.map((e) => (
                <div key={e.epochId} className="rounded bg-slate-800/80 p-2.5 border border-slate-700">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-indigo-300 font-bold">Epoch ID: {e.epochId}</span>
                    <span className="text-[11px] text-slate-400">
                      Snapshots: {e.profileSnapshotIds.join(', ') || 'DIRECT_AGGREGATED'}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-300">
                    Batarya: {e.batteryVersion} | Model: {e.measurementModelVersion} | Puanlama: {e.scoringModelVersion}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    Oturumlar: {e.sourceSessionIds.join(', ')} | Kalite: {e.responseQuality}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-indigo-400" />
              Tekrarlanan Boyutlar ve Trajectory Verileri ({trajectories.filter(t => t.isRepeatMeasured).length} Trajectory):
            </h4>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {trajectories.filter(t => t.isRepeatMeasured).map((t) => (
                <div key={t.facetId} className="flex items-center justify-between rounded bg-slate-800/40 p-2 text-[11px]">
                  <span className="text-slate-300">{t.nameTr} ({t.facetId})</span>
                  <span className="text-emerald-400">
                    Points: {t.points.length} | Delta: {t.rawDelta ?? '0.00'} | {t.classification}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
