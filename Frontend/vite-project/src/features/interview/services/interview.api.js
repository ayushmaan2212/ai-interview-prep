import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-interview-prep-5rvb.onrender.com",
  withCredentials: true,
});

/**
 * @description Generate an interview report for a candidate based on their resume, self description and job description
 */
export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);

  // Only append file if it exists
  if (resumeFile) {
    formData.append("resume", resumeFile);
  }

  const response = await api.post("/api/interview/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * @description Get a specific interview report by its ID
 */
export const getInterviewReportById = async (reportId) => {
  const response = await api.get(`/api/interview/report/${reportId}`);
  return response.data;
};

/**
 * @description Get all interview reports of the authenticated user
 */
export const getAllInterviewReports = async () => {
  const response = await api.get("/api/interview/");
  return response.data;
};

/**
 * @description Generate a PDF based on resume, self description and job description of a specific interview report
 */
export const generateResumePdf = async (interviewReportId) => {
    const response = await api.get(`/api/interview/resume/pdf/${interviewReportId}`, {
        responseType: 'blob',
    });
    return response.data;
};