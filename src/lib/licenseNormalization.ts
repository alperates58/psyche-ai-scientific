/**
 * License Normalization Helpers (FAZ 2.7C)
 * 
 * Safely normalizes heterogeneous license decision strings from instruments
 * and item versions into canonical legal clearance states without mutating
 * underlying legacy storage or inferring legal rights.
 */

export type NormalizedLicenseDecision =
  | 'APPROVED_PUBLIC'
  | 'REQUIRES_LICENSE'
  | 'REJECTED_PROPRIETARY'
  | 'UNKNOWN';

export type NormalizedItemLicenseStatus =
  | 'APPROVED_PUBLIC'
  | 'REQUIRES_LICENSE'
  | 'REJECTED_PROPRIETARY'
  | 'UNKNOWN';

/**
 * Normalizes Instrument institutional copyright clearance decisions.
 */
export function normalizeInstrumentLicensingDecision(raw?: string | null): NormalizedLicenseDecision {
  if (!raw || typeof raw !== 'string' || raw.trim() === '') {
    return 'UNKNOWN';
  }

  const val = raw.trim().toUpperCase();

  if (val === 'APPROVED' || val === 'APPROVED_PUBLIC' || val === 'PUBLIC_DOMAIN' || val === 'OPEN_ACCESS') {
    return 'APPROVED_PUBLIC';
  }
  if (val === 'RESTRICTED' || val === 'REQUIRES_LICENSE' || val === 'ACADEMIC_FREE_ONLY' || val === 'COMMERCIAL_LICENSE_REQUIRED') {
    return 'REQUIRES_LICENSE';
  }
  if (val === 'REJECTED' || val === 'REJECTED_PROPRIETARY' || val === 'PROPRIETARY_BLOCKED') {
    return 'REJECTED_PROPRIETARY';
  }

  return 'UNKNOWN';
}

/**
 * Normalizes ItemVersion wording copyright provenance.
 */
export function normalizeItemLicenseStatus(raw?: string | null): NormalizedItemLicenseStatus {
  if (!raw || typeof raw !== 'string' || raw.trim() === '') {
    return 'UNKNOWN';
  }

  const val = raw.trim().toUpperCase();

  if (
    val === 'APPROVED' ||
    val === 'APPROVED_PUBLIC' ||
    val === 'ORIGINAL_WORDING_UNRESTRICTED' ||
    val === 'PUBLIC_DOMAIN'
  ) {
    return 'APPROVED_PUBLIC';
  }
  if (val === 'RESTRICTED' || val === 'REQUIRES_LICENSE') {
    return 'REQUIRES_LICENSE';
  }
  if (val === 'REJECTED' || val === 'REJECTED_PROPRIETARY' || val === 'BLOCKED') {
    return 'REJECTED_PROPRIETARY';
  }

  return 'UNKNOWN';
}

export interface LicenseDisplayMetadata {
  labelTr: string;
  labelEn: string;
  badgeVariant: 'success' | 'warning' | 'error' | 'neutral';
  descriptionTr: string;
}

export const LICENSE_DISPLAY_MAP: Record<NormalizedLicenseDecision, LicenseDisplayMetadata> = {
  APPROVED_PUBLIC: {
    labelTr: 'Kamuya Açık / Onaylandı',
    labelEn: 'Public Domain / Approved',
    badgeVariant: 'success',
    descriptionTr: 'Kamu malı veya telifsiz serbest araştırma/üretim kullanımına uygundur.',
  },
  REQUIRES_LICENSE: {
    labelTr: 'Lisans İzni Gereklidir',
    labelEn: 'Commercial License Required',
    badgeVariant: 'warning',
    descriptionTr: 'Akademik kullanım serbest; dijital/ticari kullanım için telif sahibinden yazılı izin gereklidir.',
  },
  REJECTED_PROPRIETARY: {
    labelTr: 'Yasaklı / Reddedildi',
    labelEn: 'Proprietary / Rejected',
    badgeVariant: 'error',
    descriptionTr: 'Telif hakları kısıtlıdır. Canlı değerlendirme formlarına dahil edilmesi yasaklanmıştır.',
  },
  UNKNOWN: {
    labelTr: 'Değerlendirilmedi / Bilinmiyor',
    labelEn: 'Unassessed / Unknown',
    badgeVariant: 'neutral',
    descriptionTr: 'Hukuki telif ve uyarlama durumu henüz teyit edilmemiştir.',
  },
};
