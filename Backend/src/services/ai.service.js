const Groq = require("groq-sdk");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const PDFDocument = require("pdfkit");

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
DO NOT use numbers for severity. Only use "low", "medium", or "high".`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content);

  const severityMap = (val) => {
    if (typeof val === "number") {
      if (val >= 7) return "high";
      if (val >= 4) return "medium";
      return "low";
    }
    return val?.toLowerCase() || "low";
  };

  // normalize skillsGap
  if (result.skillGaps && !result.skillsGap) {
    result.skillsGap = result.skillGaps;
    delete result.skillGaps;
  }
  if (result.skillsGap && !Array.isArray(result.skillsGap)) {
    result.skillsGap = Object.values(result.skillsGap);
  }
  result.skillsGap = result.skillsGap?.map((item) => ({
    skill: item.skill,
    severity: severityMap(item.severity),
  }));

  // normalize preparationPlan
  if (result.preparationPlan && !Array.isArray(result.preparationPlan)) {
    result.preparationPlan = Object.values(result.preparationPlan);
  }
  if (result.preparationPlan) {
    result.preparationPlan = result.preparationPlan.map((item) => ({
      day: item.day,
      focus: item.focus || item.focusArea,
      tasks: item.tasks || item.actionableTasks,
    }));
  }

  // normalize questions
  const normalizeQuestions = (arr) => {
    if (!Array.isArray(arr)) arr = Object.values(arr || {});
    return arr.map((q) => ({
      question: q.question,
      intention: q.intention,
      answer:
        q.answer ||
        q.answerGuide?.answer ||
        q.answerGuide?.keyPoints?.join(", ") ||
        q.answerGuide?.overview ||
        JSON.stringify(q.answerGuide) ||
        "",
    }));
  };

  result.technicalQuestions = normalizeQuestions(result.technicalQuestions);
  result.behavioralQuestions = normalizeQuestions(result.behavioralQuestions);

  return result;
}

/**
 * Helper: build a PDF from structured resume data using pdfkit (no browser needed)
 */
function buildResumePdf(resumeData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      const colors = {
        primary: "#1a365d",
        secondary: "#2d3748",
        accent: "#3182ce",
        text: "#2d3748",
        lightText: "#718096",
        line: "#cbd5e0",
      };

      // --- Header / Name ---
      doc
        .fontSize(24)
        .fillColor(colors.primary)
        .font("Helvetica-Bold")
        .text(resumeData.name || "Candidate", { align: "center" });

      if (resumeData.contact) {
        const contactParts = [
          resumeData.contact.email,
          resumeData.contact.phone,
          resumeData.contact.location,
          resumeData.contact.linkedin,
        ].filter(Boolean);
        doc
          .fontSize(9)
          .fillColor(colors.lightText)
          .font("Helvetica")
          .text(contactParts.join("  |  "), { align: "center" });
      }

      doc.moveDown(0.5);
      doc
        .strokeColor(colors.accent)
        .lineWidth(2)
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .stroke();
      doc.moveDown(0.8);

      // --- Helper: section heading ---
      const sectionHeading = (title) => {
        doc
          .fontSize(13)
          .fillColor(colors.primary)
          .font("Helvetica-Bold")
          .text(title.toUpperCase());
        doc.moveDown(0.15);
        doc
          .strokeColor(colors.line)
          .lineWidth(0.5)
          .moveTo(50, doc.y)
          .lineTo(545, doc.y)
          .stroke();
        doc.moveDown(0.4);
      };

      // --- Professional Summary ---
      if (resumeData.summary) {
        sectionHeading("Professional Summary");
        doc
          .fontSize(10)
          .fillColor(colors.text)
          .font("Helvetica")
          .text(resumeData.summary, { lineGap: 2 });
        doc.moveDown(0.8);
      }

      // --- Skills ---
      if (resumeData.skills && resumeData.skills.length > 0) {
        sectionHeading("Skills");
        doc
          .fontSize(10)
          .fillColor(colors.text)
          .font("Helvetica")
          .text(resumeData.skills.join("  •  "), { lineGap: 2 });
        doc.moveDown(0.8);
      }

      // --- Experience ---
      if (resumeData.experience && resumeData.experience.length > 0) {
        sectionHeading("Experience");
        resumeData.experience.forEach((exp) => {
          doc
            .fontSize(11)
            .fillColor(colors.secondary)
            .font("Helvetica-Bold")
            .text(exp.title || exp.role || "Role", { continued: true })
            .font("Helvetica")
            .fillColor(colors.lightText)
            .text(
              `  —  ${exp.company || ""}   ${exp.duration || exp.dates || ""}`,
              { lineGap: 1 },
            );

          if (exp.highlights && exp.highlights.length > 0) {
            exp.highlights.forEach((h) => {
              doc
                .fontSize(10)
                .fillColor(colors.text)
                .font("Helvetica")
                .text(`• ${h}`, { indent: 15, lineGap: 1 });
            });
          } else if (exp.description) {
            doc
              .fontSize(10)
              .fillColor(colors.text)
              .font("Helvetica")
              .text(exp.description, { indent: 15, lineGap: 1 });
          }
          doc.moveDown(0.5);
        });
        doc.moveDown(0.3);
      }

      // --- Education ---
      if (resumeData.education && resumeData.education.length > 0) {
        sectionHeading("Education");
        resumeData.education.forEach((edu) => {
          doc
            .fontSize(11)
            .fillColor(colors.secondary)
            .font("Helvetica-Bold")
            .text(edu.degree || edu.title || "Degree", { continued: true })
            .font("Helvetica")
            .fillColor(colors.lightText)
            .text(
              `  —  ${edu.institution || edu.school || ""}   ${edu.year || edu.dates || ""}`,
              { lineGap: 1 },
            );
          if (edu.details) {
            doc
              .fontSize(10)
              .fillColor(colors.text)
              .font("Helvetica")
              .text(edu.details, { indent: 15, lineGap: 1 });
          }
          doc.moveDown(0.3);
        });
        doc.moveDown(0.3);
      }

      // --- Projects ---
      if (resumeData.projects && resumeData.projects.length > 0) {
        sectionHeading("Projects");
        resumeData.projects.forEach((proj) => {
          doc
            .fontSize(11)
            .fillColor(colors.secondary)
            .font("Helvetica-Bold")
            .text(proj.name || proj.title || "Project");
          if (proj.description) {
            doc
              .fontSize(10)
              .fillColor(colors.text)
              .font("Helvetica")
              .text(proj.description, { indent: 15, lineGap: 1 });
          }
          if (proj.technologies) {
            doc
              .fontSize(9)
              .fillColor(colors.accent)
              .font("Helvetica-Oblique")
              .text(
                `Technologies: ${Array.isArray(proj.technologies) ? proj.technologies.join(", ") : proj.technologies}`,
                { indent: 15 },
              );
          }
          doc.moveDown(0.4);
        });
        doc.moveDown(0.3);
      }

      // --- Certifications ---
      if (resumeData.certifications && resumeData.certifications.length > 0) {
        sectionHeading("Certifications");
        resumeData.certifications.forEach((cert) => {
          const certText =
            typeof cert === "string" ? cert : cert.name || cert.title || "";
          doc
            .fontSize(10)
            .fillColor(colors.text)
            .font("Helvetica")
            .text(`• ${certText}`, { indent: 15, lineGap: 1 });
        });
        doc.moveDown(0.3);
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

async function generateResumePdf({ resume, jobDescription, selfDescription }) {
  const prompt = `Generate a structured resume JSON for a candidate with the following details:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Return a JSON object with these fields:
{
  "name": "Full Name",
  "contact": {
    "email": "email@example.com",
    "phone": "+1-XXX-XXX-XXXX",
    "location": "City, State",
    "linkedin": "linkedin.com/in/username"
  },
  "summary": "Professional summary paragraph",
  "skills": ["Skill1", "Skill2", "Skill3"],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Jan 2023 - Present",
      "highlights": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "University Name",
      "year": "2020-2024"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief description",
      "technologies": ["Tech1", "Tech2"]
    }
  ],
  "certifications": ["Cert 1", "Cert 2"]
}

The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience.
The content should NOT sound AI-generated. Keep it concise (1-2 pages worth of content) and ATS-friendly.
Fill in real data from the provided resume and self description. Only include sections that have relevant data.`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are an expert resume builder. Always respond with valid JSON only. No markdown, no backticks, no explanation.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content);
  const pdfBuffer = await buildResumePdf(result);

  return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };
