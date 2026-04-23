export const examPrompt = (
  wrongQuestions: number[],
  subject?: string,
  examName?: string,
) =>
  `Analyze this student's mock exam.
Exam: ${examName ?? "모의고사"}, Subject: ${subject ?? "수학"}
Wrong question numbers: ${wrongQuestions.join(", ")}
Group wrong questions by underlying topic weakness. Sort by severity: high first. All text Korean.
Return ONLY valid JSON:
{"estimatedScore":<0-100>,"weakPoints":[{"topic":"<Korean>","questionNums":[<n>],"severity":"high"|"medium"|"low","advice":"<Korean>"}],"summary":"<2-3 Korean sentences>"}`
