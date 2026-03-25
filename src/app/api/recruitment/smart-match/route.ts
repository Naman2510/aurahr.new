import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { jdId } = await req.json();

    const jd = await prisma.jobDescription.findUnique({
      where: { id: jdId }
    });

    if (!jd) throw new Error("JD not found.");

    const candidates = await prisma.candidate.findMany();

    const scoredCandidates = candidates.map(c => {
      let score = 0;
      const reasons: string[] = [];

      // A. Must-Have Match (Weight: 50%)
      const mustHaveCount = jd.mustHave.filter(skill => 
        c.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      ).length;
      const mustHaveScore = (mustHaveCount / jd.mustHave.length) * 50;
      score += mustHaveScore;

      // B. Good-to-Have Match (Weight: 20%)
      const goodToHaveCount = jd.goodToHave.filter(skill => 
        c.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      ).length;
      const goodToHaveScore = (goodToHaveCount / jd.goodToHave.length) * 20;
      score += goodToHaveScore;

      // C. Team Gap Bonus (Weight: 15%)
      const teamGapCount = jd.teamGap.filter(skill => 
        c.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      ).length;
      if (teamGapCount > 0) {
        score += 15;
        reasons.push("Fills a critical Team Gap.");
      }

      // D. Future-Proof Bonus (Weight: 15%)
      const futureProofCount = jd.futureProof.filter(skill => 
        c.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      ).length;
      if (futureProofCount > 0) {
        score += 15;
        reasons.push("High Market Alignment / Future-Proof Skills.");
      }

      return { 
        ...c, 
        matchScore: Math.round(score),
        matchReason: reasons.join(' ')
      };
    });

    const ranked = scoredCandidates.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    return NextResponse.json(ranked);

  } catch (error: any) {
    console.error("Smart Match Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
