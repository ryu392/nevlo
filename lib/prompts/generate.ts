export const generatePrompt = (problemText: string, ideas: string[]) =>
  `Korean math tutor making a spaced-repetition flashcard.
Problem: ${problemText}
Student's missed ideas: ${ideas.length ? ideas.join(", ") : "None."}
Write a 4-6 step solution in Korean. Use $...$ for inline LaTeX and $$...$$ for display LaTeX in step text.
Give every step a short Korean label (2-5 chars) describing the technique, e.g. "점화식 변환", "치환". Mark 1-2 steps as isKey:true — these are the non-obvious insight steps.
Return ONLY valid JSON:
{"steps":[{"text":"<Korean with LaTeX>","label":"<label>","isKey":false},{"text":"<Korean with LaTeX>","label":"<label>","isKey":true}],"difficulty":"쉬움"|"보통"|"어려움"}`
