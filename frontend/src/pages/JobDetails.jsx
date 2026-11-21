import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles 
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { api } from '../services/api';
import ContactCard from '../components/ContactCard';
import MatchScore from '../components/MatchScore';
import { toast } from 'sonner';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { resumeProfile, discoveredJobs, toggleSaveJob, isJobSaved } = useResume();

  const [job, setJob] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [contacts, setContacts] = useState(null);
  const [isLoadingMatch, setIsLoadingMatch] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);

  useEffect(() => {
    // Look up job in discoveredJobs
    const foundJob = discoveredJobs.find((j) => (j.job_id || j.id) === id);
    if (foundJob) {
      setJob(foundJob);
      fetchMatchAndContacts(foundJob);
    } else {
      // Check saved jobs
      try {
        const saved = JSON.parse(localStorage.getItem('jh_saved_jobs') || '[]');
        const fromSaved = saved.find((j) => (j.job_id || j.id) === id);
        if (fromSaved) {
          setJob(fromSaved);
          fetchMatchAndContacts(fromSaved);
        }
      } catch (e) {}
    }
  }, [id]);

  const fetchMatchAndContacts = async (currentJob) => {
    // 1. Detailed AI Match Evaluation
    if (resumeProfile) {
      setIsLoadingMatch(true);
      try {
        const matchRes = await api.matchJob(resumeProfile, currentJob);
        setMatchData(matchRes);
      } catch (err) {
        console.error('Match evaluation error:', err);
      } finally {
        setIsLoadingMatch(false);
      }
    }

    // 2. Contact Discovery
    setIsLoadingContacts(true);
    try {
      const contactRes = await api.findContacts(currentJob.company, currentJob.title);
      setContacts(contactRes);
    } catch (err) {
      console.error('Contact search error:', err);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  if (!job) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Job Not Found</h2>
        <p className="text-sm text-slate-500">The requested job details are not available or the session refreshed.</p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </Link>
      </div>
    );
  }

  const saved = isJobSaved(job.job_id || job.id);
  const displayScore = matchData?.match_score ?? job.match_score ?? 75;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Back button & Action buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              toggleSaveJob(job);
              toast.success(saved ? 'Removed from saved jobs' : 'Saved to your pipeline!');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              saved
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {saved ? <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-600" /> : <Bookmark className="w-4 h-4" />}
            <span>{saved ? 'Saved in Pipeline' : 'Save Job'}</span>
          </button>

          {job.job_url && (
            <a
              href={job.job_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-sm shadow-indigo-600/30 transition-all"
            >
              <span>Apply Directly</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {job.title}
              </h1>
              {job.employment_type && (
                <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                  {job.employment_type}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-5 text-sm text-slate-600">
              <span className="flex items-center gap-1.5 font-bold text-slate-900">
                <Building2 className="w-4 h-4 text-slate-400" />
                {job.company}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {job.location || 'Remote'}
              </span>
              {job.posted_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Posted {new Date(job.posted_at).toLocaleDateString()}
                </span>
              )}
              {job.salary && (
                <span className="font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                  {job.salary}
                </span>
              )}
            </div>
          </div>

          {/* Compatibility Score Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col items-center justify-center min-w-[160px] text-center shrink-0">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Match Score
            </span>
            <div className="text-3xl font-black text-indigo-900">{displayScore}%</div>
            <span className="text-[11px] font-semibold text-indigo-600 mt-1">
              {matchData?.category || (displayScore >= 80 ? 'Strong Match' : displayScore >= 60 ? 'Good Match' : 'Potential Match')}
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Left (Job & Match Analysis), Right (Recruiter Contacts & Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Full Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Match Explanation Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3>AI Compatibility Breakdown</h3>
            </div>

            {isLoadingMatch ? (
              <p className="text-xs text-slate-500 py-4 animate-pulse">Running semantic evaluation against resume...</p>
            ) : matchData ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {matchData.explanation}
                </p>

                {/* Matching vs Missing Skills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Matching Skills ({matchData.matching_skills?.length || 0})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {matchData.matching_skills?.map((s, i) => (
                        <span key={i} className="text-xs bg-emerald-100/80 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-md">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Missing / Recommended Skills ({matchData.missing_skills?.length || 0})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {matchData.missing_skills?.map((s, i) => (
                        <span key={i} className="text-xs bg-rose-100/80 text-rose-800 font-semibold px-2.5 py-0.5 rounded-md">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Compatibility Indicators */}
                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                    <span className="text-slate-500">Experience Compatibility:</span>
                    <span className="font-semibold text-slate-800">{matchData.experience_compatibility || 'Compatible'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                    <span className="text-slate-500">Education Compatibility:</span>
                    <span className="font-semibold text-slate-800">{matchData.education_compatibility || 'Compatible'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                {resumeProfile
                  ? 'Weighted match score calculated based on extracted skills and experience.'
                  : 'Upload your resume in the "My Resume" tab to unlock in-depth AI skill comparisons.'}
              </p>
            )}
          </div>

          {/* Job Description Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-lg pb-3 border-b border-slate-100">
              Job Description
            </h3>

            <div 
              className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html: job.description
                  ? job.description.replace(/<[^>]*>?/gm, (match) => {
                      // Allow clean p, br, b, ul, li tags if backend sanitized
                      return ['<br>', '<p>', '</p>', '<ul>', '</ul>', '<li>', '</li>', '<b>', '</b>'].includes(match)
                        ? match
                        : '';
                    })
                  : 'No detailed description provided.',
              }}
            />
          </div>
        </div>

        {/* Right Column: Company & Recruiter Discovery */}
        <div className="space-y-6">
          {/* Recruiter / Hiring Contact Card */}
          <ContactCard contacts={contacts} company={job.company} isLoading={isLoadingContacts} />

          {/* Scoring Methodology Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
              Scoring Weights (Configurable)
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Technical Skills Match</span>
                <span className="font-bold text-slate-800">40%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '40%' }}></div>
              </div>

              <div className="flex justify-between pt-1">
                <span className="text-slate-600">Experience Compatibility</span>
                <span className="font-bold text-slate-800">25%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
              </div>

              <div className="flex justify-between pt-1">
                <span className="text-slate-600">Responsibilities & Role</span>
                <span className="font-bold text-slate-800">20%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '20%' }}></div>
              </div>

              <div className="flex justify-between pt-1">
                <span className="text-slate-600">Education & Background</span>
                <span className="font-bold text-slate-800">15%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
