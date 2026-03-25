import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { crossReferenceSchema } from '@/app/api/parse-jd/route';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const jdId = searchParams.get('jdId');

  const db = await getDb();
  const jd = db.jobDescriptions?.find((j: any) => j.id === jdId) || db.jobDescriptions?.[0];

  if (!jd) {
    return NextResponse.json({ error: 'No job description found' }, { status: 404 });
  }

  const ranked = db.candidates.map((c: any) => {
    const xref = crossReferenceSchema(
      c.matchTags || [],
      { mustHave: jd.mustHave || [], niceToHave: jd.niceToHave || [] }
    );

    return {
      id: c.id,
      name: c.name,
      role: c.role,
      status: c.status,
      phone: c.phone,
      institute: c.institute,
      aiInterviewScore: c.aiInterviewScore,
      salaryExpectation: c.salaryExpectation,
      matchPct: Math.min(99, xref.overall_match_score),
      matchedSkills: xref.must_haves_met,
      missingSkills: xref.must_haves_missing,   // true must-have gaps only
      must_haves_met: xref.must_haves_met,
      must_haves_missing: xref.must_haves_missing,
      nice_to_haves_met: xref.nice_to_haves_met,
      source: c.source
    };
  }).sort((a: any, b: any) => b.matchPct - a.matchPct);

  return NextResponse.json({ jd, ranked });
}
