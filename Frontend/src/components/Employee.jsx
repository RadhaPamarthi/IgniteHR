import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Search, UserPlus, Save, X, ChevronUp, ChevronDown } from 'lucide-react';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    firstName: '', lastName: '', email: '', phone: '', salary: '', 
    role: 'Engineer', department: 'IT', status: 'Active', startDate: ''
  });

  // Load employees from localStorage on first render
  useEffect(() => {
    const savedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
    setEmployees(savedEmployees);
  }, []);

  // Save employees to localStorage whenever the list changes
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  // Handle Input Change
  const handleInputChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  // Add or Update Employee
  const saveEmployee = () => {
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email || !newEmployee.phone || !newEmployee.salary || !newEmployee.startDate) {
      alert("Please enter all required fields!");
      return;
    }

    if (editingEmployee !== null) {
      // Update existing employee
      const updatedEmployees = employees.map((emp) =>
        emp.id === editingEmployee ? { ...newEmployee, id: editingEmployee } : emp
      );
      setEmployees(updatedEmployees);
      setEditingEmployee(null);
    } else {
      // Add new employee
      setEmployees([...employees, { ...newEmployee, id: Date.now() }]);
    }

    setNewEmployee({ firstName: '', lastName: '', email: '', phone: '', salary: '', role: 'Engineer', department: 'IT', status: 'Active', startDate: '' });
    setIsFormVisible(false);
  };

  // Edit Employee
  const editEmployee = (id) => {
    const emp = employees.find((e) => e.id === id);
    setNewEmployee(emp);
    setEditingEmployee(id);
    setIsFormVisible(true);
  };

  // Delete Employee
  const deleteEmployee = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  // Sorting functionality
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  // Handle column sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon based on current sort config
  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  // Search & Filter Employees
  const filteredEmployees = employees.filter(emp =>
    emp.firstName.toLowerCase().includes(search.toLowerCase()) || 
    emp.lastName.toLowerCase().includes(search.toLowerCase()) || 
    emp.email.toLowerCase().includes(search.toLowerCase()) ||
    emp.role.toLowerCase().includes(search.toLowerCase()) ||
    emp.department.toLowerCase().includes(search.toLowerCase())
  );
  
  // Sort employees if sortConfig is set
  const sortedEmployees = React.useMemo(() => {
    let sortableItems = [...filteredEmployees];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        // Handle name sorting (combines first and last name)
        if (sortConfig.key === 'name') {
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          if (nameA < nameB) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (nameA > nameB) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        }
        
        // Handle numeric values (like salary)
        if (sortConfig.key === 'salary') {
          return sortConfig.direction === 'ascending' 
            ? parseFloat(a[sortConfig.key]) - parseFloat(b[sortConfig.key])
            : parseFloat(b[sortConfig.key]) - parseFloat(a[sortConfig.key]);
        }
        
        // Handle date values
        if (sortConfig.key === 'startDate') {
          return sortConfig.direction === 'ascending' 
            ? new Date(a.startDate) - new Date(b.startDate)
            : new Date(b.startDate) - new Date(a.startDate);
        }
        
        // Default string comparison for other fields
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredEmployees, sortConfig]);

  // Format salary for display
  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(salary);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Reset form and close it
  const cancelForm = () => {
    setNewEmployee({ firstName: '', lastName: '', email: '', phone: '', salary: '', role: 'Engineer', department: 'IT', status: 'Active', startDate: '' });
    setEditingEmployee(null);
    setIsFormVisible(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Employee Directory</h2>
        <button 
          onClick={() => setIsFormVisible(!isFormVisible)} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all duration-300 shadow-md"
        >
          {isFormVisible ? (
            <>
              <X size={18} />
              <span>Close Form</span>
            </>
          ) : (
            <>
              <UserPlus size={18} />
              <span>Add Employee</span>
            </>
          )}
        </button>
      </header>

      {/* Add/Edit Employee Form */}
      {isFormVisible && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8 animate-fadeIn">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            {editingEmployee ? "Edit Employee" : "Add New Employee"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-sm text-gray-600 font-medium">First Name *</label>
              <input 
                type="text" 
                name="firstName" 
                placeholder="First Name" 
                value={newEmployee.firstName} 
                onChange={handleInputChange} 
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 font-medium">Last Name *</label>
              <input 
                type="text" 
                name="lastName" 
                placeholder="Last Name" 
                value={newEmployee.lastName} 
                onChange={handleInputChange} 
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 font-medium">Email *</label>
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                value={newEmployee.email} 
                onChange={handleInputChange} 
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 font-medium">Phone *</label>
              <input 
                type="tel" 
                name="phone" 
                placeholder="Phone Number" 
                value={newEmployee.phone} 
                onChange={handleInputChange} 
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 font-medium">Salary *</label>
              <input 
                type="number" 
                name="salary" 
                placeholder="Annual Salary" 
                value={newEmployee.salary} 
                onChange={handleInputChange} 
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 font-medium">Start Date *</label>
              <input 
                type="date" 
                name="startDate" 
                value={newEmployee.startDate} 
                onChange={handleInputChange} 
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 font-medium">Role</label>
              <select 
                name="role" 
                value={newEmployee.role} 
                onChange={handleInputChange} 
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option>Engineer</option>
                <option>HR</option>
                <option>Manager</option>
                <option>Admin</option>
                <option>Designer</option>
                <option>Product Manager</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 font-medium">Department</label>
              <select 
                name="department" 
                value={newEmployee.department} 
                onChange={handleInputChange} 
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option>IT</option>
                <option>Sales</option>
                <option>Marketing</option>
                <option>Finance</option>
                <option>Operations</option>
                <option>Legal</option>
                <option>Research</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600 font-medium">Status</label>
              <select 
                name="status" 
                value={newEmployee.status} 
                onChange={handleInputChange} 
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option>Active</option>
                <option>Inactive</option>
                <option>On Leave</option>
                <option>Probation</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex gap-3 justify-end">
            <button 
              onClick={cancelForm} 
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-all duration-200 flex items-center gap-2"
            >
              <X size={16} />
              Cancel
            </button>
            <button 
              onClick={saveEmployee} 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
            >
              <Save size={16} />
              {editingEmployee ? "Update Employee" : "Save Employee"}
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search by name, email, role or department..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)} 
          className="pl-10 border border-gray-300 p-3 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Employee List */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th 
                  className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Employee</span>
                    {getSortIcon('name')}
                  </div>
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                <th 
                  className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => requestSort('salary')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Salary</span>
                    {getSortIcon('salary')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => requestSort('startDate')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Start Date</span>
                    {getSortIcon('startDate')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => requestSort('role')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Position</span>
                    {getSortIcon('role')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => requestSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {getSortIcon('status')}
                  </div>
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedEmployees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center space-y-3">
                      <Search size={24} className="text-gray-400" />
                      <p>No employees found matching your criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedEmployees.map((emp, index) => (
                  <tr 
                    key={emp.id} 
                    className="hover:bg-gray-50 transition-colors duration-150 animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 flex-shrink-0 mr-3 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">{emp.firstName.charAt(0)}{emp.lastName.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{emp.firstName} {emp.lastName}</div>
                          <div className="text-sm text-gray-500">{emp.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{emp.email}</div>
                      <div className="text-sm text-gray-500">{emp.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatSalary(emp.salary)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(emp.startDate)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{emp.role}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        emp.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : emp.status === 'Inactive' 
                            ? 'bg-red-100 text-red-800' 
                            : emp.status === 'On Leave'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => editEmployee(emp.id)} 
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => deleteEmployee(emp.id)} 
                          className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Employee Stats */}
      {employees.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">
            Showing {sortedEmployees.length} of {employees.length} employees
            {sortConfig.key && (
              <span className="ml-2">
                (sorted by {sortConfig.key} - {sortConfig.direction})
              </span>
            )}
          </p>
        </div>
      )}

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Employee;