import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ResumeProvider } from './context/ResumeContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MyResume from './pages/MyResume';
import FindJobs from './pages/FindJobs';
import JobDetails from './pages/JobDetails';
import SavedJobs from './pages/SavedJobs';

function App() {
  return (
    <ResumeProvider>
      <Router>
        <div className="flex min-h-screen bg-slate-50">
          {/* Left Navigation Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/resume" element={<MyResume />} />
                <Route path="/jobs" element={<FindJobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/saved" element={<SavedJobs />} />
              </Routes>
            </main>
          </div>
        </div>
        <Toaster position="top-right" richColors closeButton />
      </Router>
    </ResumeProvider>
  );
}

export default App;
