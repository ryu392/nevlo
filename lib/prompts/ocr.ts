export const ocrPrompt = () => `Extract ALL math/science problems visible in this worksheet image.
Use $...$ for inline LaTeX math and $$...$$ for display math (e.g. $\\frac{a}{b}$, $\\lim_{x\\to0}$, $\\sum_{i=1}^{n}$).
Each distinct numbered or separated question is one problem. If only one problem exists, return a single-item array.
Return ONLY a valid JSON array, no markdown, no explanation:
[{"problemNumber":<number or null>,"problemText":"<full text with LaTeX>","confidence":"high"|"medium"|"low"}]`
