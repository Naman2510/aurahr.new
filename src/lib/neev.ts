import OpenAI from 'openai';

if (!process.env.NEEV_API_KEY) {
  console.warn("NEEV_API_KEY is missing. AI features will fallback to mock mode.");
}

export const neev = new OpenAI({
  apiKey: process.env.NEEV_API_KEY || 'mock-key',
  baseURL: process.env.NEEV_BASE_URL || 'https://inference.ai.neevcloud.com/v1',
});

export const MODEL = 'gpt-oss-120b';

/**
 * Helper to get structured JSON from GPT-OSS 120B
 */
export async function getStructuredAIResponse<T>(prompt: string, systemPrompt: string = "View as an expert HR analyst."): Promise<T | null> {
  try {
    const response = await neev.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: `${systemPrompt} Return ONLY valid JSON.` },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    return content ? JSON.parse(content) as T : null;
  } catch (error) {
    console.error("AI Response Error:", error);
    return null;
  }
}
