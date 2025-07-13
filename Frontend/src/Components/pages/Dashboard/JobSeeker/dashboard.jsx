"use client"

import { useState } from "react"
import Topbar from "../shared/Topbar.jsx"
import JobSeekerSidebar from "./sidebar.jsx"
import JobSeekerOverview from "./overview.jsx"
import SavedJobs from "./savedJobs.jsx"
import AppliedJobs from "./apliedJobs.jsx"
import JobSeekerProfile from "./profile.jsx"
import JobSeekerMessages from "./jobSeekerMessages.jsx"
import JobSeekerSettings from "./settings.jsx"

const mockNotifications = [
  { id: "1", text: "Your application for Frontend Developer at TechCorp was viewed", time: "2 hours ago", read: false },
  { id: "2", text: "New job match: React Developer at StartupXYZ", time: "1 day ago", read: false },
  { id: "3", text: "Interview scheduled for UI/UX Designer position", time: "2 days ago", read: true },
]

const JobSeekerDashboard = ({setIsLoggedIn})=>{
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <JobSeekerOverview activeTab={setActiveTab}/>
      case "saved-jobs":
        return <SavedJobs />
      case "applied-jobs":
        return <AppliedJobs />
      case "profile":
        return <JobSeekerProfile />
      case "messages":
        return <JobSeekerMessages />
      case "settings":
        return <JobSeekerSettings />
      default:
        return <JobSeekerOverview />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-auto transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <JobSeekerSidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab)
            setMobileMenuOpen(false)
          }}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar activeTab={setActiveTab} onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} notifications={mockNotifications} setIsLoggedIn={setIsLoggedIn}/>

        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  )
}

export default JobSeekerDashboard