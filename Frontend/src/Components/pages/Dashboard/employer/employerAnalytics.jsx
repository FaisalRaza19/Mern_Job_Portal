import React, { useState } from "react"
import DashboardCard from "../shared/dashboardCard.jsx"
import { FiBriefcase, FiUsers, FiCalendar, FiTrendingUp, FiEye, FiDownload } from "react-icons/fi"

const EmployerAnalytics = () => {
  const [timeRange, setTimeRange] = useState("30")

  const stats = [
    { label: "Total Jobs Posted", value: "24", change: "+12%", icon: FiBriefcase, color: "text-blue-600" },
    { label: "Total Applications", value: "456", change: "+23%", icon: FiUsers, color: "text-green-600" },
    { label: "Interviews Scheduled", value: "32", change: "+8%", icon: FiCalendar, color: "text-purple-600" },
    { label: "Successful Hires", value: "8", change: "+15%", icon: FiTrendingUp, color: "text-orange-600" },
  ]

  const jobPerformance = [
    { job: "Frontend Developer", applications: 45, views: 234, hires: 2 },
    { job: "UI/UX Designer", applications: 32, views: 189, hires: 1 },
    { job: "Backend Developer", applications: 28, views: 156, hires: 1 },
    { job: "Product Manager", applications: 19, views: 98, hires: 0 },
    { job: "DevOps Engineer", applications: 15, views: 87, hires: 1 },
  ]

  const applicationTrends = [
    { month: "Jan", applications: 45 },
    { month: "Feb", applications: 52 },
    { month: "Mar", applications: 48 },
    { month: "Apr", applications: 61 },
    { month: "May", applications: 55 },
    { month: "Jun", applications: 67 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 "
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FiDownload className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <DashboardCard key={index}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 ">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change} from last period</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </DashboardCard>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Trends Chart */}
        <DashboardCard title="Application Trends">
          <div className="space-y-4">
            <div className="h-64 flex items-end justify-between space-x-2">
              {applicationTrends.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-blue-600 rounded-t-lg transition-all duration-300 hover:bg-blue-700"
                    style={{ height: `${(data.applications / 70) * 100}%`, minHeight: "20px" }}
                    title={`${data.applications} applications`}
                  ></div>
                  <p className="text-xs text-gray-600 mt-2">{data.month}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Monthly application volume</p>
            </div>
          </div>
        </DashboardCard>

        {/* Top Performing Jobs */}
        <DashboardCard title="Job Performance">
          <div className="space-y-4">
            {jobPerformance.map((job, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 ">{job.job}</h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 ">
                    <span className="flex items-center space-x-1">
                      <FiUsers className="w-3 h-3" />
                      <span>{job.applications} applications</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <FiEye className="w-3 h-3" />
                      <span>{job.views} views</span>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 ">{job.hires} hires</p>
                  <p className="text-xs text-gray-500 ">
                    {job.applications > 0 ? ((job.hires / job.applications) * 100).toFixed(1) : 0}% conversion
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Sources */}
        <DashboardCard title="Application Sources">
          <div className="space-y-3">
            {[
              { source: "Direct Applications", count: 156, percentage: 45 },
              { source: "Job Boards", count: 98, percentage: 28 },
              { source: "Social Media", count: 67, percentage: 19 },
              { source: "Referrals", count: 28, percentage: 8 },
            ].map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 ">{source.source}</span>
                  <span className="text-sm text-gray-600 ">{source.count}</span>
                </div>
                <div className="w-full bg-gray-200  rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Hiring Funnel */}
        <DashboardCard title="Hiring Funnel">
          <div className="space-y-4">
            {[
              { stage: "Applications", count: 456, percentage: 100 },
              { stage: "Reviewed", count: 234, percentage: 51 },
              { stage: "Shortlisted", count: 89, percentage: 19 },
              { stage: "Interviewed", count: 32, percentage: 7 },
              { stage: "Hired", count: 8, percentage: 2 },
            ].map((stage, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 ">{stage.stage}</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900 ">{stage.count}</span>
                    <span className="text-xs text-gray-500  ml-1">({stage.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200  rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${index === 0
                        ? "bg-blue-600"
                        : index === 1
                          ? "bg-green-600"
                          : index === 2
                            ? "bg-yellow-600"
                            : index === 3
                              ? "bg-orange-600"
                              : "bg-purple-600"
                      }`}
                    style={{ width: `${stage.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Time to Hire */}
        <DashboardCard title="Time to Hire">
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">18</p>
              <p className="text-sm text-gray-600">Average days to hire</p>
            </div>
            <div className="space-y-3">
              {[
                { position: "Frontend Developer", days: 15 },
                { position: "UI/UX Designer", days: 22 },
                { position: "Backend Developer", days: 19 },
                { position: "DevOps Engineer", days: 12 },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-900">{item.position}</span>
                  <span className="text-gray-600">{item.days} days</span>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Recent Activity */}
      <DashboardCard title="Recent Activity">
        <div className="space-y-3">
          {[
            { action: "New application received for Frontend Developer", time: "2 hours ago" },
            { action: "Interview scheduled with Jane Smith", time: "4 hours ago" },
            { action: "Job posting 'Backend Developer' went live", time: "1 day ago" },
            { action: "Candidate John Doe was hired for UI/UX Designer", time: "2 days ago" },
            { action: "Job posting 'Product Manager' received 5 new applications", time: "3 days ago" },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
            >
              <p className="text-gray-900">{activity.action}</p>
              <p className="text-sm text-gray-500 ">{activity.time}</p>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  )
}

export default EmployerAnalytics