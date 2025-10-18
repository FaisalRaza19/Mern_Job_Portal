import React, { useState, useEffect, useContext, useRef } from "react";
import DashboardCard from "../shared/dashboardCard.jsx";
import { FiBriefcase, FiUsers, FiCalendar, FiTrendingUp, FiDownload, FiX, FiFileText, FiLoader, FiImage, } from "react-icons/fi";
import { Context } from "../../../../Context/context.jsx";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,} from "recharts";

const MONTHS_TO_SHOW = 6;

const EmployerAnalytics = () => {
  const { Jobs, userData, reviews } = useContext(Context);
  const { getAllJobs } = Jobs;
  const { getAllReviews } = reviews;

  const [jobs, setJobs] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showPreview, setShowPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const dashboardRef = useRef(null);

  // ───────────────────────────── Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!userData?._id) return;
        const allJobs = await getAllJobs();
        setJobs(allJobs?.data || []);
        const employerReviews = await getAllReviews(userData._id);
        setReviewList(employerReviews?.data?.companyInfo?.companyReviews || []);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err?.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData]);

  // ───────────────────────────── Derived Stats
  const totalApplications = jobs.reduce(
    (sum, job) => sum + (job.applicants?.length || 0),
    0
  );
  const interviews = jobs.reduce(
    (sum, job) =>
      sum +
      (job.applicants?.filter((a) => a.status === "Interview").length || 0),
    0
  );
  const hires = jobs.reduce(
    (sum, job) =>
      sum + (job.applicants?.filter((a) => a.status === "Hired").length || 0),
    0
  );

  const stats = [
    { label: "Total Jobs Posted", value: jobs?.length || 0, icon: FiBriefcase },
    { label: "Total Applications", value: totalApplications, icon: FiUsers },
    { label: "Interviews Scheduled", value: interviews, icon: FiCalendar },
    { label: "Successful Hires", value: hires, icon: FiTrendingUp },
  ];

  // ───────────────────────────── Top Jobs
  const jobPerformance = jobs
    .map((job) => ({
      job: job.title,
      applications: job.applicants?.length || 0,
      views: job.views || 0,
      hires: job.applicants?.filter((a) => a.status === "Hired").length || 0,
    }))
    .sort((a, b) => b.applications - a.applications)
    .slice(0, 5);

  // ───────────────────────────── Monthly Data
  const now = new Date();
  const months = [];
  for (let i = MONTHS_TO_SHOW - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString("default", { month: "short", year: "numeric" });
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    months.push({ label, key, count: 0 });
  }

  jobs.forEach((job) => {
    job.applicants?.forEach((app) => {
      const appliedAt = app?.appliedAt ? new Date(app.appliedAt) : null;
      if (!appliedAt) return;
      const key = `${appliedAt.getFullYear()}-${appliedAt.getMonth()}`;
      const monthIndex = months.findIndex((m) => m.key === key);
      if (monthIndex !== -1) months[monthIndex].count++;
    });
  });

  const monthlyData = months.map((m) => ({
    month: m.label,
    applications: m.count,
  }));

  // ───────────────────────────── Growth Text
  const prevMonth = monthlyData[monthlyData.length - 2]?.applications || 0;
  const lastMonth = monthlyData[monthlyData.length - 1]?.applications || 0;
  let growthText = "Stable";
  if (prevMonth === 0 && lastMonth > 0) growthText = "Strong growth vs previous month";
  else if (prevMonth > 0) {
    const pct = (((lastMonth - prevMonth) / prevMonth) * 100).toFixed(1);
    growthText =
      pct > 0
        ? `↑ ${pct}% vs previous month`
        : pct < 0
          ? `↓ ${Math.abs(pct)}% vs previous month`
          : "No change vs previous month";
  }

  // ───────────────────────────── PDF Generation
  const generatePdf = async () => {
    if (!dashboardRef.current) return null;
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const employerName = userData?.companyName || userData?.name || "Employer";
      const dateStr = new Date().toLocaleDateString();

      await new Promise((resolve) => {
        pdf.html(dashboardRef.current, {
          x: margin,
          y: 18,
          html2canvas: { scale: 1.6, useCORS: true },
          callback: (doc) => {
            const pageCount = doc.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
              doc.setPage(i);
              doc.setFontSize(12);
              doc.text(`${employerName} - Analytics Report`, margin, 10);
              doc.setFontSize(9);
              doc.text(`Date: ${dateStr}`, pageWidth - 40, 10);
              doc.text(
                `Page ${i} of ${pageCount}`,
                pageWidth / 2 - 10,
                doc.internal.pageSize.getHeight() - 8
              );
            }
            resolve(doc);
          },
          windowWidth: 1200,
        });
      });

      return pdf;
    } catch (err) {
      console.error("PDF generation failed", err);
      return null;
    }
  };

  // ───────────────────────────── Handlers
  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const pdf = await generatePdf();
      if (pdf) pdf.save("employer-analytics-report.pdf");
    } catch (error) {
      setIsGenerating(false);
      return null
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = async () => {
    setIsGenerating(true);
    try {
      const pdf = await generatePdf();
      if (!pdf) return;
      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setShowPreview(true);
    } catch (error) {
      setIsGenerating(false);
      return null
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadCSV = async () => {
    setIsGenerating(true);
    try {
      const rows = jobs.map((j) => ({
        jobTitle: j.title,
        applications: j.applicants?.length || 0,
        views: j.views || 0,
        hires: j.applicants?.filter((a) => a.status === "Hired").length || 0,
        postedAt: j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "",
      }));

      const csvHeader = ["type", "label", "applications", "views", "hires", "postedAt"];
      const csvRows = [csvHeader.join(",")];
      rows.forEach((r) =>
        csvRows.push(
          [
            "job",
            `"${(r.jobTitle || "").replace(/"/g, '""')}"`,
            r.applications,
            r.views,
            r.hires,
            r.postedAt,
          ].join(",")
        )
      );
      csvRows.push("");
      csvRows.push(["type", "month", "applications"].join(","));
      monthlyData.forEach((m) =>
        csvRows.push(["month", `"${m.month}"`, m.applications].join(","))
      );

      const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "employer-analytics.csv");
      link.click();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPNG = async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await htmlToImage.toPng(dashboardRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = "employer-analytics.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("PNG export failed", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // ───────────────────────────── Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center">
          <FiLoader className="animate-spin w-8 h-8 text-blue-500" />
          <p className="mt-3 text-gray-600 text-sm">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // ───────────────────────────── UI
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handlePreview}
            disabled={isGenerating}
            className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition text-sm flex items-center gap-2"
          >
            {isGenerating ? <FiLoader className="animate-spin" /> : <FiFileText />}
            Preview Report
          </button>

          <div className="inline-flex space-x-2">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              {isGenerating ? (
                <FiLoader className="animate-spin" />
              ) : (
                <FiDownload className="w-4 h-4" />
              )}
              PDF
            </button>

            <button
              onClick={handleDownloadCSV}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-3 py-2 bg-white border text-sm rounded-lg hover:bg-gray-50 transition"
            >
              {isGenerating ? <FiLoader className="animate-spin" /> : <FiFileText />}
              CSV
            </button>

            <button
              onClick={handleDownloadPNG}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-3 py-2 bg-white border text-sm rounded-lg hover:bg-gray-50 transition"
            >
              {isGenerating ? <FiLoader className="animate-spin" /> : <FiImage />}
              PNG
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <div
        ref={dashboardRef}
        className="p-6 bg-white rounded-lg shadow space-y-6 min-w-0"
      >
        {/* Overview */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {userData?.companyName || userData?.name || "Employer"} — Overview
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {totalApplications} total applications • {hires} hires • {interviews} interviews • {growthText}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Report date</p>
            <p className="text-sm text-gray-900">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon }, i) => (
            <div
              key={i}
              className="border border-gray-100 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          ))}
        </div>

        {/* Chart + Top Jobs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <DashboardCard title="Top Jobs">
              <div className="space-y-3">
                {jobPerformance.length ? (
                  jobPerformance.map((job, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                    >
                      <p className="text-sm font-medium truncate">{job.job}</p>
                      <p className="text-sm text-gray-600">{job.applications} appl.</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No data</p>
                )}
              </div>
            </DashboardCard>

            <DashboardCard title="Recent Reviews">
              {reviewList?.length ? (
                <ul className="space-y-3 max-h-64 overflow-auto">
                  {reviewList.slice(0, 5).map((r, i) => (
                    <li key={i} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center mb-2">
                        <img
                          src={r?.userId?.avatar?.avatar_Url || "/"}
                          className="h-8 w-8 rounded-full object-cover border"
                          alt="Reviewer"
                        />
                        <p className="font-medium ml-3">{r.title}</p>
                      </div>
                      <p className="text-sm text-gray-600">{r.comment}</p>
                      <p className="text-xs text-gray-500 mt-1">Rating: {r.rating}★</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No reviews yet</p>
              )}
            </DashboardCard>
          </div>

          <div className="lg:col-span-2">
            <DashboardCard title="Monthly Applications Trend">
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="applications"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </div>
        </div>

        {/* Insight */}
        <div className="bg-gray-50 p-4 rounded-lg border text-sm text-gray-700">
          <strong>Insight:</strong> {growthText}. Top job is{" "}
          {jobPerformance[0]?.job ? `"${jobPerformance[0].job}"` : "N/A"} with{" "}
          {jobPerformance[0]?.applications || 0} applications.
        </div>
      </div>

      {/* PDF Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[85vh] rounded-lg shadow-lg overflow-hidden relative">
            <button
              onClick={() => {
                setShowPreview(false);
                setPdfUrl(null);
              }}
              className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full p-2 shadow"
            >
              <FiX className="w-5 h-5" />
            </button>
            {pdfUrl ? (
              <iframe src={pdfUrl} title="PDF Preview" className="w-full h-full" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <FiLoader className="animate-spin w-8 h-8 text-gray-500" />
                <p className="mt-3 text-gray-600 text-sm">Loading preview...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerAnalytics;
