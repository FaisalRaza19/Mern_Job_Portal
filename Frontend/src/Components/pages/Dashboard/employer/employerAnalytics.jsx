import React, { useState, useEffect, useContext, useRef } from "react"
import DashboardCard from "../shared/dashboardCard.jsx"
import {
  FiBriefcase, FiUsers, FiCalendar, FiTrendingUp,
  FiDownload, FiX
} from "react-icons/fi"
import { Context } from "../../../../Context/context.jsx"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
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

  const reportRef = useRef()

  useEffect(() => {
    const fetchData = async () => {
      if (!userData?._id) return
      const allJobs = await getAllJobs()
      setJobs(allJobs?.data)

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

  // === PDF Export ===
  const handleDownload = async () => {
    const input = reportRef.current
    const canvas = await html2canvas(input, { scale: 2 })
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
    pdf.save("employer-report.pdf")
  }

  return (
    <div className="space-y-6">
      {/* === Header === */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPreview(true)}
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

      {/* === Stats Cards === */}
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

      {/* === Top Jobs === */}
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

      {/* === Report Preview Modal === */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 h-[90vh] rounded-lg shadow-lg overflow-y-auto relative p-6">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              <FiX className="w-6 h-6" />
            </button>

            {/* === Report Content === */}
            <div ref={reportRef} className="p-6 space-y-8">
              <h2 className="text-xl font-bold mb-4">Employer Analytics Report</h2>

              {/* Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {stats.map((s, idx) => (
                  <div key={idx} className="bg-gray-100 p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-600">{s.label}</p>
                    <p className="text-lg font-semibold">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Top Jobs Table */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Top Performing Jobs</h3>
                <table className="w-full text-sm border">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-2 text-left">Job</th>
                      <th className="p-2">Applications</th>
                      <th className="p-2">Views</th>
                      <th className="p-2">Hires</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobPerformance.map((job, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-2">{job.job}</td>
                        <td className="p-2 text-center">{job.applications}</td>
                        <td className="p-2 text-center">{job.views}</td>
                        <td className="p-2 text-center">{job.hires}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Monthly Applications Chart */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Monthly Applications Trend</h3>
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
              </div>

              {/* Monthly Applications Table */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Monthly Applications Summary</h3>
                <table className="w-full text-sm border">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-2 text-left">Month</th>
                      <th className="p-2 text-center">Applications</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((row, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-2">{row.month}</td>
                        <td className="p-2 text-center">{row.applications}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Recent Reviews */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Recent Reviews</h3>
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployerAnalytics
