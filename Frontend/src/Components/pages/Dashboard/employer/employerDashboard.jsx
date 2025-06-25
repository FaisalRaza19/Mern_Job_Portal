"use client"

import { useState } from "react"
import Topbar from "../shared/Topbar.jsx"
import EmployerSidebar from "./employerSidebar.jsx"
import EmployerOverview from "./employerOverview.jsx"
import PostJob from "./postJobs.jsx"
import ManageJobs from "./manageJobs.jsx"
import ApplicantManagement from "./aplicationManagement.jsx"
import EmployerMessages from "./EmployerMessages.jsx"
import EmployerAnalytics from "./EmployerAnalytics.jsx"
import AdminRequests from "./adminRequest.jsx"
import EmployerSettings from "./EmployerSettings.jsx"

const mockNotifications = [
  { id: "1", text: "New application received for Frontend Developer position", time: "1 hour ago", read: false },
  { id: "2", text: 'Job posting "React Developer" has been approved', time: "3 hours ago", read: false },
  { id: "3", text: "Candidate John Doe accepted interview invitation", time: "1 day ago", read: true },
]

const EmployerDashboard = ({setIsLoggedIn})=>{
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <EmployerOverview />
      case "post-job":
        return <PostJob />
      case "manage-jobs":
        return <ManageJobs />
      case "applicants":
        return <ApplicantManagement />
      case "messages":
        return <EmployerMessages />
      case "analytics":
        return <EmployerAnalytics />
      case "admin-requests":
        return <AdminRequests />
      case "settings":
        return <EmployerSettings />
      default:
        return <EmployerOverview />
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
        <EmployerSidebar
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
        <Topbar onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} notifications={mockNotifications} setIsLoggedIn={setIsLoggedIn} />

        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  )
}

export default EmployerDashboard;