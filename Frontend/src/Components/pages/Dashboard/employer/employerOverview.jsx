import React,{useContext } from "react"
import DashboardCard from "../shared/dashboardCard.jsx"
import { FiBriefcase, FiUsers, FiCalendar, FiTrendingUp, FiEdit} from "react-icons/fi"
import { Context } from "../../../../Context/context.jsx";

const EmployerOverview = ({setActiveTab,jobData})=>{
  const { userData,} = useContext(Context);
  const activeJobs = jobData?.filter((e) => e?.status === "Active").length
  const totalAplication = jobData?.map((e)=>e?.applicants.length)
  const user = userData;

  const stats = [
    { label: "Active Jobs", value: activeJobs || "0", icon: FiBriefcase, color: "text-blue-600" },
    { label: "Total Applications", value: totalAplication?.reduce((e,i)=>e+i,0) || "0", icon: FiUsers, color: "text-green-600" },
    { label: "Interviews Scheduled", value: "12", icon: FiCalendar, color: "text-purple-600" },
    { label: "Hires This Month", value: "3", icon: FiTrendingUp, color: "text-orange-600" },
  ]

  const recentApplications = [
    { name: "John Doe", position: "Frontend Developer", time: "2 hours ago", status: "New" },
    { name: "Jane Smith", position: "UI/UX Designer", time: "4 hours ago", status: "Reviewed" },
    { name: "Mike Johnson", position: "Backend Developer", time: "1 day ago", status: "Shortlisted" },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.companyInfo?.companyName || ""}!</h1>
        <p className="opacity-90">Manage your job postings and find the best candidates.</p>
      </div>

      {/* Stats Cards */}
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
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </DashboardCard>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Overview */}
        <DashboardCard
          title="Company Profile"
          action={
            <button
              onClick={() => setActiveTab("settings")}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiEdit className="w-4 h-4" />
              <span>Edit</span>
            </button>
          }
        >
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiEdit className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 ">{user?.companyInfo?.companyName || ""}</h3>
              <p className="text-gray-600 ">{user?.companyInfo?.companyType || "Technology Company"}</p>
              <div className="mt-2">
                <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Verified Employer
                </span>
              </div>
              <div className="mt-3 text-sm text-gray-600 ">
                <p>San Francisco, CA</p>
                <p>{user?.companyInfo?.companySize + " Employes" || "0 Employes"}</p>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Quick Actions */}
        <DashboardCard title="Quick Actions">
          <div className="space-y-3">
            <button onClick={()=>setActiveTab("post-job")} className="w-full flex items-center space-x-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              <FiBriefcase className="w-5 h-5" />
              <span className="font-medium">Post New Job</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              <FiUsers className="w-5 h-5" />
              <span className="font-medium">View Applications</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              <FiCalendar className="w-5 h-5" />
              <span className="font-medium">Schedule Interviews</span>
            </button>
          </div>
        </DashboardCard>
      </div>

      {/* Recent Applications */}
      <DashboardCard title="Recent Applications">
        <div className="space-y-3">
          {recentApplications.map((application, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <img
                  src="/placeholder.svg?height=40&width=40"
                  alt={application.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900 ">{application.name}</p>
                  <p className="text-sm text-gray-600 ">{application.position}</p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    application.status === "New"
                      ? "bg-blue-100 text-blue-800"
                      : application.status === "Reviewed"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {application.status}
                </span>
                <p className="text-xs text-gray-500  mt-1">{application.time}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
          View All Applications
        </button>
      </DashboardCard>
    </div>
  )
}

export default EmployerOverview