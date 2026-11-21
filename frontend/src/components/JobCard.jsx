import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink 
} from 'lucide-react';
import MatchScore from './MatchScore';
import { useResume } from '../context/ResumeContext';
import { toast } from 'sonner';

const JobCard = ({ job }) => {
  const { toggleSaveJob, isJobSaved } = useResume();
  const jobId = job.job_id || job.id;
  const saved = isJobSaved(jobId);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between gap-4 group">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Left: Info */}
        <div className="flex items-start gap-4">
          {job.company_logo ? (
            <img
              src={job.company_logo}
              alt={job.company}
              className="w-12 h-12 rounded-xl object-contain border border-slate-100 bg-slate-50 p-1 shrink-0"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 shrink-0">
              {job.company?.charAt(0) || 'J'}
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={`/jobs/${jobId}`}
                className="font-bold text-base md:text-lg text-slate-900 group-hover:text-indigo-600 transition-colors"
              >
                {job.title}
              </Link>
              {job.employment_type && (
                <span className="text-[11px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-md">
                  {job.employment_type}
                </span>
              )}
              {job.source && (
                <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
                  via {job.source}
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
              {job.posted_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(job.posted_at).toLocaleDateString()}
                </span>
              )}
              {job.salary && (
                <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {job.salary}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Score & Save Button */}
        <div className="flex items-center md:flex-col md:items-end justify-between gap-2 shrink-0">
          <MatchScore score={job.match_score ?? 75} />

          <button
            onClick={() => {
              toggleSaveJob(job);
              toast.success(saved ? 'Removed from saved jobs' : 'Saved to your pipeline!');
            }}
            className={`p-2 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
              saved
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
            }`}
            title={saved ? 'Remove from Saved' : 'Save Job'}
          >
            {saved ? (
              <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-600" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Skills */}
      {job.required_skills && job.required_skills.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Skills:</span>
          {job.required_skills.slice(0, 6).map((skill, idx) => (
            <span
              key={idx}
              className="text-[11px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md"
            >
              {skill}
            </span>
          ))}
          {job.required_skills.length > 6 && (
            <span className="text-[10px] text-slate-400 font-medium">
              +{job.required_skills.length - 6} more
            </span>
          )}
        </div>
      )}

      {/* Actions Footer */}
      <div className="flex items-center justify-between pt-1">
        <Link
          to={`/jobs/${jobId}`}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          <span>View Compatibility & Recruiter Contacts &rarr;</span>
        </Link>

        {job.job_url && (
          <a
            href={job.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors"
          >
            <span>Apply on {job.source || 'Board'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

export default JobCard;
