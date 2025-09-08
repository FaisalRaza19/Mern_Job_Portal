import React, { useState, useEffect, useContext, useRef } from "react"
import DashboardCard from "../shared/dashboardCard.jsx"
import {
  FiBriefcase, FiUsers, FiCalendar, FiTrendingUp,
  FiDownload, FiX
} from "react-icons/fi"
import { Context } from "../../../../Context/context.jsx"
import jsPDF from "jspdf"
import * as htmlToImage from "html-to-image"

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"

const EmployerAnalytics = () => {
  const { Jobs, userData, reviews } = useContext(Context)
  const { getAllJobs } = Jobs
  const { getAllReviews } = reviews

  const [jobs, setJobs] = useState([])
  const [reviewList, setReviewList] = useState([])
  const [showPreview, setShowPreview] = useState(false)
  const [pdfUrl, setPdfUrl] = useState(null) // store PDF blob for preview

  // 🔹 Wrap everything inside this ref (dashboard + modal content)
  const dashboardRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!userData?._id) return
      const allJobs = await getAllJobs()
      setJobs(allJobs?.data || [])

      const employerReviews = await getAllReviews(userData._id)
      setReviewList(employerReviews?.data?.companyInfo?.companyReviews || [])
    }
    fetchData()
  }, [userData])

  // === Derived Stats ===
  const totalApplications = jobs.reduce((sum, job) => sum + (job.applicants?.length || 0), 0)
  const interviews = jobs.reduce(
    (sum, job) => sum + (job.applicants?.filter(a => a.status === "Interview").length || 0),
    0
  )
  const hires = jobs.reduce(
    (sum, job) => sum + (job.applicants?.filter(a => a.status === "Hired").length || 0),
    0
  )

  const stats = [
    { label: "Total Jobs Posted", value: jobs?.length || 0, icon: FiBriefcase },
    { label: "Total Applications", value: totalApplications, icon: FiUsers },
    { label: "Interviews Scheduled", value: interviews, icon: FiCalendar },
    { label: "Successful Hires", value: hires, icon: FiTrendingUp },
  ]

  const jobPerformance = jobs
    .map(job => ({
      job: job.title,
      applications: job.applicants?.length || 0,
      views: job.views || 0,
      hires: job.applicants?.filter(a => a.status === "Hired").length || 0,
    }))
    .sort((a, b) => b.applications - a.applications)
    .slice(0, 5)

  // === Monthly Applications Chart Data ===
  const applicationsByMonth = jobs.reduce((acc, job) => {
    job.applicants?.forEach(app => {
      const month = new Date(app.appliedAt).toLocaleString("default", { month: "short" })
      acc[month] = (acc[month] || 0) + 1
    })
    return acc
  }, {})

  const monthlyData = Object.entries(applicationsByMonth).map(([month, count]) => ({
    month,
    applications: count,
  }))

  //generate pdf 
  const generatePdf = async () => {
    if (!dashboardRef.current) return null

    try {
      const dataUrl = await htmlToImage.toPng(dashboardRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      })

      const pdf = new jsPDF("p", "mm", "a4")
      const imgProps = pdf.getImageProperties(dataUrl)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

      let heightLeft = pdfHeight
      let position = 0

      const employerName = userData?.companyName || userData?.name || "Employer"
      const dateStr = new Date().toLocaleDateString()

      const addHeader = (pageNumber) => {
        pdf.setFontSize(12)
        pdf.setTextColor(40)
        pdf.text(`${employerName} - Analytics Report`, 10, 10)
        pdf.text(`Date: ${dateStr}`, pdfWidth - 50, 10)
        pdf.setLineWidth(0.5)
        pdf.line(10, 12, pdfWidth - 10, 12) // horizontal line below header
        pdf.setFontSize(10)
        pdf.text(`Page ${pageNumber}`, pdfWidth / 2 - 5, pdf.internal.pageSize.getHeight() - 10)
      }

      let pageNumber = 1
      addHeader(pageNumber)
      pdf.addImage(dataUrl, "PNG", 0, 15, pdfWidth, pdfHeight)
      heightLeft -= pdf.internal.pageSize.getHeight() - 15

      while (heightLeft > 0) {
        pageNumber += 1
        position = heightLeft - pdfHeight
        pdf.addPage()
        addHeader(pageNumber)
        pdf.addImage(dataUrl, "PNG", 0, 15, pdfWidth, pdfHeight)
        heightLeft -= pdf.internal.pageSize.getHeight() - 15
      }

      return pdf
    } catch (err) {
      console.error("PDF generation failed", err)
      return null
    }
  }


  // === Download PDF ===
  const handleDownload = async () => {
    const pdf = await generatePdf()
    if (pdf) pdf.save("employer-dashboard.pdf")
  }

  // === Preview PDF ===
  const handlePreview = async () => {
    const pdf = await generatePdf()
    if (pdf) {
      const pdfBlob = pdf.output("blob")
      const url = URL.createObjectURL(pdfBlob)
      setPdfUrl(url)
      setShowPreview(true)
    }
  }

  return (
    <div className="space-y-6">
      {/* === Header === */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePreview}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Preview Report
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiDownload className="w-4 h-4" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* === Everything to export === */}
      <div ref={dashboardRef} className="p-6 bg-white rounded-lg shadow space-y-8">
        {/* 🔹 Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <DashboardCard key={index}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
              </DashboardCard>
            )
          })}
        </div>

        {/* 🔹 Top Jobs */}
        <DashboardCard title="Top Jobs">
          <div className="space-y-3">
            {jobPerformance.map((job, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-900">{job.job}</p>
                <span className="text-sm text-gray-600">{job.applications} applications</span>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* 🔹 Chart */}
        <DashboardCard title="Monthly Applications Trend">
          <div className="w-full h-64 bg-white border rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="applications" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        {/* 🔹 Reviews */}
        <DashboardCard title="Recent Reviews">
          {reviewList?.length > 0 ? (
            <ul className="space-y-2">
              {reviewList.slice(0, 5).map((r, i) => (
                <li key={i} className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center mb-2">
                    <img
                      src={r?.userId?.avatar?.avatar_Url || "/"}
                      className="h-10 w-10 rounded-full object-cover border border-gray-300"
                      alt=""
                    />
                    <p className="font-medium text-gray-900 ml-3">{r.title}</p>
                  </div>
                  <p className="text-sm text-gray-600">{r.comment}</p>
                  <p className="text-sm font-semibold text-gray-500 mt-1">Rating: {r.rating}★</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No reviews available</p>
          )}
        </DashboardCard>
      </div>

      {/* === Report Preview Modal (with real PDF) === */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 h-[90vh] rounded-lg shadow-lg overflow-hidden relative">
            <button
              onClick={() => {
                setShowPreview(false)
                setPdfUrl(null)
              }}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              <FiX className="w-6 h-6" />
            </button>

            {pdfUrl ? (
              <iframe src={pdfUrl} title="PDF Preview" className="w-full h-full"></iframe>
            ) : (
              <p className="p-6 text-gray-500">Generating preview...</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployerAnalytics
