const express = require('express');
const interviewController = require('../controllers/interview.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/file.middleware');

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * @description Generate an interview report for a candidate based on their resume, self description and job description
 * @access Private
 */
interviewRouter.post("/",authMiddleware.authUser,upload.single("resume"), interviewController.generateInterviewReportController);

/**
 * @route GET /api/interview/report/:reportId
 * @description Get a specific interview report by its ID
 * @access Private
 */
 interviewRouter.get("/report/:reportId", authMiddleware.authUser, interviewController.getInterviewReportByIdController);


 /**
  * @route GET /api/interview/
  * @description Get all interview reports of the authenticated user
  * @access Private
  */
 interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController);

/**
 * @route GET /api/interview/resume/pdf/:interviewReportId
 * @description Generate a PDF based on resume, self description and job description of a specific interview report
 * @access Private
 */
interviewRouter.get("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController);
 


module.exports = interviewRouter;