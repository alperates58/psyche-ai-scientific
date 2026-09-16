'use client';

import React from 'react';
import {
  Sparkles,
  Layers,
  Heart,
  UserCheck,
  Users,
  Compass,
  Brain,
  Zap,
  ShieldCheck,
  FileText,
} from 'lucide-react';

export type ProfileLayerId =
  | 'summary'
  | 'personality'
  | 'self_system'
  | 'emotion'
  | 'relationships'
  | 'motivation'
  | 'cognition'
  | 'behavior'
  | 'quality'
  | 'sources';

export interface ProfileLayerTab {
  id: ProfileLayerId;
  labelTr: string;
  icon: React.ElementType;
  badgeCount?: number;
  isAvailable: boolean;
}

interface ProfileLayerNavigationProps {
  activeLayer: ProfileLayerId;
  onSelectLayer: (layerId: ProfileLayerId) => void;
  availableLayers: {
    hasPersonality: boolean;
    hasSelfSystem: boolean;
    hasEmotion: boolean;
    hasRelationships: boolean;
    hasMotivation: boolean;
    hasCognition: boolean;
    hasBehavior: boolean;
  };
}

export const ProfileLayerNavigation: React.FC<ProfileLayerNavigationProps> = ({
  activeLayer,
  onSelectLayer,
  availableLayers,
}) => {
  const allTabs: ProfileLayerTab[] = [
    {
      id: 'summary',
      labelTr: 'Özet Görünüm',
      icon: Sparkles,
      isAvailable: true,
    },
    {
      id: 'personality',
      labelTr: 'Kişilik (HEXACO)',
      icon: Layers,
      isAvailable: availableLayers.hasPersonality,
    },
    {
      id: 'self_system',
      labelTr: 'Benlik Sistemi',
      icon: UserCheck,
      isAvailable: availableLayers.hasSelfSystem,
    },
    {
      id: 'emotion',
      labelTr: 'Duygular & Düzenleme',
      icon: Heart,
      isAvailable: availableLayers.hasEmotion,
    },
    {
      id: 'relationships',
      labelTr: 'İlişkiler & Bağlanma',
      icon: Users,
      isAvailable: availableLayers.hasRelationships,
    },
    {
      id: 'motivation',
      labelTr: 'Motivasyon & Değerler',
      icon: Compass,
      isAvailable: availableLayers.hasMotivation,
    },
    {
      id: 'cognition',
      labelTr: 'Biliş & Karar',
      icon: Brain,
      isAvailable: availableLayers.hasCognition,
    },
    {
      id: 'behavior',
      labelTr: 'Dinamikler & Gerilimler',
      icon: Zap,
      isAvailable: availableLayers.hasBehavior,
    },
    {
      id: 'quality',
      labelTr: 'Ölçüm Güveni & Kalite',
      icon: ShieldCheck,
      isAvailable: true,
    },
    {
      id: 'sources',
      labelTr: 'Kaynaklar & Süreç',
      icon: FileText,
      isAvailable: true,
    },
  ];

  // Filter tabs: Show only available layers + always visible (Özet, Kalite, Kaynaklar)
  const visibleTabs = allTabs.filter((t) => t.isAvailable);

  return (
    <div className="bg-surface-1 p-2 rounded-2xl border border-border-subtle shadow-xs">
      <nav
        aria-label="Profil Katmanları"
        className="flex items-center space-x-1.5 overflow-x-auto scrollbar-thin py-1 px-1"
      >
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeLayer === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectLayer(tab.id)}
              className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-text-tertiary'}`} />
              <span>{tab.labelTr}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
