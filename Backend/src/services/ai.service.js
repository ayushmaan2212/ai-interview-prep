const Groq = require("groq-sdk");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
          ) 

      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `You are an expert technical interviewer. Generate a comprehensive interview report for a candidate applying for the following position.

CANDIDATE INFORMATION:
Resume: ${resume}

Self Description: ${selfDescription}

JOB DESCRIPTION AND REQUIREMENTS:
${jobDescription}

INSTRUCTIONS:
1. Analyze the candidate's profile against the job requirements
2. Generate 5-7 technical questions that would reveal the candidate's depth in required areas. Rate them on difficulty based on their experience level.
3. Generate 3-5 behavioral questions that assess soft skills, teamwork, and handling real-world scenarios mentioned in the job description.
4. Identify skill gaps between the candidate's current skills and job requirements. Mark severity based on job criticality.
5. Create a day-wise preparation plan (5-7 days) with specific focus areas and actionable tasks to bridge skill gaps.
6. Provide a match score (0-100) indicating how well the candidate fits the role.
7. Generate MINIMUM 7 technical questions that would reveal the candidate's depth in required areas.
8. Generate MINIMUM 5 behavioral questions that assess soft skills, teamwork, and handling real-world scenarios.
9. Create a EXACTLY 7-day preparation plan with specific focus areas and minimum 3 actionable tasks per day.


For technical and behavioral questions, include:
- The actual question to ask
- The intention behind asking it
- A comprehensive answer guide with key points to cover

Make sure the preparation plan is realistic, specific, and prioritizes high-severity skill gaps.

Respond with valid JSON matching this schema exactly:
${JSON.stringify(zodToJsonSchema(interviewReportSchema), null, 2)}`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
    role: "system",
    content: `You are an expert technical interviewer. Always respond with valid JSON only. No markdown, no backticks, no explanation.

CRITICAL: You MUST use these EXACT field names, no variations:
- "matchScore" (number 0-100)
- "title" (string)
- "technicalQuestions" (array) - each item MUST have "question", "intention", "answer" as strings
- "behavioralQuestions" (array) - each item MUST have "question", "intention", "answer" as strings  
- "skillsGap" (array) - each item MUST have "skill" (string) and "severity" (must be exactly "low", "medium", or "high")
- "preparationPlan" (array) - each item MUST have "day" (number), "focus" (string), "tasks" (array of strings)

DO NOT use: skillGaps, skillGap, focusArea, actionableTasks, answerGuide, keyPoints, or any other field names.
DO NOT nest answers inside objects. "answer" must be a plain string.
DO NOT use numbers for severity. Only use "low", "medium", or "high".`
},
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content);


const severityMap = (val) => {
    if (typeof val === 'number') {
        if (val >= 7) return 'high';
        if (val >= 4) return 'medium';
        return 'low';
    }
    return val?.toLowerCase() || 'low';
};

// normalize skillsGap
if (result.skillGaps && !result.skillsGap) {
    result.skillsGap = result.skillGaps;
    delete result.skillGaps;
}
if (result.skillsGap && !Array.isArray(result.skillsGap)) {
    result.skillsGap = Object.values(result.skillsGap);
}
result.skillsGap = result.skillsGap?.map(item => ({
    skill: item.skill,
    severity: severityMap(item.severity)
}));

// normalize preparationPlan
if (result.preparationPlan && !Array.isArray(result.preparationPlan)) {
    result.preparationPlan = Object.values(result.preparationPlan);
}
if (result.preparationPlan) {
    result.preparationPlan = result.preparationPlan.map(item => ({
        day: item.day,
        focus: item.focus || item.focusArea,
        tasks: item.tasks || item.actionableTasks
    }));
}

// normalize questions
const normalizeQuestions = (arr) => {
    if (!Array.isArray(arr)) arr = Object.values(arr || {});
    return arr.map(q => ({
        question: q.question,
        intention: q.intention,
        answer: q.answer || q.answerGuide?.answer || q.answerGuide?.keyPoints?.join(', ') || q.answerGuide?.overview || JSON.stringify(q.answerGuide) || ''
    }));
};

result.technicalQuestions = normalizeQuestions(result.technicalQuestions);
result.behavioralQuestions = normalizeQuestions(result.behavioralQuestions);

  return result;
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, jobDescription, selfDescription }) {
    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `;

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: "You are an expert resume builder. Always respond with valid JSON only. No markdown, no backticks, no explanation. Return only {\"html\": \"<your html here>\"}"
            },
            {
                role: "user",
                content: prompt
            }
        ],
        response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    const pdfBuffer = await generatePdfFromHtml(result.html)

    return pdfBuffer;
}

module.exports = {generateInterviewReport, generateResumePdf};
