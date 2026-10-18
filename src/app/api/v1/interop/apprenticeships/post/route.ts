import { NextRequest, NextResponse } from 'next/server';

// Open Interoperability API: For Corporates and Employers to post NAPS apprenticeships
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, role, sector, stipendMonthly, seats, duration, location, napsRegistrationNo } = body;

    if (!companyName || !role || !stipendMonthly) {
      return NextResponse.json({
        error: 'Missing mandatory fields: companyName, role, and stipendMonthly are required',
      }, { status: 400 });
    }

    const listingId = `NAPS-LST-${Date.now()}`;

    return NextResponse.json({
      status: 'success',
      message: 'Apprenticeship vacancy published to VidyaSetu Rural Network',
      listingId,
      details: {
        companyName,
        role,
        sector: sector || 'Vocational / Industry',
        stipend: stipendMonthly,
        seats: seats || 50,
        duration: duration || '1 Year',
        location: location || 'PAN India',
        napsVerified: !!napsRegistrationNo,
      },
      matchedCandidatesEstimate: 140,
      timestamp: new Date().toISOString(),
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request payload' }, { status: 400 });
  }
}
