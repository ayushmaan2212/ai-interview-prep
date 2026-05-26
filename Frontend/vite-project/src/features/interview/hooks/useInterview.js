import {generateInterviewReport,getAllInterviewReports,getInterviewReportById,generateResumePdf
} from "../services/interview.api";
import { useContext ,useEffect} from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

export const useInterview = () => {
  const context = useContext(InterviewContext);
    const { interviewId } = useParams();

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setLoading(true);
    let response = null;
    try {
      response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      if (response?.interviewReport) {
        setReport(response.interviewReport);
        return response.interviewReport;
      } else {
        throw new Error("Failed to generate interview report");
      }
    } catch (err) {
      console.error("Error generating report:", err);
      throw new Error(
        err?.message ||
          "Failed to generate interview report. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (reportId) => {
    setLoading(true);
    try {
        const response = await getInterviewReportById(reportId);
        if (response?.interviewReport) {
            setReport(response.interviewReport);
            return response.interviewReport;
        }
    } catch (err) {
        console.log(err);
    } finally {
        setLoading(false);
    }
};

  const getReports = async () => {
    setLoading(true);
    let response = null;
    try {
      response = await getAllInterviewReports();
      setReports(response.interviewReports);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
    return response.interviewReports;
  };

  const getResumePdf = async (interviewReportId) => {
    setLoading(true);
    let response = null;
    try {
        response = await generateResumePdf(interviewReportId);
        const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `resume_${interviewReportId}.pdf`);
        document.body.appendChild(link);
        link.click();
    } catch (err) {
        console.log(err);
    } finally {
        setLoading(false);
    }
  };
  
  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getReports();
    }
  }, [interviewId]);

  return {loading,report,reports,generateReport,getReportById,getReports,getResumePdf};
};
