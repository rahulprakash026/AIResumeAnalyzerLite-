import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UploadCloud, File, Briefcase, ChevronRight, Loader2 } from 'lucide-react';
import { resumeService } from '../services/api';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (validTypes.includes(droppedFile.type)) {
        setFile(droppedFile);
        setError('');
      } else {
        setError('Please upload a PDF, DOC, or DOCX file.');
      }
    }
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a resume first.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      // Backend api might just take file, then another endpoint takes Job Desc, or both.
      // Assuming backend /api/resumes/ accepts multipart with file.
      // If we need job description, we might append it or send it to /api/jobs/
      const uploadResponse = await resumeService.uploadResume(formData);
      
      // Navigate to analysis page with the newly created resume ID
      if (uploadResponse.id) {
        navigate(`/analysis/${uploadResponse.id}`);
      } else {
        // Fallback or handle differently based on backend response
        navigate('/analysis/1'); // default fallback for now
      }
    } catch (err) {
      console.error(err);
      setError('Failed to upload and analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-gray-400">Upload your resume and get instant ATS feedback.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/20 text-primary rounded-lg">
              <UploadCloud size={24} />
            </div>
            <h2 className="text-xl font-semibold">Upload Resume</h2>
          </div>

          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ease-in-out ${
              isDragging 
                ? 'border-primary bg-primary/5' 
                : file ? 'border-green-500/50 bg-green-500/5' : 'border-white/20 hover:border-white/40 hover:bg-white/5'
            }`}
          >
            <input 
              type="file" 
              id="resume-upload" 
              className="hidden" 
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
            />
            
            {!file ? (
              <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-400 group-hover:text-primary transition-colors">
                  <UploadCloud size={32} />
                </div>
                <h3 className="text-lg font-medium mb-1">Drag & Drop</h3>
                <p className="text-sm text-gray-400 mb-4">or click to browse files</p>
                <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">PDF, DOC, DOCX up to 10MB</span>
              </label>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-4">
                  <File size={32} />
                </div>
                <h3 className="text-lg font-medium mb-1 text-green-400">File Ready</h3>
                <p className="text-sm text-gray-300 mb-4">{file.name}</p>
                <button 
                  onClick={() => setFile(null)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove file
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Job Description Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 flex flex-col"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-secondary/20 text-secondary rounded-lg">
              <Briefcase size={24} />
            </div>
            <h2 className="text-xl font-semibold">Target Job Description <span className="text-sm text-gray-500 font-normal">(Optional)</span></h2>
          </div>

          <p className="text-sm text-gray-400 mb-4">
            Paste the job description to get a tailored ATS score and keyword matching.
          </p>

          <textarea 
            className="input-field flex-1 resize-none min-h-[150px] mb-6"
            placeholder="e.g. We are looking for a Senior React Engineer with experience in Next.js, TypeScript, and Tailwind CSS..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          ></textarea>

          <button 
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              <>
                Start Analysis <ChevronRight size={20} />
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
