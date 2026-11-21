import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // 45 seconds for AI and job fetching
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Check backend health
  checkHealth: async () => {
    const res = await apiClient.get('/api/health');
    return res.data;
  },

  // Upload and analyze resume
  analyzeResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/api/resume/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  // Search jobs matching the resume profile
  searchJobs: async (resumeProfile, filters = {}) => {
    const res = await apiClient.post('/api/jobs/search', {
      profile: resumeProfile,
      filters: filters,
    });
    return res.data;
  },

  // Match resume against specific job
  matchJob: async (resumeProfile, jobListing) => {
    const res = await apiClient.post('/api/jobs/match', {
      profile: resumeProfile,
      job: jobListing,
    });
    return res.data;
  },

  // Find recruiter & contact info
  findContacts: async (companyName, jobTitle) => {
    const res = await apiClient.post('/api/contacts/search', {
      company: companyName,
      title: jobTitle,
    });
    return res.data;
  },
};

export default api;
