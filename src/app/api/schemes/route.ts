import { NextRequest, NextResponse } from 'next/server';
import { SCHEMES } from '@/lib/data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const careerIds = searchParams.get('careerIds')?.split(',') || [];
  const query = searchParams.get('q')?.toLowerCase() || '';

  let filtered = [...SCHEMES];
  
  if (category && category !== 'all') {
    filtered = filtered.filter(s => s.category === category);
  }
  
  if (query) {
    filtered = filtered.filter(s => 
      s.name.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      s.tags.some(t => t.toLowerCase().includes(query))
    );
  }

  return NextResponse.json({ schemes: filtered, total: filtered.length });
}
