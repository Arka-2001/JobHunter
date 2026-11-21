import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  RefreshCw, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Wrench, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { api } from '../services/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const MyResume = () => {
  const { resumeProfile, setResumeProfile, clearResume } = useResume();
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    // Validation
    const validTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'application/msword'
    ];
    const isDocx = file.name.endsWith('.docx') || file.name.endsWith('.doc');
    const isPdf = file.name.endsWith('.pdf');

    if (!isPdf && !isDocx && !validTypes.includes(file.type)) {
      toast.error('Unsupported file format. Please upload a PDF or DOCX file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds the 10 MB limit.');
      return;
    }

    setSelectedFileName(file.name);
    setIsUploading(true);

    try {
      toast.info('Extracting & analyzing resume with AI...');
      const profile = await api.analyzeResume(file);
      setResumeProfile(profile);
      toast.success('Resume analyzed successfully!');
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.detail || err.message || 'Failed to process resume';
      toast.error(`Processing error: ${errMsg}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Resume & Profile</h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload your resume. Our stateless AI extracts your full skill profile to find matching jobs.
          </p>
        </div>

        {resumeProfile && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace Resume</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Clear your uploaded resume profile?')) {
                  clearResume();
                  toast.success('Resume cleared');
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
      />

      {/* Upload Drop Zone (Shown if no profile or when actively uploading) */}
      {!resumeProfile && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
              : 'border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50/50'
          }`}
        >
          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-sm">
              {isUploading ? (
                <RefreshCw className="w-8 h-8 animate-spin" />
              ) : (
                <UploadCloud className="w-8 h-8" />
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              {isUploading ? 'Extracting Resume Data...' : 'Drop your resume here, or browse'}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Supports <strong className="text-slate-700">PDF</strong> or <strong className="text-slate-700">DOCX</strong> up to 10 MB.
            </p>
            <p className="text-xs text-slate-400 mt-2 bg-slate-100 px-3 py-1 rounded-full">
              Stateless processing: your file is automatically deleted after parsing.
            </p>
            {selectedFileName && (
              <span className="mt-4 text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                Selected: {selectedFileName}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Extracted Profile Display */}
      {resumeProfile && (
        <div className="space-y-6">
          {/* Top Banner Card: Personal Details & Fast Action */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-indigo-500/20 shrink-0">
                {resumeProfile.personal_info?.name?.charAt(0) || 'U'}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">
                    {resumeProfile.personal_info?.name || 'Candidate'}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Extracted
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 pt-0.5">
                  {resumeProfile.personal_info?.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {resumeProfile.personal_info.email}
                    </span>
                  )}
                  {resumeProfile.personal_info?.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {resumeProfile.personal_info.phone}
                    </span>
                  )}
                  {resumeProfile.personal_info?.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {resumeProfile.personal_info.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/jobs')}
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm shadow-indigo-600/30 transition-all shrink-0"
            >
              <span>Search Matching Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Grid of Extracted Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Skills & Roles */}
            <div className="lg:col-span-2 space-y-6">
              {/* Technical Skills Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
                  <Wrench className="w-5 h-5 text-indigo-600" />
                  <h3>Extracted Technical Skills</h3>
                </div>

                {/* Languages */}
                {resumeProfile.skills?.programming_languages?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Programming Languages
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {resumeProfile.skills.programming_languages.map((skill, i) => (
                        <span key={i} className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-3 py-1 rounded-lg border border-indigo-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Frameworks */}
                {resumeProfile.skills?.frameworks?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Frameworks & Libraries
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {resumeProfile.skills.frameworks.map((skill, i) => (
                        <span key={i} className="text-xs bg-violet-50 text-violet-700 font-semibold px-3 py-1 rounded-lg border border-violet-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Databases */}
                {resumeProfile.skills?.databases?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Databases
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {resumeProfile.skills.databases.map((skill, i) => (
                        <span key={i} className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-3 py-1 rounded-lg border border-emerald-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tools & Cloud */}
                {resumeProfile.skills?.tools?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Tools & DevOps
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {resumeProfile.skills.tools.map((skill, i) => (
                        <span key={i} className="text-xs bg-slate-100 text-slate-700 font-medium px-3 py-1 rounded-lg">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Projects Card */}
              {resumeProfile.projects?.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
                    <FolderGit2 className="w-5 h-5 text-indigo-600" />
                    <h3>Featured Projects ({resumeProfile.projects.length})</h3>
                  </div>

                  <div className="space-y-4">
                    {resumeProfile.projects.map((proj, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-slate-900 text-sm">{proj.name || proj.title || `Project ${idx+1}`}</h4>
                          {proj.technologies?.length > 0 && (
                            <span className="text-[11px] text-slate-500 font-medium">
                              {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {proj.description || 'Project details extracted from resume.'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Roles, Experience, Education */}
            <div className="space-y-6">
              {/* Suggested Job Roles */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h3>Target Roles</h3>
                </div>
                <p className="text-xs text-slate-500">AI-recommended titles based on your skillset:</p>
                <div className="flex flex-col gap-2 pt-1">
                  {resumeProfile.suggested_roles?.map((role, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100/60 text-xs font-semibold text-indigo-900">
                      <span>{role}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Summary */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <h3>Experience Level</h3>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Assessed Level:</span>
                    <span className="font-semibold text-slate-800">{resumeProfile.experience?.level || 'Fresher'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Estimated Total:</span>
                    <span className="font-semibold text-slate-800">{resumeProfile.experience?.total_years || 0} Years</span>
                  </div>
                </div>
              </div>

              {/* Education */}
              {resumeProfile.education?.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <h3>Education</h3>
                  </div>
                  <div className="space-y-2">
                    {resumeProfile.education.map((edu, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl text-xs space-y-0.5">
                        <div className="font-semibold text-slate-800">{edu.degree || edu.qualification || 'Degree'}</div>
                        <div className="text-slate-500">{edu.institution || edu.school || 'University'}</div>
                        {edu.year && <div className="text-slate-400 text-[11px]">{edu.year}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyResume;
