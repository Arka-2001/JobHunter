import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Bell, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Briefcase,
  ExternalLink
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { api } from '../services/api';

const Navbar = () => {
  const location = useLocation();
  const { resumeProfile, discoveredJobs } = useResume();
  const [backendOnline, setBackendOnline] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const checkServer = async () => {
      try {
        await api.checkHealth();
        if (isMounted) setBackendOnline(true);
      } catch (e) {
        if (isMounted) setBackendOnline(false);
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard Overview';
      case '/resume':
        return 'My Resume & Profile Extraction';
      case '/jobs':
        return 'Job Discovery & AI Matching';
      case '/saved':
        return 'Saved Jobs & Application Tracking';
      default:
        if (location.pathname.startsWith('/jobs/')) return 'Job Details & Compatibility';
        return 'Job Hunter Portal';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">{getPageTitle()}</h2>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Backend Health Badge */}
        <div 
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            backendOnline === true
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : backendOnline === false
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}
          title={backendOnline ? 'FastAPI Backend Online' : 'Checking backend or backend offline'}
        >
          <span 
            className={`w-2 h-2 rounded-full ${
              backendOnline === true 
                ? 'bg-emerald-500 animate-pulse' 
                : backendOnline === false 
                ? 'bg-amber-500' 
                : 'bg-slate-400'
            }`} 
          />
          <span>{backendOnline ? 'Backend Ready' : backendOnline === false ? 'Backend Offline' : 'Connecting...'}</span>
        </div>

        {/* Resume pill */}
        {resumeProfile ? (
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
            <span className="max-w-[150px] truncate">{resumeProfile.personal_info?.name || 'Resume Loaded'}</span>
          </div>
        ) : (
          <Link
            to="/resume"
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm shadow-indigo-600/20"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Resume</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
