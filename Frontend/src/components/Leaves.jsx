import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  FileText, 
  User, 
  Users, 
  Check, 
  X, 
  AlertCircle, 
  Calendar as CalendarIcon,
  FileCheck,
  Briefcase,
  ChevronRight,
  AlertOctagon
} from 'lucide-react';

const LeavesPage = () => {
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  
  useEffect(() => {
    // Format current date for display
    const date = new Date();
    setCurrentDate(date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, []);
  
  // Add form state
  const [formData, setFormData] = useState({
    leaveType: '',
    duration: 'full-day',
    startDate: '',
    endDate: '',
    reason: '',
    handover: '',
    attachment: null
  });
  
  // Add form change handler
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Mock data
  const userData = {
    name: "Alex Johnson",
    role: "Senior Developer",
    department: "Engineering"
  };
  
  const [leaveBalances, setLeaveBalances] = useState([
    { type: "Annual Leave", used: 5, total: 20, color: "bg-indigo-500", iconColor: "text-indigo-500", icon: <Briefcase className="h-4 w-4 text-indigo-500" /> },
    { type: "Sick Leave", used: 3, total: 15, color: "bg-rose-500", iconColor: "text-rose-500", icon: <AlertOctagon className="h-4 w-4 text-rose-500" /> },
    { type: "Personal Leave", used: 2, total: 5, color: "bg-emerald-500", iconColor: "text-emerald-500", icon: <User className="h-4 w-4 text-emerald-500" /> },
    { type: "Unpaid Leave", used: 0, total: 8, color: "bg-slate-500", iconColor: "text-slate-500", icon: <Clock className="h-4 w-4 text-slate-500" /> }
  ]);
  
  // Change this to state so we can update it
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, type: "Annual Leave", startDate: "2025-04-10", endDate: "2025-04-15", status: "Approved", days: 4, reason: "Family vacation" },
    { id: 2, type: "Sick Leave", startDate: "2025-03-25", endDate: "2025-03-25", status: "Pending", days: 1, reason: "Doctor's appointment" },
    { id: 3, type: "Personal Leave", startDate: "2025-05-02", endDate: "2025-05-02", status: "Pending", days: 1, reason: "Personal matters" },
    { id: 4, type: "Annual Leave", startDate: "2025-01-15", endDate: "2025-01-20", status: "Completed", days: 4, reason: "Winter break" },
  ]);
  
  const teamLeaves = [
    { name: "Sarah Chen", department: "Engineering", dates: "Mar 21-25", type: "Annual" },
    { name: "David Kim", department: "Engineering", dates: "Apr 5-12", type: "Annual" },
    { name: "Michelle Park", department: "Design", dates: "Mar 24", type: "Sick" },
  ];
  
  const upcomingHolidays = [
    { name: "Good Friday", date: "Mar 29, 2025" },
    { name: "Easter Monday", date: "Apr 1, 2025" },
    { name: "Memorial Day", date: "May 26, 2025" }
  ];
  
  // Add submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate days between dates
    let days = 1; // Default to 1 for single day
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end >= start) {
        const diffTime = Math.abs(end - start);
        days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
      }
    }
    
    // Create new leave request
    const newRequest = {
      id: leaveRequests.length + 1,
      type: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate || formData.startDate, // If end date not set, use start date
      status: "Pending",
      days: days,
      reason: formData.reason
    };
    
    // Add to leave requests
    setLeaveRequests(prev => [newRequest, ...prev]);
    
    // Reset form and close it
    setFormData({
      leaveType: '',
      duration: 'full-day',
      startDate: '',
      endDate: '',
      reason: '',
      handover: '',
      attachment: null
    });
    setIsRequestFormOpen(false);
  };
  
  // Status badge component with appropriate colors
  const StatusBadge = ({ status }) => {
    let styles = {
      bg: "bg-slate-100",
      text: "text-slate-700",
      border: "border-slate-200"
    };
    
    if (status === "Approved") {
      styles = {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-100"
      };
    } else if (status === "Pending") {
      styles = {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-100"
      };
    } else if (status === "Rejected") {
      styles = {
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-100"
      };
    } else if (status === "Completed") {
      styles = {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-100"
      };
    } else if (status === "Cancelled") {
      styles = {
        bg: "bg-slate-50",
        text: "text-slate-700",
        border: "border-slate-100"
      };
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles.bg} ${styles.text} border ${styles.border}`}>
        {status}
      </span>
    );
  };

  // Function to toggle expanded request
  const toggleRequestDetails = (id) => {
    if (expandedRequest === id) {
      setExpandedRequest(null);
    } else {
      setExpandedRequest(id);
    }
  };

  // Function to cancel a pending request
  const handleCancelRequest = (id) => {
    setLeaveRequests(prev => 
      prev.map(request => 
        request.id === id ? {...request, status: "Cancelled"} : request
      )
    );
  };
  
  // Format date in a more readable way
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Leaves Management</h1>
          <div className="text-sm text-slate-500">{currentDate}</div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {/* Action Buttons */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800 tracking-tight">My Leaves</h2>
          <button 
            onClick={() => setIsRequestFormOpen(!isRequestFormOpen)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            {isRequestFormOpen ? 'Cancel' : 'Request Leave'}
          </button>
        </div>
        
        {/* Request Leave Form - Conditionally displayed */}
        {isRequestFormOpen && (
          <div className="bg-white shadow-md rounded-lg mb-8 p-6 border border-slate-100 transition-all duration-300">
            <h3 className="text-lg font-semibold text-slate-800 mb-6 pb-2 border-b border-slate-100">New Leave Request</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="leaveType" className="block text-sm font-medium text-slate-700 mb-1">
                    Leave Type
                  </label>
                  <div className="mt-1">
                    <select
                      id="leaveType"
                      name="leaveType"
                      value={formData.leaveType}
                      onChange={handleFormChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-md"
                      required
                    >
                      <option value="" disabled>Select leave type</option>
                      {leaveBalances.map((leave) => (
                        <option key={leave.type} value={leave.type}>
                          {leave.type} ({leave.total - leave.used} days available)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-1">
                    Duration Type
                  </label>
                  <div className="mt-1">
                    <select
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleFormChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-md"
                    >
                      <option value="full-day">Full Day</option>
                      <option value="first-half">First Half</option>
                      <option value="second-half">Second Half</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-1">
                    Start Date
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="startDate"
                      id="startDate"
                      value={formData.startDate}
                      onChange={handleFormChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 mb-1">
                    End Date
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="endDate"
                      id="endDate"
                      value={formData.endDate}
                      onChange={handleFormChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-1">
                    Reason
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleFormChange}
                      rows={3}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-md"
                      placeholder="Brief description of your leave request"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="handover" className="block text-sm font-medium text-slate-700 mb-1">
                    Handover Notes
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="handover"
                      name="handover"
                      value={formData.handover}
                      onChange={handleFormChange}
                      rows={2}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-slate-300 rounded-md"
                      placeholder="Information for team members during your absence"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Attachment (optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-md bg-slate-50">
                    <div className="space-y-1 text-center">
                      <FileText className="mx-auto h-10 w-10 text-slate-400" />
                      <div className="flex text-sm text-slate-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500">
                        PNG, JPG, PDF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRequestFormOpen(false)}
                  className="inline-flex justify-center py-2 px-4 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
  {leaveBalances.map((leave, index) => {
    // Map icon colors to background colors explicitly
    let bgColorClass = "bg-slate-50"; // Default
    if (leave.iconColor === "text-indigo-500") bgColorClass = "bg-indigo-50";
    if (leave.iconColor === "text-rose-500") bgColorClass = "bg-rose-50";
    if (leave.iconColor === "text-emerald-500") bgColorClass = "bg-emerald-50";
    if (leave.iconColor === "text-slate-500") bgColorClass = "bg-slate-50";
    
    // Calculate progress percentage with minimum width
    const progressPercentage = Math.max(8, (leave.used / leave.total) * 100);
    
    return (
      <div key={index} className="bg-white rounded-lg shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all duration-300">
        <div className="flex items-center mb-2">
          <div className={`p-2 ${bgColorClass} rounded-full mr-2`}>
            {leave.icon}
          </div>
          <h2 className="font-semibold text-slate-700">{leave.type}</h2>
        </div>
        <div className="flex justify-between items-baseline mb-2">
          <p className="text-2xl font-bold text-slate-800">{leave.total - leave.used}</p>
          <p className="text-sm text-slate-500">of {leave.total} days</p>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div 
            className={`${leave.color} h-2 rounded-full transition-all duration-500`} 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="mt-2 text-xs text-slate-500">{leave.used} days used</p>
      </div>
    );
  })}
</div>
        
        {/* Pending Request Count Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-5 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Pending Requests</h3>
            <div className="px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-100">
              {leaveRequests.filter(req => req.status === "Pending").length} Pending
            </div>
          </div>
        </div>
        
        {/* Three-Column Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
          {/* Team On Leave Card */}
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-slate-100">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-md font-semibold text-slate-800">Team On Leave</h3>
            </div>
            <div className="px-5 py-4">
              <div className="space-y-4">
                {teamLeaves.length > 0 ? (
                  teamLeaves.map((teammate, index) => (
                    <div key={index} className="flex items-center p-2 hover:bg-slate-50 rounded-md transition-colors duration-200">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                        <Users className="h-5 w-5 text-indigo-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-800">{teammate.name}</div>
                        <div className="text-xs text-slate-500">
                          {teammate.dates} • {teammate.type} Leave
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-slate-500 text-sm">No team members on leave</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Pending Requests Card */}
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-slate-100">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-md font-semibold text-slate-800">My Pending Requests</h3>
            </div>
            <div className="px-5 py-4">
              {leaveRequests.filter(req => req.status === "Pending").length > 0 ? (
                <div className="space-y-3">
                  {leaveRequests
                    .filter(req => req.status === "Pending")
                    .map((request) => (
                      <div key={request.id} className="bg-amber-50 p-4 rounded-md border border-amber-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-slate-800">{request.type}</p>
                            <p className="text-xs text-slate-600 mt-1">
                              {request.startDate === request.endDate 
                                ? formatDate(request.startDate)
                                : `${formatDate(request.startDate)} to ${formatDate(request.endDate)}`
                              }
                            </p>
                          </div>
                          <StatusBadge status={request.status} />
                        </div>
                        <p className="mt-2 text-xs text-slate-600">{request.reason}</p>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className="text-center py-6 bg-slate-50 rounded-md">
                  <p className="text-slate-500 text-sm">No pending requests</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Upcoming Holidays Card */}
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-slate-100">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-md font-semibold text-slate-800">Upcoming Holidays</h3>
            </div>
            <div className="px-5 py-4">
              <div className="space-y-4">
                {upcomingHolidays.map((holiday, index) => (
                  <div key={index} className="flex items-start p-2 hover:bg-slate-50 rounded-md transition-colors duration-200">
                    <div className="flex-shrink-0 h-8 w-8 mt-1 rounded-full bg-rose-50 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-rose-500" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-slate-800">{holiday.name}</div>
                      <div className="text-xs text-slate-500">{holiday.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Calendar View */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-slate-100 mb-8">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-md font-semibold text-slate-800">Leave Calendar</h3>
          </div>
          <div className="p-5">
            <div className="flex justify-center items-center p-10 border border-slate-100 rounded-md bg-slate-50">
              <Calendar className="h-16 w-16 text-indigo-400" />
              <p className="ml-4 text-slate-500">Interactive calendar view would go here</p>
            </div>
          </div>
        </div>
        
        {/* Leave History Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-slate-100">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-md font-semibold text-slate-800">Leave History</h3>
            <div className="flex space-x-2">
              <select className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>All Types</option>
                <option>Annual Leave</option>
                <option>Sick Leave</option>
                <option>Personal Leave</option>
              </select>
              <select className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>All Status</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
                <option>Completed</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <div className="py-2 align-middle inline-block min-w-full">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Days
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                      {leaveRequests.map((request) => (
                        <React.Fragment key={request.id}>
                          <tr className={`${expandedRequest === request.id ? 'bg-slate-50' : 'hover:bg-slate-50'} transition-colors duration-150`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-slate-800">{request.type}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-slate-600">
                                {request.startDate === request.endDate 
                                  ? formatDate(request.startDate)
                                  : <span>{formatDate(request.startDate)} <span className="text-slate-400">to</span> {formatDate(request.endDate)}</span>
                                }
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-slate-600">{request.days} day{request.days > 1 ? 's' : ''}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={request.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button 
                                onClick={() => toggleRequestDetails(request.id)}
                                className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end w-full transition-colors duration-150"
                              >
                                {expandedRequest === request.id ? (
                                  <>Less <ChevronUp className="ml-1 h-4 w-4" /></>
                                ) : (
                                  <>More <ChevronDown className="ml-1 h-4 w-4" /></>
                                )}
                              </button>
                            </td>
                          </tr>
                          
                          {/* Expanded details row */}
                          {expandedRequest === request.id && (
                            <tr className="bg-slate-50">
                              <td colSpan={5} className="px-6 py-4">
                                <div className="text-sm">
                                  <div className="font-medium text-slate-800 mb-2 pb-1 border-b border-slate-200">Request Details</div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <p className="mb-1"><span className="text-slate-500">Reason:</span> {request.reason}</p>
                                      <p><span className="text-slate-500">Submitted:</span> March 15, 2025</p>
                                    </div>
                                    <div>
                                      {request.status === "Approved" && (
                                        <p><span className="text-slate-500">Approved by:</span> Manager Name</p>
                                      )}
                                      {request.status === "Pending" && (
                                        <div className="flex space-x-2">
                                          <button 
                                            onClick={() => handleCancelRequest(request.id)}
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 transition-colors duration-150">
                                            <X className="h-3.5 w-3.5 mr-1" />
                                            Cancel Request
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="text-xs text-slate-500">Showing {leaveRequests.length} leave requests</div>
            <div className="flex space-x-1">
              <button className="px-2 py-1 border border-slate-200 rounded text-xs text-slate-500 bg-white hover:bg-slate-100">Previous</button>
              <button className="px-2 py-1 border border-slate-200 rounded text-xs text-slate-500 bg-white hover:bg-slate-100">Next</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeavesPage;