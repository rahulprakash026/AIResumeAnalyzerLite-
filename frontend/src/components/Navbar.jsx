import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { authService } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="h-16 border-b border-white/10 bg-surface/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-lg">
          AI
        </div>
        <span className="font-semibold text-lg tracking-wide hidden sm:block">ResumeAnalyzer</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white">
          <User size={20} />
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
