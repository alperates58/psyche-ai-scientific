import fs from 'fs';
import path from 'path';

export interface ExpertReviewExportRow {
  facetId: string;
  facetNameTr: string;
  facetNameEn: string;
  operationalDefinitionTr: string;
  itemId: string;
  itemType: string;
  promptTr: string;
  promptEn: string;
  keying: string;
  measurementIntent: string;
  sourceReference: string;
  licenseStatus: string;
  potentialCrossLoadings: string;
  reviewerDecision: string; // Blank template for expert: e.g. "APPROVED" | "REVISE" | "REJECT"
  reviewerComments: string;  // Blank template for expert notes
}

/**
 * Generates the expert review export dataset from the master item bank and evidence map.
 */
export function getExpertReviewRows(): ExpertReviewExportRow[] {
  const masterBankPath = path.resolve(process.cwd(), 'data/master-item-bank.json');
  const evidenceMapPath = path.resolve(process.cwd(), 'research/facet-evidence-map.json');

  if (!fs.existsSync(masterBankPath) || !fs.existsSync(evidenceMapPath)) {
    return [];
  }

  const items = JSON.parse(fs.readFileSync(masterBankPath, 'utf8'));
  const evidenceMap = JSON.parse(fs.readFileSync(evidenceMapPath, 'utf8'));

  const evidenceLookup = new Map<string, any>();
  for (const ev of evidenceMap) {
    evidenceLookup.set(ev.facetId, ev);
  }

  return items.map((it: any) => {
    const ev = evidenceLookup.get(it.facetId) || {};
    return {
      facetId: it.facetId,
      facetNameTr: ev.name_tr || it.facetId,
      facetNameEn: ev.name_en || it.facetId,
      operationalDefinitionTr: ev.operationalDefinition_tr || '',
      itemId: it.id,
      itemType: it.itemType,
      promptTr: it.text_tr,
      promptEn: it.text_en || '',
      keying: it.keying,
      measurementIntent: it.measurementPurpose || 'trait_level',
      sourceReference: (it.sourceIds || []).join(', ') || it.sourceType,
      licenseStatus: it.licenseStatus,
      potentialCrossLoadings: (it.possibleCrossLoadings || []).join(', ') || 'None',
      reviewerDecision: '', // For expert filling
      reviewerComments: ''   // For expert filling
    };
  });
}

/**
 * Formats rows as CSV string with UTF-8 BOM for Excel compatibility.
 */
export function generateExpertReviewCsv(rows: ExpertReviewExportRow[]): string {
  const headers = [
    'Facet ID',
    'Facet (TR)',
    'Facet (EN)',
    'Operasyonel Tanim (TR)',
    'Madde ID',
    'Madde Turu',
    'Madde Metni (TR)',
    'Madde Metni (EN)',
    'Yon (Keying)',
    'Olcum Amaci',
    'Bilimsel Kaynak',
    'Lisans Durumu',
    'Olası Capraz Yuklenmeler',
    'Uzman Karari (ONAY / REVIZYON / RET)',
    'Uzman Notu ve Onerisi'
  ];

  const escapeCsv = (val: string) => `"${(val || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;

  const lines = [
    headers.map(h => `"${h}"`).join(',')
  ];

  for (const r of rows) {
    lines.push([
      escapeCsv(r.facetId),
      escapeCsv(r.facetNameTr),
      escapeCsv(r.facetNameEn),
      escapeCsv(r.operationalDefinitionTr),
      escapeCsv(r.itemId),
      escapeCsv(r.itemType),
      escapeCsv(r.promptTr),
      escapeCsv(r.promptEn),
      escapeCsv(r.keying),
      escapeCsv(r.measurementIntent),
      escapeCsv(r.sourceReference),
      escapeCsv(r.licenseStatus),
      escapeCsv(r.potentialCrossLoadings),
      escapeCsv(r.reviewerDecision),
      escapeCsv(r.reviewerComments)
    ].join(','));
  }

  // Prepend UTF-8 BOM so Excel opens Turkish characters correctly
  return '\uFEFF' + lines.join('\r\n');
}
