import { NextRequest, NextResponse } from 'next/server';
import { SCHEMES } from '@/lib/data';

// Open Interoperability API: For CSC Kiosks and Panchayat offices to query scheme eligibility
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { age, annualFamilyIncome, educationLevel, category } = body;

    let matched = [...SCHEMES];

    // Filter based on simple criteria
    if (annualFamilyIncome && Number(annualFamilyIncome) > 250000) {
      matched = matched.filter(s => s.id !== 'national-scholarship');
    }

    if (category) {
      const catLower = category.toLowerCase();
      matched = matched.filter(s => s.tags.some(t => t.toLowerCase().includes(catLower)) || s.category.toLowerCase().includes(catLower));
    }

    return NextResponse.json({
      status: 'success',
      query: { age, annualFamilyIncome, educationLevel, category },
      totalMatches: matched.length,
      schemes: matched.map(s => ({
        id: s.id,
        name: s.name,
        category: s.category,
        benefit: s.amount,
        portal: s.link,
        eligibilitySummary: s.eligibility,
      })),
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Invalid query payload' }, { status: 400 });
  }
}
