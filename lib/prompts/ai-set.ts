export const aiSetPrompt = (
  subject: string,
  topic: string,
  difficulty: string,
  count: number,
) =>
  `Korean tutor creating a spaced-repetition study set.
Subject: ${subject}, Topic: ${topic}, Difficulty: ${difficulty}
Generate exactly ${count} distinct Korean practice problems. Use $...$ for inline LaTeX and $$...$$ for display LaTeX.
Each: 4-5 step Korean solution with LaTeX, 1-2 key steps (isKey:true) with short Korean keyLabel (2-5 chars).
Return ONLY valid JSON:
{"cards":[{"problemText":"<Korean+LaTeX>","steps":[{"text":"<Korean+LaTeX>","isKey":false},{"text":"<Korean+LaTeX>","isKey":true,"keyLabel":"<label>"}],"difficulty":"쉬움"|"보통"|"어려움"}]}`
