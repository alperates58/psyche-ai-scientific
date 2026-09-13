import { NextRequest, NextResponse } from 'next/server';
import { getExpertReviewRows, generateExpertReviewCsv } from '@/services/expertReviewExport';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const format = searchParams.get('format') || 'csv';

  const rows = getExpertReviewRows();

  if (format === 'json') {
    return NextResponse.json(rows, {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename="psyche-ai-master-item-bank-expert-review.json"',
        'Content-Type': 'application/json'
      }
    });
  }

  const csvContent = generateExpertReviewCsv(rows);

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="psyche-ai-master-item-bank-expert-review.csv"'
    }
  });
}
