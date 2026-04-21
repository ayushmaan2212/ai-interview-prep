const pdfParse = require("pdf-parse");
const interviewReportModel = require("../models/interviewReport.model");
const {generateInterviewReport,generateResumePdf } = require("../services/ai.service");


/**
 * @description Generate an interview report for a candidate based on their resume, self description and job description
 */
async function generateInterviewReportController(req, res) {
  try {
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { selfDescription, jobDescription } = req.body;

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
    });

    // Validate that AI returned populated arrays
    if (
      !interviewReportByAi.technicalQuestions ||
      interviewReportByAi.technicalQuestions.length === 0
    ) {
      return res.status(400).json({
        error: "AI failed to generate technical questions. Please try again.",
        details: "Technical questions array is empty",
      });
    }
    if (
      !interviewReportByAi.behavioralQuestions ||
      interviewReportByAi.behavioralQuestions.length === 0
    ) {
      return res.status(400).json({
        error: "AI failed to generate behavioral questions. Please try again.",
        details: "Behavioral questions array is empty",
      });
    }
    if (
      !interviewReportByAi.skillsGap ||
      interviewReportByAi.skillsGap.length === 0
    ) {
      return res.status(400).json({
        error: "AI failed to identify skill gaps. Please try again.",
        details: "Skill gaps array is empty",
      });
    }
    if (
      !interviewReportByAi.preparationPlan ||
      interviewReportByAi.preparationPlan.length === 0
    ) {
      return res.status(400).json({
        error: "AI failed to generate preparation plan. Please try again.",
        details: "Preparation plan array is empty",
      });
    }

    const interviewReport = new interviewReportModel({
      user: req.user._id,
      resume: resumeContent.text,
      selfDescription,
      jobDescription:
        typeof jobDescription === "string"
          ? jobDescription
          : JSON.stringify(jobDescription),
      ...interviewReportByAi,
    });

    await interviewReport.save();

    res.status(200).json({
      message: "Interview report generated successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("Error generating interview report:", error);
    res.status(500).json({
      error: "Failed to generate interview report",
      details: error.message,
    });
  }
}

/**
 * @description Get a specific interview report by its ID
 */
async function getInterviewReportByIdController(req, res) {
  const { reportId } = req.params;

  const interviewReport = await interviewReportModel.findOne({
    _id: reportId,
    user: req.user._id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      error: "Interview report not found",
    });
  }

  return res.status(200).json({
    message: "Interview report fetched successfully",
    interviewReport,
  });
}

/**
 * @description Get all interview reports of the authenticated user
 */
async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel.find({
    user: req.user._id,
  }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v"); 

  return res.status(200).json({
    message: "Interview reports fetched successfully",
    interviewReports,
  });
}

/**
 * @description controller to generate a PDF based on resume , self description and job description
 */
async function generateResumePdfController(req, res) {
  const {interviewReportId} = req.params;

  const interviewReport = await interviewReportModel.findById(interviewReportId);
  if (!interviewReport) {
    return res.status(404).json({
      error: "Interview report not found",
    });
  }

  const { resume, selfDescription, jobDescription } = interviewReport;

  const pdfBuffer = await generateResumePdf({resume, selfDescription, jobDescription});
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=interview_report_${interviewReportId}.pdf`,
  });
  res.send(pdfBuffer);
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
};
