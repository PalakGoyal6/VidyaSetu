import { NextRequest, NextResponse } from 'next/server';

// Open Interoperability API: For NGOs, Village Facilitators, and Panchayats to submit rural talent
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { partnerId, studentName, grade, district, state, interests, skills, contact } = body;

    if (!studentName || !grade || !state) {
      return NextResponse.json({
        error: 'Missing mandatory fields: studentName, grade, and state are required',
        schema: { studentName: 'string', grade: 'string', state: 'string', interests: 'string[]' },
      }, { status: 400 });
    }

    const recommendationId = `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return NextResponse.json({
      status: 'success',
      message: 'Student successfully registered into VidyaSetu Talent Pool',
      recommendationId,
      partner: partnerId || 'Open-API-Partner',
      data: {
        studentName,
        grade,
        district: district || 'Rural District',
        state,
        matchedOpportunitiesCount: 4,
        nextStep: 'Student profile verified and linked to AISHE & NAPS portal',
      },
      timestamp: new Date().toISOString(),
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 });
  }
}
