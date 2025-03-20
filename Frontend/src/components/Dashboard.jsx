import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clock, Calendar, CheckSquare, DollarSign, Menu, X, Bell, User, Settings, Home, Users, Briefcase, Activity, FileText, Shield } from 'lucide-react';
import Employee from './Employee';
import TimeTracking from './TimeTracking';
import LeavesPage from './Leaves'; // Add this import



const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const location = useLocation();
  const path = location.pathname;

  // 🔹 State for time tracking data
  const [dashboardData, setDashboardData] = useState({
    timeTracking: { hoursToday: 0, overtimeHours: 0 },
    leaves: { remaining: 15, used: 5, pending: 2 },
    payroll: { lastPayment: { date: '2025-02-28', amount: '$3,250.00' } },
  });

  // 🔹 Function to update dashboard time tracking data from TimeTracking page
  const updateDashboard = (workedHours, overtime) => {
    setDashboardData((prev) => ({
      ...prev,
      timeTracking: { hoursToday: workedHours, overtimeHours: overtime },
    }));
  };

  const navItems = [
    { icon: <Home />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Clock />, label: 'Time Tracking', path: '/dashboard/time-tracking' },
    { icon: <Calendar />, label: 'Leaves', path: '/dashboard/leaves' },
    { icon: <CheckSquare />, label: 'Approvals', path: '/dashboard/approvals' },
    { icon: <DollarSign />, label: 'Payroll', path: '/dashboard/payroll' },
    { icon: <Users />, label: 'Employee Directory', path: '/dashboard/employee-directory' },
    { icon: <Shield />, label: 'Access Control', path: '/dashboard/access-control' },
    { icon: <Briefcase />, label: 'Recruitment', path: '/dashboard/recruitment' },
    { icon: <Activity />, label: 'Attendance', path: '/dashboard/attendance' },
    { icon: <FileText />, label: 'Training & Development', path: '/dashboard/training-development' },
    { icon: <Bell />, label: 'Announcements', path: '/dashboard/announcements' },
    { icon: <DollarSign />, label: 'Benefits & Compensation', path: '/dashboard/benefits-compensation' },
    { icon: <User />, label: 'Profile', path: '/dashboard/profile' },
    { icon: <Settings />, label: 'Settings', path: '/dashboard/settings' },
  ];

  const renderContent = () => {
    if (path === '/dashboard' || path === '/dashboard/') {
      return <MainDashboard dashboardData={dashboardData} />;
    } else if (path === '/dashboard/employee-directory') {
      return <Employee />;
    } else if (path === '/dashboard/time-tracking') {
      return <TimeTracking updateDashboard={updateDashboard} />;
    } else if (path === '/dashboard/leaves') { 
      return <LeavesPage />;
    } 
    else {
      return <div className="p-6"><h2 className="text-xl font-bold">Page coming soon...</h2></div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-width duration-300`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <span className="text-lg font-semibold">{sidebarOpen ? 'IgniteHR' : 'IHR'}</span>
          <button 
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            className="hover:bg-gray-800 p-1 rounded"
          >
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </div>
        <nav className="mt-6 space-y-1">
          {navItems.map((item, index) => (
            <Link 
              key={index} to={item.path}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 w-full transition-colors text-white"
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

// 🔹 Update Dashboard UI to reflect time tracking changes dynamically
const MainDashboard = ({ dashboardData }) => {
  return (
    <div>
      <header className="bg-white shadow flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <button aria-label="Notifications" className="hover:bg-gray-100 p-2 rounded-full">
            <Bell />
          </button>
          <button aria-label="User settings" className="hover:bg-gray-100 p-2 rounded-full">
            <User />
          </button>
        </div>
      </header>

      <main className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <h2 className="font-semibold text-gray-600">Today's Hours</h2>
          <p className="text-2xl mt-2">{dashboardData.timeTracking.hoursToday.toFixed(1)} hrs</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <h2 className="font-semibold text-gray-600">Leaves Remaining</h2>
          <p className="text-2xl mt-2">{dashboardData.leaves.remaining}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <h2 className="font-semibold text-gray-600">Pending Approvals</h2>
          <p className="text-2xl mt-2">{dashboardData.leaves.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <h2 className="font-semibold text-gray-600">Overtime</h2>
          <p className="text-2xl mt-2 text-red-500">{dashboardData.timeTracking.overtimeHours.toFixed(1)} hrs</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
