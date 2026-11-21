import React, { createContext, useContext, useState, useEffect } from 'react';

const ResumeContext = createContext(null);

export const ResumeProvider = ({ children }) => {
  // Resume Profile State (persisted in localStorage for convenience)
  const [resumeProfile, setResumeProfileState] = useState(() => {
    try {
      const saved = localStorage.getItem('jh_resume_profile');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Discovered Jobs State
  const [discoveredJobs, setDiscoveredJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('jh_discovered_jobs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Saved Jobs State (localStorage)
  const [savedJobs, setSavedJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('jh_saved_jobs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  // Sync resumeProfile to localStorage
  const setResumeProfile = (profile) => {
    setResumeProfileState(profile);
    if (profile) {
      localStorage.setItem('jh_resume_profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('jh_resume_profile');
    }
  };

  // Sync discoveredJobs to localStorage
  const updateDiscoveredJobs = (jobs) => {
    setDiscoveredJobs(jobs);
    try {
      localStorage.setItem('jh_discovered_jobs', JSON.stringify(jobs));
    } catch (e) {
      console.warn('Could not cache discovered jobs to localStorage', e);
    }
  };

  // Save / Update a job in Saved Jobs
  const toggleSaveJob = (job) => {
    setSavedJobs((prev) => {
      const exists = prev.some((j) => (j.job_id || j.id) === (job.job_id || job.id));
      let updated;
      if (exists) {
        updated = prev.filter((j) => (j.job_id || j.id) !== (job.job_id || job.id));
      } else {
        const newEntry = {
          ...job,
          saved_at: new Date().toISOString(),
          status: 'Interested', // Interested, To Apply, Applied, Interview, Rejected, Offer Received
          notes: '',
        };
        updated = [newEntry, ...prev];
      }
      localStorage.setItem('jh_saved_jobs', JSON.stringify(updated));
      return updated;
    });
  };

  const updateJobStatus = (jobId, newStatus, notes = null) => {
    setSavedJobs((prev) => {
      const updated = prev.map((j) => {
        if ((j.job_id || j.id) === jobId) {
          return {
            ...j,
            status: newStatus,
            ...(notes !== null ? { notes } : {}),
            updated_at: new Date().toISOString(),
          };
        }
        return j;
      });
      localStorage.setItem('jh_saved_jobs', JSON.stringify(updated));
      return updated;
    });
  };

  const isJobSaved = (jobId) => {
    return savedJobs.some((j) => (j.job_id || j.id) === jobId);
  };

  const clearResume = () => {
    setResumeProfile(null);
    updateDiscoveredJobs([]);
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeProfile,
        setResumeProfile,
        discoveredJobs,
        updateDiscoveredJobs,
        savedJobs,
        toggleSaveJob,
        updateJobStatus,
        isJobSaved,
        clearResume,
        isLoadingJobs,
        setIsLoadingJobs,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
