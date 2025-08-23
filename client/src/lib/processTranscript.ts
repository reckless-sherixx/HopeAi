// lib/processTranscript.ts
import Groq from "groq-sdk";

// Use NEXT_PUBLIC_ var (⚠️ exposed on frontend!)
const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY!,
  dangerouslyAllowBrowser: true,
});

// 🧹 Clean & sanitize transcript
function cleanTranscript(transcript: string[]): string[] {
  return transcript
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

// 📝 Analysis schema definition
const analysisPrompt = `
You are an AI specialized in analyzing autism screening conversations.

The input will be a transcript (array of messages).
Your task is to provide a JSON response with this exact structure:

{
  "summary": string,
  "possible_indicators": string[],
  "recommendation": string,
  "advice_for_caregivers": string
}

⚠️ Respond ONLY in JSON. Do not include explanations, markdown, or extra text.
`;

export async function processTranscript(transcript: string[]) {
  const cleaned = cleanTranscript(transcript);

  if (cleaned.length === 0) {
    throw new Error("Transcript is empty after cleaning.");
  }

  const messages = [
    { role: "system", content: analysisPrompt },
    { role: "user", content: `Transcript:\n${JSON.stringify(cleaned, null, 2)}` },
  ];

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    temperature: 0.2,
    max_tokens: 500,
  });

  let analysisText = response.choices[0]?.message?.content || "{}";

  // Try parsing JSON safely
  let analysis: any;
  try {
    analysis = JSON.parse(analysisText);
  } catch {
    const fixed = analysisText.replace(/```json|```/g, "").trim();
    analysis = JSON.parse(fixed);
  }

  // Instead of writing to file (not possible in browser),
  // save to localStorage for hackathon demo
  localStorage.setItem("analysis-data", JSON.stringify(analysis));

  return analysis;
}
