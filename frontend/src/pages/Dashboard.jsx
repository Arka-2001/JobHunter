import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Sparkles, 
  BookmarkCheck, 
  Send, 
  UploadCloud, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  MapPin,
  TrendingUp,
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';

const Dashboard = () => {
  const { resumeProfile, discoveredJobs, savedJobs } = useResume();

  const totalDiscovered = discoveredJobs.length;
  const highMatchJobs = discoveredJobs.filter((j) => (j.match_score || 0) >= 70);
  const totalSaved = savedJobs.length;
  const totalApplied = savedJobs.filter((j) => j.status === 'Applied' || j.status === 'Interview' || j.status === 'Offer Received').length;

  const recentMatches = discoveredJobs.slice(0, 4);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Banner / Welcome */}
      <div className="bg-gradient-to-r from-navy-900 via-indigo-950 to-navy-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-md">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Job Hunter Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {resumeProfile?.personal_info?.name
              ? `Welcome back, ${resumeProfile.personal_info.name}!`
              : 'Discover Your Best Job Matches in Seconds'}
          </h1>
          <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
            {resumeProfile
              ? `Your profile is loaded with ${
                  (resumeProfile.skills?.programming_languages?.length || 0) +
                  (resumeProfile.skills?.frameworks?.length || 0) +
                  (resumeProfile.skills?.tools?.length || 0)
                } technical skills. Discover matched roles and verified company recruiters.`
              : 'Upload your PDF or DOCX resume to extract technical skills, discover real job openings, and calculate weighted compatibility scores.'}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {resumeProfile ? (
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
              >
                <span>Find Matching Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/resume"
                className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Resume</span>
              </Link>
            )}
            <Link
              to="/saved"
              className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>Saved Jobs ({totalSaved})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jobs Discovered</span>
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalDiscovered}</span>
            <span className="text-xs text-slate-400">from active APIs</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">High Match Jobs</span>
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{highMatchJobs.length}</span>
            <span className="text-xs text-emerald-600 font-semibold">&gt; 70% Match</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Saved Pipeline</span>
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <BookmarkCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalSaved}</span>
            <span className="text-xs text-slate-400">in localStorage</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Applied & Interview</span>
            <div className="p-2.5 rounded-lg bg-violet-50 text-violet-600">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalApplied}</span>
            <span className="text-xs text-slate-400">tracked stages</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Resume Overview + Recent Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Resume Profile Summary Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Resume Status</h3>
                  <p className="text-xs text-slate-500">Current candidate extract</p>
                </div>
              </div>
              {resumeProfile ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <AlertTriangle className="w-3 h-3" /> Pending
                </span>
              )}
            </div>

            {resumeProfile ? (
              <div className="mt-5 space-y-4">
                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase">Candidate</span>
                  <p className="font-semibold text-slate-900 text-base">{resumeProfile.personal_info?.name || 'Candidate'}</p>
                  <p className="text-xs text-slate-500">{resumeProfile.personal_info?.email || 'No email provided'}</p>
                  {resumeProfile.personal_info?.location && (
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {resumeProfile.personal_info.location}
                    </p>
                  )}
                </div>

                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase">Experience</span>
                  <p className="text-sm font-medium text-slate-800">
                    {resumeProfile.experience?.level || 'Fresher / Intermediate'} ({resumeProfile.experience?.total_years || 0} years)
                  </p>
                </div>

                <div>
                  <span className="text-xs text-slate-400 font-semibold uppercase">Top Skills</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {[
                      ...(resumeProfile.skills?.programming_languages || []),
                      ...(resumeProfile.skills?.frameworks || []),
                    ].slice(0, 8).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2 py-0.5 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {resumeProfile.suggested_roles?.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-400 font-semibold uppercase">Suggested Roles</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {resumeProfile.suggested_roles.map((role, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded-md border border-indigo-100"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="my-8 text-center py-6 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No Resume Loaded</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Upload your resume in PDF or DOCX format to enable AI matching and job searches.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              to="/resume"
              className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              {resumeProfile ? 'Manage Resume Profile' : 'Upload Resume Now'}
            </Link>
          </div>
        </div>

        {/* Right Column: Recent Discovered Jobs */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Top Matching Jobs</h3>
                <p className="text-xs text-slate-500">Live listings ranked by AI compatibility</p>
              </div>
              <Link
                to="/jobs"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View all ({totalDiscovered})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentMatches.length > 0 ? (
              <div className="divide-y divide-slate-100 mt-2">
                {recentMatches.map((job) => (
                  <div key={job.job_id || job.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 p-2 rounded-xl transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/jobs/${job.job_id || job.id}`}
                          className="font-semibold text-slate-900 hover:text-indigo-600 text-sm line-clamp-1"
                        >
                          {job.title}
                        </Link>
                        {job.employment_type && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-1.5 py-0.5 rounded">
                            {job.employment_type}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.location || 'Remote'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {job.match_score !== undefined && (
                        <div className="flex items-center gap-1.5">
                          <div 
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              job.match_score >= 80
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : job.match_score >= 60
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {job.match_score}% Match
                          </div>
                        </div>
                      )}

                      <Link
                        to={`/jobs/${job.job_id || job.id}`}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-slate-700">No Jobs Discovered Yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {resumeProfile
                    ? 'Head to the Find Jobs tab and click "Discover Matching Jobs" to fetch active opportunities.'
                    : 'Upload your resume first, or jump to Find Jobs to search by title and skill.'}
                </p>
                <Link
                  to="/jobs"
                  className="mt-4 inline-flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  <span>Go to Find Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>External Providers: Arbeitnow, Remotive, Adzuna</span>
            <span>Stateless Verification</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
