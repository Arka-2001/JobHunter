import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookmarkCheck, 
  Trash2, 
  ExternalLink, 
  Building2, 
  MapPin, 
  Calendar, 
  Edit3, 
  Check, 
  Briefcase,
  Sparkles,
  FileText
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { toast } from 'sonner';

const STATUS_OPTIONS = [
  { value: 'Interested', label: 'Interested', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { value: 'To Apply', label: 'To Apply', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { value: 'Applied', label: 'Applied', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'Interview', label: 'Interview', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'Rejected', label: 'Rejected', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { value: 'Offer Received', label: 'Offer Received', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
];

const SavedJobs = () => {
  const { savedJobs, toggleSaveJob, updateJobStatus } = useResume();
  const [editingNoteJobId, setEditingNoteJobId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = savedJobs.filter((j) => {
    if (filterStatus === 'all') return true;
    return j.status === filterStatus;
  });

  const handleStartEditNote = (job) => {
    setEditingNoteJobId(job.job_id || job.id);
    setNoteText(job.notes || '');
  };

  const handleSaveNote = (jobId) => {
    const targetJob = savedJobs.find((j) => (j.job_id || j.id) === jobId);
    updateJobStatus(jobId, targetJob?.status || 'Interested', noteText);
    setEditingNoteJobId(null);
    toast.success('Note saved in local storage!');
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Saved Jobs & Pipeline</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your application stages and personal interview notes. Stored locally on your browser.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter Stage:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="py-1.5 px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Stages ({savedJobs.length})</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Saved Jobs */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((job) => {
            const jobId = job.job_id || job.id;
            const isEditing = editingNoteJobId === jobId;
            const currentStatusObj = STATUS_OPTIONS.find((s) => s.value === job.status) || STATUS_OPTIONS[0];

            return (
              <div
                key={jobId}
                className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left: Job details */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/jobs/${jobId}`}
                        className="font-bold text-lg text-slate-900 hover:text-indigo-600 transition-colors"
                      >
                        {job.title}
                      </Link>
                      {job.match_score !== undefined && (
                        <span className="text-[11px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {job.match_score}% Match
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location || 'Remote'}
                      </span>
                      {job.saved_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Saved {new Date(job.saved_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Stage selector & Remove */}
                  <div className="flex items-center gap-3">
                    {/* Status Dropdown */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 font-medium">Status:</span>
                      <select
                        value={job.status || 'Interested'}
                        onChange={(e) => {
                          updateJobStatus(jobId, e.target.value);
                          toast.success(`Updated stage to ${e.target.value}`);
                        }}
                        className={`text-xs font-semibold py-1.5 px-3 rounded-xl border focus:outline-hidden ${currentStatusObj.color}`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        toggleSaveJob(job);
                        toast.success('Removed from saved jobs');
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove from Saved Jobs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add private note (e.g. Applied via email, follow up next Tuesday)..."
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                          onClick={() => handleSaveNote(jobId)}
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-600">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="italic line-clamp-1">
                          {job.notes ? `"${job.notes}"` : 'No personal notes added yet.'}
                        </span>
                        <button
                          onClick={() => handleStartEditNote(job)}
                          className="text-indigo-600 hover:text-indigo-800 font-medium ml-1 inline-flex items-center gap-0.5"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{job.notes ? 'Edit' : 'Add Note'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      to={`/jobs/${jobId}`}
                      className="text-xs font-semibold text-slate-700 hover:text-indigo-600"
                    >
                      View Details
                    </Link>

                    {job.job_url && (
                      <a
                        href={job.job_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        <span>Application Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center space-y-3">
          <BookmarkCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">Your Saved Jobs Pipeline is Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When browsing jobs, click the bookmark icon to track opportunities, interview stages, and notes here.
          </p>
          <Link
            to="/jobs"
            className="mt-3 inline-flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <span>Explore Jobs</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
