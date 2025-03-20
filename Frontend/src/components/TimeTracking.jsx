// Updated TimeTracking Component with indigo color scheme
import React, { useState, useEffect } from 'react';
import { Clock, Play, StopCircle, Pause, ArrowRight, BarChart } from 'lucide-react';

const TimeTracking = ({ updateDashboard }) => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakTime, setBreakTime] = useState(0);
  const [breakTimeSeconds, setBreakTimeSeconds] = useState(0);
  const [overtime, setOvertime] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState('');
  const [workSessions, setWorkSessions] = useState([]);

  useEffect(() => {
    let interval;
    if (isClockedIn && !isOnBreak) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isClockedIn, isOnBreak]);

  useEffect(() => {
    if (elapsedTime > 8 * 3600) {
      setOvertime(elapsedTime - 8 * 3600);
    }
  }, [elapsedTime]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const formatTimeForDisplay = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const formatTimeNoLabels = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClockIn = () => {
    const now = new Date();
    setIsClockedIn(true);
    setStartTime(now);
    setElapsedTime(0);
    setShowAnimation(true);
    setAnimationType('in');
    
    setTimeout(() => {
      setShowAnimation(false);
    }, 2000);
    
    updateDashboard(elapsedTime / 3600, overtime / 3600);
  };

  const handleClockOut = () => {
    setIsClockedIn(false);
    setShowAnimation(true);
    setAnimationType('out');
    
    const session = {
      date: new Date().toLocaleDateString(),
      startTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: formatTimeNoLabels(elapsedTime),
      overtimeHours: formatTimeNoLabels(overtime),
      breakDuration: formatTimeNoLabels(breakTimeSeconds)
    };
    
    setWorkSessions([session, ...workSessions.slice(0, 4)]);
    
    setTimeout(() => {
      setShowAnimation(false);
    }, 2000);
    
    updateDashboard(elapsedTime / 3600, overtime / 3600);
  };

  useEffect(() => {
    let breakInterval;
    if (isClockedIn && isOnBreak) {
      breakInterval = setInterval(() => {
        setBreakTimeSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(breakInterval);
  }, [isClockedIn, isOnBreak]);
  
  useEffect(() => {
    // Convert breakTimeSeconds to minutes for display
    setBreakTime(Math.floor(breakTimeSeconds / 60));
  }, [breakTimeSeconds]);

  const handleBreak = () => {
    setIsOnBreak(!isOnBreak);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-white p-6 w-full">
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
            <Clock className="text-indigo-600" /> Time Tracking
          </h1>
          <div className="text-sm font-medium bg-gray-100 px-4 py-2 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            Wednesday, Mar 19, 2025
          </div>
        </div>

        <div className="mb-8">
          <p className="text-gray-600 mb-4">Manage your work hours efficiently.</p>
          <div className={`flex items-center py-2 px-4 rounded-md ${isClockedIn ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div className={`w-3 h-3 rounded-full mr-2 ${isClockedIn ? 'bg-green-500' : 'bg-gray-400'} animate-pulse`}></div>
            <p className="text-lg font-medium">
              {isClockedIn ? 'You are currently clocked in' : 'You are not clocked in'}
            </p>
            {isClockedIn && startTime && (
              <span className="ml-2 text-sm text-gray-500">
                Since {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>

        {/* Status Cards - Updated Work Duration to indigo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-indigo-50 p-4 rounded-md border-l-4 border-indigo-500 shadow-sm">
            <div className="text-indigo-700 text-sm font-medium mb-1 flex items-center">
              <Clock size={14} className="mr-1" /> Work Duration
            </div>
            <div className="text-xl font-bold text-gray-800">
              {String(Math.floor(elapsedTime / 3600)).padStart(2, '0')}h {String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, '0')}m {String(elapsedTime % 60).padStart(2, '0')}s
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-md border-l-4 border-yellow-500 shadow-sm">
            <div className="text-yellow-700 text-sm font-medium mb-1 flex items-center">
              <Pause size={14} className="mr-1" /> Break Time
            </div>
            <div className="text-xl font-bold text-gray-800">
              {String(Math.floor(breakTimeSeconds / 60)).padStart(2, '0')}m {String(breakTimeSeconds % 60).padStart(2, '0')}s
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-md border-l-4 border-red-500 shadow-sm">
            <div className="text-red-700 text-sm font-medium mb-1 flex items-center">
              <BarChart size={14} className="mr-1" /> Overtime
            </div>
            <div className="text-xl font-bold text-gray-800">
              {String(Math.floor(overtime / 3600)).padStart(2, '0')}h {String(Math.floor((overtime % 3600) / 60)).padStart(2, '0')}m {String(overtime % 60).padStart(2, '0')}s
            </div>
          </div>
        </div>

        {/* Action Buttons - Updated Clock In button to indigo */}
        <div className="flex gap-4 mb-8">
          {!isClockedIn ? (
            <button 
              onClick={handleClockIn} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md flex items-center justify-center gap-2 flex-grow transition-all duration-200 shadow-sm font-medium"
            >
              <Play size={18} className="text-indigo-200" /> Clock In
            </button>
          ) : (
            <button 
              onClick={handleClockOut} 
              className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-md flex items-center justify-center gap-2 flex-grow transition-all duration-200 shadow-sm font-medium"
            >
              <StopCircle size={18} className="text-gray-300" /> Clock Out
            </button>
          )}
          <button 
            onClick={handleBreak} 
            className={`${isOnBreak ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-500 hover:bg-yellow-600'} text-white px-6 py-3 rounded-md flex items-center justify-center gap-2 flex-grow transition-all duration-200 shadow-sm font-medium ${!isClockedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isClockedIn}
          >
            {isOnBreak ? <Play size={18} className="text-green-200" /> : <Pause size={18} className="text-yellow-200" />} {isOnBreak ? 'Resume Work' : 'Take Break'}
          </button>
        </div>

        {/* Clock In/Out Animation */}
        {showAnimation && (
          <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 transition-opacity duration-500 ${showAnimation ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-white p-8 rounded-lg shadow-2xl text-center transform transition-transform duration-500 scale-100 w-72">
              <div className={`mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full ${animationType === 'in' ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                <div className={`text-6xl ${animationType === 'in' ? 'text-indigo-500' : 'text-gray-700'}`}>
                  {animationType === 'in' ? <Play size={48} /> : <StopCircle size={48} />}
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                {animationType === 'in' ? 'Clocked In' : 'Clocked Out'}
              </h2>
              <p className="text-gray-600 mb-2">
                {animationType === 'in' 
                  ? `Started at ${startTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
                  : `Duration: ${formatTime(elapsedTime)}`
                }
              </p>
              {animationType === 'out' && (
                <p className="text-gray-500 text-sm">
                  Break time: {Math.floor(breakTimeSeconds / 60)}m {breakTimeSeconds % 60}s
                </p>
              )}
            </div>
          </div>
        )}

        {/* Work History */}
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700 border-b pb-2">
            <BarChart size={18} className="text-indigo-600" /> Recent Work Sessions
          </h2>
          <div className="bg-white rounded-md overflow-hidden border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Break</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workSessions.length > 0 ? (
                  workSessions.map((session, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm text-gray-700 font-medium">{session.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <span className="inline-flex items-center">
                          {session.startTime} <ArrowRight size={14} className="inline mx-1 text-gray-400" /> {session.endTime}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{session.duration}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{session.breakDuration}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{session.overtimeHours}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-6 text-sm text-center text-gray-500 italic">No work sessions recorded yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTracking;