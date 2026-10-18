import { NextRequest, NextResponse } from 'next/server';
import { AISHE_INSTITUTIONS, AISHE_METRICS } from '@/lib/data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get('state');
  const type = searchParams.get('type');
  const q = searchParams.get('q')?.toLowerCase() || '';

  let filtered = [...AISHE_INSTITUTIONS];

  if (state && state !== 'All') {
    filtered = filtered.filter(i => i.state.toLowerCase() === state.toLowerCase());
  }

  if (type && type !== 'All') {
    filtered = filtered.filter(i => i.type.toLowerCase().includes(type.toLowerCase()));
  }

  if (q) {
    filtered = filtered.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.district.toLowerCase().includes(q) ||
      i.state.toLowerCase().includes(q) ||
      i.aisheCode.toLowerCase().includes(q) ||
      i.coursesOffered.some(c => c.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({
    institutions: filtered,
    total: filtered.length,
    metrics: AISHE_METRICS,
  });
}
