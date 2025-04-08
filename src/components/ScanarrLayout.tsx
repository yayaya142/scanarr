
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, FileText, Settings, HelpCircle, Search, ChevronDown, Menu } from 'lucide-react';
import { Toaster } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from 'react';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, isActive }) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-2 rounded-md transition-colors ${
      isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
    }`}
  >
    <span className="mr-3">{icon}</span>
    <span>{label}</span>
  </Link>
);

interface ScanarrLayoutProps {
  children: React.ReactNode;
}

const ScanarrLayout: React.FC<ScanarrLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-0 -ml-64'
        } fixed left-0 top-0 h-full z-20 bg-card border-r border-border transition-all duration-300 md:relative md:ml-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-bold">Scanarr</h1>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <SidebarLink
              to="/"
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              isActive={location.pathname === '/'}
            />
            <SidebarLink
              to="/history"
              icon={<History size={18} />}
              label="Scan History"
              isActive={location.pathname === '/history'}
            />
            <SidebarLink
              to="/reports"
              icon={<FileText size={18} />}
              label="Reports"
              isActive={location.pathname === '/reports'}
            />
            <SidebarLink
              to="/settings"
              icon={<Settings size={18} />}
              label="Settings"
              isActive={location.pathname === '/settings'}
            />
            <SidebarLink
              to="/support"
              icon={<HelpCircle size={18} />}
              label="Support"
              isActive={location.pathname === '/support'}
            />
          </nav>
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Scanarr v1.0.0</span>
              <span>© 2025</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-card border-b border-border p-4 flex items-center justify-between">
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-secondary md:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center">
            <h1 className="text-lg font-medium">
              {location.pathname === '/' && 'Dashboard'}
              {location.pathname === '/history' && 'Scan History'}
              {location.pathname === '/reports' && 'Reports'}
              {location.pathname === '/settings' && 'Settings'}
              {location.pathname === '/support' && 'Support'}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button className="flex items-center space-x-1 text-sm bg-secondary p-2 rounded hover:bg-secondary/70">
                <span>System</span>
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default ScanarrLayout;
