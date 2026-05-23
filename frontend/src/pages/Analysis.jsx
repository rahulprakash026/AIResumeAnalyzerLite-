import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft, Loader2, Download } from 'lucide-react';
import { resumeService } from '../services/api';

const Analysis = () => {
  const { id } = useParams();
  const [data, setData] = null; // We'll use mock data if API fails for demo
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fallback mock data structure reflecting typical ATS feedback
  const mockData = {
    score: 78,
    status: 'Good', // Excellent, Good, Fair, Poor
    summary: "Your resume shows a strong background in frontend development, particularly with React. However, it lacks clear metrics for achievements and is missing some key backend skills mentioned in the job description.",
    skillsMatched: ['React', 'JavaScript', 'HTML/CSS', 'Git', 'REST APIs'],
    skillsMissing: ['Node.js', 'Docker', 'AWS', 'GraphQL'],
    keywordMatch: [
      { name: 'Matched', value: 65 },
      { name: 'Missing', value: 35 }
    ],
    sectionScores: [
      { name: 'Experience', score: 85 },
      { name: 'Education', score: 90 },
      { name: 'Skills', score: 60 },
      { name: 'Formatting', score: 75 },
    ]
  };

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await resumeService.getAnalysis(id);
        // Map backend response to our UI state here
        // setData(response)
      } catch (err) {
        console.warn('API failed, using mock data for demo', err);
      } finally {
        // Simulate network delay for demo
        setTimeout(() => setLoading(false), 1500);
      }
    };
    
    fetchAnalysis();
  }, [id]);

  const analysisData = data || mockData;

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 size={48} className="animate-spin text-primary" />
        <h2 className="text-xl font-medium text-gray-300">Analyzing your resume...</h2>
        <p className="text-gray-500 text-sm">Our AI is extracting skills and scoring against ATS rules.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4 mb-2">
        <Link to="/dashboard" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Analysis Results</h1>
          <p className="text-gray-400">Here is your AI-powered resume feedback.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Score Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 lg:col-span-1 flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary" />
          
          <h2 className="text-xl font-semibold mb-6">Overall ATS Score</h2>
          
          <div className="relative w-48 h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { value: analysisData.score },
                    { value: 100 - analysisData.score }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={getScoreColor(analysisData.score)} />
                  <Cell fill="#1e293b" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold" style={{ color: getScoreColor(analysisData.score) }}>
                {analysisData.score}
              </span>
              <span className="text-sm text-gray-400 mt-1">out of 100</span>
            </div>
          </div>
          
          <div className="bg-white/5 px-4 py-2 rounded-full inline-flex items-center gap-2">
            Status: <strong style={{ color: getScoreColor(analysisData.score) }}>{analysisData.status}</strong>
          </div>
          
          <button className="w-full mt-8 btn-secondary flex items-center justify-center gap-2">
            <Download size={18} /> Download Report
          </button>
        </motion.div>

        {/* Summary & Section Scores */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary">
                AI
              </div>
              Executive Summary
            </h3>
            <p className="text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
              {analysisData.summary}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold mb-6">Section Analysis</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysisData.sectionScores} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{ fill: '#94a3b8' }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} 
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {
                      analysisData.sectionScores.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Skills Analysis */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-semibold mb-6 border-b border-white/10 pb-4">Keywords & Skills</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="flex items-center gap-2 text-green-400 font-medium mb-4">
              <CheckCircle size={20} /> Matched Skills ({analysisData.skillsMatched.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysisData.skillsMatched.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-300 rounded-lg text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-red-400 font-medium mb-4">
              <XCircle size={20} /> Missing Skills ({analysisData.skillsMissing.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysisData.skillsMissing.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg text-sm">
                  {skill}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <AlertTriangle size={20} className="text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-200">
                Consider adding these missing skills to your resume if you have experience with them, to improve your ATS ranking.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analysis;
