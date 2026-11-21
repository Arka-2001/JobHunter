import React, { useState, useRef } from 'react';
import { UploadCloud, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { useResume } from '../context/ResumeContext';
import { toast } from 'sonner';

const ResumeUpload = ({ onUploadSuccess }) => {
  const { setResumeProfile } = useResume();
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileInputRef = useRef(null);

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
    const isDocx = file.name.endsWith('.docx') || file.name.endsWith('.doc');
    const isPdf = file.name.endsWith('.pdf');

    if (!isPdf && !isDocx) {
      toast.error('Unsupported file format. Please upload a PDF or DOCX file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10 MB limit.');
      return;
    }

    setSelectedFileName(file.name);
    setIsUploading(true);

    try {
      toast.info('Extracting & analyzing resume with AI...');
      const profile = await api.analyzeResume(file);
      setResumeProfile(profile);
      toast.success('Resume analyzed successfully!');
      if (onUploadSuccess) onUploadSuccess(profile);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.detail || err.message || 'Failed to process resume';
      toast.error(`Processing error: ${errMsg}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
      />

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
            : 'border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50/50'
        }`}
      >
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 shadow-xs">
            {isUploading ? (
              <RefreshCw className="w-7 h-7 animate-spin" />
            ) : (
              <UploadCloud className="w-7 h-7" />
            )}
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {isUploading ? 'Extracting Resume Data...' : 'Upload your PDF or DOCX resume'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Drag and drop your file here, or click to browse (up to 10 MB).
          </p>
          <p className="text-[11px] text-slate-400 mt-2 bg-slate-100 px-3 py-1 rounded-full">
            Stateless processing: temporary file is immediately discarded after parsing.
          </p>
          {selectedFileName && (
            <span className="mt-3 text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
              Selected: {selectedFileName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
