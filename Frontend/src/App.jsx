import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  return (
    <Router> {/* ✅ Fix: Using BrowserRouter instead of Router */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
