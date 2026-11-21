import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  RefreshCw, 
  Briefcase 
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { api } from '../services/api';
import JobCard from '../components/JobCard';
import { toast } from 'sonner';

const FindJobs = () => {
  const { 
    resumeProfile, 
    discoveredJobs, 
    updateDiscoveredJobs, 
    toggleSaveJob, 
    isJobSaved,
    isLoadingJobs,
    setIsLoadingJobs
  } = useResume();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [workMode, setWorkMode] = useState('all'); // all, remote, hybrid, onsite
  const [minMatchScore, setMinMatchScore] = useState(0);
  const [sortBy, setSortBy] = useState('match'); // match, latest, company
  const [isSearching, setIsSearching] = useState(false);

  // Auto-search when page opens if no jobs discovered yet and resumeProfile exists
  useEffect(() => {
    if (discoveredJobs.length === 0 && resumeProfile) {
      handleSearchJobs();
    }
  }, [resumeProfile]);

  const handleSearchJobs = async () => {
    setIsSearching(true);
    setIsLoadingJobs(true);
    try {
      toast.info('Discovering active job listings from providers...');
      const response = await api.searchJobs(resumeProfile, {
        query: searchTerm,
        workMode: workMode !== 'all' ? workMode : undefined,
      });

      const jobs = response.jobs || response || [];
      updateDiscoveredJobs(jobs);
      toast.success(`Discovered ${jobs.length} jobs with compatibility analysis!`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to discover jobs. Showing cached results if available.');
    } finally {
      setIsSearching(false);
      setIsLoadingJobs(false);
    }
  };

  // Filtered and Sorted Jobs
  const filteredJobs = useMemo(() => {
    let result = [...discoveredJobs];

    // Search query filter (title, company, description, skills)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (job) =>
          job.title?.toLowerCase().includes(q) ||
          job.company?.toLowerCase().includes(q) ||
          job.description?.toLowerCase().includes(q) ||
          (job.required_skills && job.required_skills.some((s) => s.toLowerCase().includes(q)))
      );
    }

    // Work Mode Filter
    if (workMode !== 'all') {
      result = result.filter((job) => {
        const mode = (job.work_mode || job.location || '').toLowerCase();
        if (workMode === 'remote') return mode.includes('remote');
        if (workMode === 'hybrid') return mode.includes('hybrid');
        if (workMode === 'onsite') return !mode.includes('remote');
        return true;
      });
    }

    // Minimum Match Score Filter
    if (minMatchScore > 0) {
      result = result.filter((job) => (job.match_score || 0) >= minMatchScore);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'match') {
        return (b.match_score || 0) - (a.match_score || 0);
      }
      if (sortBy === 'latest') {
        const dateA = a.posted_at ? new Date(a.posted_at).getTime() : 0;
        const dateB = b.posted_at ? new Date(b.posted_at).getTime() : 0;
        return dateB - dateA;
      }
      if (sortBy === 'company') {
        return (a.company || '').localeCompare(b.company || '');
      }
      return 0;
    });

    return result;
  }, [discoveredJobs, searchTerm, workMode, minMatchScore, sortBy]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Find Jobs</h1>
          <p className="text-sm text-slate-500 mt-1">
            Aggregated openings evaluated against your profile using our weighted matching engine.
          </p>
        </div>

        <button
          onClick={handleSearchJobs}
          disabled={isSearching}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm shadow-indigo-600/30 transition-all disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${isSearching ? 'animate-spin' : ''}`} />
          <span>{isSearching ? 'Searching Providers...' : 'Discover & Refresh Jobs'}</span>
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Main Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, skill (e.g. Python, React), or company..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Work Mode Dropdown */}
          <div>
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="all">All Work Modes</option>
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="match">Sort by: Highest Match</option>
              <option value="latest">Sort by: Latest Posted</option>
              <option value="company">Sort by: Company Name</option>
            </select>
          </div>
        </div>

        {/* Filter Slider: Min Match Score */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">Minimum Match Score:</span>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={minMatchScore}
              onChange={(e) => setMinMatchScore(Number(e.target.value))}
              className="w-32 accent-indigo-600 cursor-pointer"
            />
            <span className="font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-md border border-indigo-100">
              {minMatchScore}%+
            </span>
          </div>

          <div className="text-slate-400">
            Showing <strong className="text-slate-700">{filteredJobs.length}</strong> of{' '}
            <strong className="text-slate-700">{discoveredJobs.length}</strong> jobs
          </div>
        </div>
      </div>

      {/* Jobs Listing */}
      {isSearching ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">Querying Verified Job Boards...</h3>
          <p className="text-xs text-slate-500">Checking Arbeitnow, Remotive, and Adzuna APIs with real-time scoring.</p>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job) => (
            <JobCard key={job.job_id || job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No Jobs Match Your Filters</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search terms, work mode, or score threshold, or click "Discover & Refresh Jobs" above to fetch new postings.
          </p>
        </div>
      )}
    </div>
  );
};

export default FindJobs;
