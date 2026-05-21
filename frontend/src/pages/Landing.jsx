import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Zap, Shield, ChevronRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px]" />

      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-xl">
            AI
          </div>
          <span className="font-bold text-xl tracking-tight">ResumeAnalyzer</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="btn-secondary px-5 py-2">Log In</Link>
          <Link to="/register" className="btn-primary px-5 py-2">Sign Up</Link>
        </div>
      </nav>

      <main className="z-10 flex flex-col items-center text-center px-4 max-w-5xl mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-primary mb-8 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Powered by Advanced AI
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Optimize Your Resume for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-secondary">
              Applicant Tracking Systems
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Get instant AI-driven feedback, discover missing skills, and match your resume perfectly against job descriptions. Land your dream job faster.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto flex items-center justify-center gap-2">
              Start Analyzing for Free <ChevronRight size={20} />
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
              View Demo
            </Link>
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { icon: Zap, title: "Instant AI Feedback", desc: "Get actionable insights in seconds, powered by OpenAI." },
            { icon: FileText, title: "ATS Compatibility", desc: "Ensure your resume passes automated screening software." },
            { icon: Shield, title: "Privacy First", desc: "Your data is secure and never shared with third parties." }
          ].map((feature, idx) => (
            <div key={idx} className="glass-card p-6 text-left hover:bg-surface/90 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-4">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;
