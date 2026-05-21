import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Briefcase, Settings } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    // You can add more paths like History or Settings if you implement them
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-surface/30 backdrop-blur-xl flex flex-col h-[calc(100vh-4rem)] hidden md:flex">
      <div className="p-4 flex-1">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">
          Menu
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/20 text-primary font-medium' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-primary' : ''} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-gray-200 cursor-pointer transition-colors">
          <Settings size={20} />
          <span>Settings</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
