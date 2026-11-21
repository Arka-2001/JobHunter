import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  BookmarkCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';

const Sidebar = () => {
  const { resumeProfile, savedJobs } = useResume();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/resume', label: 'My Resume', icon: FileText, badge: resumeProfile ? 'Active' : null },
    { path: '/jobs', label: 'Find Jobs', icon: Briefcase },
    { path: '/saved', label: 'Saved Jobs', icon: BookmarkCheck, count: savedJobs.length },
  ];

  return (
    <aside className="w-64 bg-navy-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800/80 bg-navy-950/40">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-base text-white tracking-tight flex items-center gap-1.5">
            JobHunter <span className="text-xs bg-indigo-500/20 text-indigo-400 font-semibold px-1.5 py-0.5 rounded border border-indigo-500/30">AI</span>
          </h1>
          <p className="text-[11px] text-slate-400">Smart Resume Matching</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 space-y-1">
        <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-medium px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {item.badge}
                </span>
              )}
              {typeof item.count === 'number' && item.count > 0 && (
                <span className="text-[11px] bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Resume Status Card in Sidebar */}
      <div className="p-4 m-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
        <div className="text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
          <span>Active Resume</span>
          <span className={`w-2 h-2 rounded-full ${resumeProfile ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
        </div>
        <p className="text-xs text-slate-400 line-clamp-1">
          {resumeProfile?.personal_info?.name || 'No resume uploaded yet'}
        </p>
        <NavLink
          to="/resume"
          className="mt-3 block text-center text-xs font-medium py-1.5 px-3 rounded-lg bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors"
        >
          {resumeProfile ? 'View / Change Resume' : 'Upload Resume'}
        </NavLink>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Stateless Engine</span>
        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">v1.0</span>
      </div>
    </aside>
  );
};

export default Sidebar;
