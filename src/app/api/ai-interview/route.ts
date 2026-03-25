import { NextResponse } from 'next/server';

const QUESTION_BANK: Record<string, string[]> = {
  frontend: [
    "Explain React Server Components vs Client Components and when you'd use each.",
    "How do you debug a performance regression in a large React app at scale?",
    "Walk through how you'd architect a design token system for a multi-brand enterprise product.",
    "Describe your approach to handling optimistic UI updates with concurrent data mutations."
  ],
  backend: [
    "How do you design an idempotent payment processing service?",
    "Explain the tradeoffs between eventual consistency and strong consistency in distributed systems.",
    "What is the N+1 problem and how do you resolve it without sacrificing readability in an ORM?",
    "How would you design a rate-limiting service that works across multiple instances?"
  ],
  data: [
    "Explain the difference between L1 and L2 regularisation and when to use each.",
    "Walk me through your approach to handling class imbalance in a fraud detection model.",
    "How do you evaluate model drift in production and what triggers a retraining cycle?",
    "Describe your experience fine-tuning an LLM for a domain-specific task."
  ],
  default: [
    "Describe a critical production incident you resolved and what systemic changes it led to.",
    "How do you balance technical debt management alongside feature development timelines?",
    "Tell me about your most technically challenging project and the specific trade-offs you made.",
    "How do you approach mentoring junior engineers in a high-velocity startup environment?"
  ]
};

function getCategoryKey(role: string = ''): string {
  const r = role.toLowerCase();
  if (r.includes('frontend') || r.includes('react') || r.includes('ui')) return 'frontend';
  if (r.includes('backend') || r.includes('node') || r.includes('java') || r.includes('python')) return 'backend';
  if (r.includes('data') || r.includes('ml') || r.includes('ai') || r.includes('science')) return 'data';
  return 'default';
}

function scoreAnswer(answer: string = '') {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const hasTechnicalTerms = /\b(api|component|async|database|schema|algorithm|pattern|service|cache|queue|deploy|scale|optimize|latency|throughput|architecture|interface|module|function|class|object|method|variable|config|index|query|migration)\b/i.test(answer);
  const hasStructure = answer.includes(',') || answer.includes(':') || /\d\./.test(answer) || /\bfirst\b|\bsecond\b|\bfinally\b|\bmoreover\b/i.test(answer);
  const hasIndianEnglishPattern = /\bkinly\b|\bdo the needful\b|\bI have\b|\bwe did\b|\bproject\b/i.test(answer);

  // Multi-dimensional scoring (40/20/20/20)
  const technicalAccuracy = Math.min(100, 30 + (hasTechnicalTerms ? 35 : 0) + Math.min(35, wordCount * 0.8));
  const communicationClarity = Math.min(100, 30 + (hasStructure ? 30 : 0) + Math.min(40, wordCount * 0.6));
  const culturalFit = Math.min(100, 60 + (wordCount > 20 ? 20 : 0) + (hasIndianEnglishPattern ? 10 : 5));
  const jdRelevance = Math.min(100, 40 + (hasTechnicalTerms ? 30 : 0) + Math.min(30, wordCount * 0.5));

  const overall = Math.round(technicalAccuracy * 0.4 + communicationClarity * 0.2 + culturalFit * 0.2 + jdRelevance * 0.2);

  const sentiment = overall >= 75 ? 'positive' : overall >= 55 ? 'neutral' : 'negative';

  const reasoning: Record<string, string> = {
    technicalAccuracy: hasTechnicalTerms && wordCount > 30
      ? 'Answer demonstrates domain-specific technical vocabulary with sufficient depth.'
      : wordCount > 15
      ? 'Adequate technical content but lacks specific implementation details.'
      : 'Response too brief to assess technical depth. Encourage elaboration.',
    communicationClarity: hasStructure && wordCount > 25
      ? 'Well-structured response with clear thought progression — good for cross-functional teams.'
      : 'Answer could benefit from more structured sequencing (e.g. first/second/finally format).',
    culturalFit: wordCount > 20
      ? 'Demonstrates collaborative framing consistent with Indian enterprise culture norms.'
      : 'Limited context provided to assess team and culture alignment.',
    jdRelevance: hasTechnicalTerms
      ? 'Response maps well to core technical requirements of the role.'
      : 'Answer does not explicitly connect experience to the JD requirements.'
  };

  return { technicalAccuracy: Math.round(technicalAccuracy), communicationClarity: Math.round(communicationClarity), culturalFit: Math.round(culturalFit), jdRelevance: Math.round(jdRelevance), overall, sentiment, reasoning };
}

export async function POST(req: Request) {
  const { role, answer, jdContext } = await req.json();

  await new Promise(r => setTimeout(r, 700));

  const key = getCategoryKey(role);
  const questions = QUESTION_BANK[key];
  const nextQuestion = questions[Math.floor(Math.random() * questions.length)];

  const matrix = scoreAnswer(answer);

  return NextResponse.json({ nextQuestion, matrix });
}
