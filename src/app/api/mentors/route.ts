import { NextRequest, NextResponse } from 'next/server';
import { MENTORS } from '@/lib/data';

export async function POST(req: NextRequest) {
  const { careerIds = [], languages = [], profile = {} } = await req.json();
  
  let scored = MENTORS.map(mentor => {
    let score = 0;
    // Career match
    const careerMatch = mentor.careerIds.some(id => careerIds.includes(id));
    if (careerMatch) score += 50;
    // Language match
    const langMatch = mentor.languages.some(l => languages.includes(l));
    if (langMatch) score += 30;
    // Rating boost
    score += mentor.rating * 4;
    return { ...mentor, matchScore: Math.min(100, score) };
  });

  scored = scored.sort((a, b) => b.matchScore - a.matchScore);
  
  return NextResponse.json({ mentors: scored });
}
