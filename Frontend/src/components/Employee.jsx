import React, { useState, useEffect } from "react";
import {
  PlusCircle, Edit, Trash2, Search, UserPlus, Save, X, ChevronUp, ChevronDown, Calendar
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Employee = () => {
  const [employees, setEmployees] = useState([]);  
  const [search, setSearch] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    firstName: "", 
    lastName: "", 
    email: "", 
    phone: "", 
    salary: "",
    role: "Engineer", 
    department: "IT", 
    status: "Active", 
    startDate: new Date()
  });
  const [startDate, setStartDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Fetch employees from backend
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://192.168.2.8:8080/employees');
      if (!response.ok) throw new Error("Failed to fetch employees");

      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : []); 
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]); 
    }
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  // Handle Date Change
  const handleDateChange = (date) => {
    setStartDate(date);
    setNewEmployee({ 
      ...newEmployee, 
      startDate: date
    });
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Add or Update Employee
  const saveEmployee = async () => {
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email || !newEmployee.phone || !newEmployee.salary) {
      alert("Please enter all required fields!");
      return;
    }

    setIsLoading(true);
    try {
      // Create a copy of the employee data for sending
      const employeeData = {
        ...newEmployee,
        // Ensure salary is a number
        salary: parseFloat(newEmployee.salary),
        // Format date properly - as ISO string
        startDate: startDate.toISOString()
      };

      console.log("Sending employee data:", employeeData);

      const response = await fetch("http://192.168.2.8:8080/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add employee");
      }

      const data = await response.json();
      alert(`Employee added successfully!\nEmp ID: ${data.emp_id}\nPassword: ${data.password}`);

      fetchEmployees();
      resetForm();
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Failed to add employee. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the form
  const resetForm = () => {
    setNewEmployee({
      firstName: "", 
      lastName: "", 
      email: "", 
      phone: "", 
      salary: "",
      role: "Engineer", 
      department: "IT", 
      status: "Active", 
      startDate: new Date()
    });
    setStartDate(new Date());
    setEditingEmployee(null);
    setIsFormVisible(false);
  };

  // Edit Employee
  const editEmployee = (id) => {
    const emp = employees.find((e) => e.emp_id === id);
    if (!emp) return;

    // Convert the date string to Date object for the DatePicker
    const empStartDate = emp.startDate ? new Date(emp.startDate) : new Date();
    setStartDate(empStartDate);
    
    setNewEmployee({ 
      ...emp,
      // Make sure salary is a string for input field
      salary: emp.salary.toString(),
      startDate: empStartDate
    });
    setEditingEmployee(id);
    setIsFormVisible(true);
  };

  // Delete Employee with proper CORS handling
  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://192.168.2.8:8080/employees/${id}`, { 
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete employee");
      }
      
      alert("Employee deleted successfully");
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter employees based on search input
  const filteredEmployees = employees.filter(emp => 
    emp.firstName?.toLowerCase().includes(search.toLowerCase()) || 
    emp.lastName?.toLowerCase().includes(search.toLowerCase()) || 
    emp.emp_id?.toLowerCase().includes(search.toLowerCase()) ||
    emp.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Employee Directory</h2>

        <button 
          onClick={() => {
            resetForm();
            setIsFormVisible(true);
          }} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md"
          disabled={isLoading}
        >
          <UserPlus size={18} />
          <span>Add Employee</span>
        </button>
      </header>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search employees by name, ID, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Add/Edit Employee Form */}
      {isFormVisible && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {editingEmployee ? "Edit Employee" : "Add New Employee"}
            </h3>
            <button 
              onClick={() => setIsFormVisible(false)} 
              className="text-gray-600 hover:text-gray-900"
              disabled={isLoading}
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic information fields */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600 font-medium">First Name *</label>
              <input type="text" name="firstName" placeholder="First Name" value={newEmployee.firstName} onChange={handleInputChange} className="border p-2 rounded-md w-full" />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 font-medium">Last Name *</label>
              <input type="text" name="lastName" placeholder="Last Name" value={newEmployee.lastName} onChange={handleInputChange} className="border p-2 rounded-md w-full" />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 font-medium">Email *</label>
              <input type="email" name="email" placeholder="Email" value={newEmployee.email} onChange={handleInputChange} className="border p-2 rounded-md w-full" />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 font-medium">Phone *</label>
              <input type="text" name="phone" placeholder="Phone" value={newEmployee.phone} onChange={handleInputChange} className="border p-2 rounded-md w-full" />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 font-medium">Salary *</label>
              <input type="number" name="salary" placeholder="Salary" value={newEmployee.salary} onChange={handleInputChange} className="border p-2 rounded-md w-full" />
            </div>
            
            {/* Date Picker Component */}
            <div className="space-y-1">
              <label className="text-sm text-gray-600 font-medium">Start Date *</label>
              <div className="relative">
                <DatePicker
                  selected={startDate}
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM-dd"
                  className="border p-2 rounded-md w-full"
                  placeholderText="Select date"
                />
                <Calendar size={18} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            {/* Dropdown fields */}
            <div>
              <label className="text-sm text-gray-600 font-medium">Role *</label>
              <select name="role" value={newEmployee.role} onChange={handleInputChange} className="border p-2 rounded-md w-full">
                <option>Engineer</option>
                <option>Manager</option>
                <option>HR</option>
                <option>Admin</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Department *</label>
              <select name="department" value={newEmployee.department} onChange={handleInputChange} className="border p-2 rounded-md w-full">
                <option>IT</option>
                <option>Finance</option>
                <option>Sales</option>
                <option>Operations</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Status *</label>
              <select name="status" value={newEmployee.status} onChange={handleInputChange} className="border p-2 rounded-md w-full">
                <option>Active</option>
                <option>Inactive</option>
                <option>On Leave</option>
              </select>
            </div>
          </div>

          {/* Form Buttons */}
          <div className="mt-6 flex gap-3 justify-end">
            <button 
              onClick={() => setIsFormVisible(false)} 
              className="px-4 py-2 border text-gray-700 rounded-md"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              onClick={saveEmployee} 
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : (editingEmployee ? "Update Employee" : "Save Employee")}
            </button>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Processing...</p>
        </div>
      )}

      {/* Employee List */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              {["Employee", "Contact", "Salary", "Start Date", "Role", "Department", "Status", "Actions"].map((col) => (
                <th key={col} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp.emp_id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold">{emp.firstName} {emp.lastName}</div>
                    <div className="text-sm text-gray-500">{emp.emp_id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{emp.email}</div>
                    <div className="text-sm text-gray-500">{emp.phone}</div>
                  </td>
                  <td className="px-6 py-4">${Number(emp.salary).toLocaleString()}</td>
                  <td className="px-6 py-4">{formatDateForDisplay(emp.startDate)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{emp.role}</span>
                  </td>
                  <td className="px-6 py-4">{emp.department}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      emp.status === "Active" ? "bg-green-100 text-green-800" :
                      emp.status === "Inactive" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => editEmployee(emp.emp_id)} 
                        className="text-blue-600 hover:text-blue-800"
                        disabled={isLoading}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => deleteEmployee(emp.emp_id)} 
                        className="text-red-600 hover:text-red-800"
                        disabled={isLoading}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  {search ? "No employees match your search" : "No employees found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;