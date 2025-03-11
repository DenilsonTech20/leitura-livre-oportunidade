
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  collapsed: boolean;
}

const SidebarLink = ({ to, icon: Icon, label, active, collapsed }: SidebarLinkProps) => {
  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start mb-1",
          active ? "bg-primary/10 text-primary" : "hover:bg-muted"
        )}
      >
        <Icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
        {!collapsed && <span>{label}</span>}
      </Button>
    </Link>
  );
};

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const { logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={cn(
      "h-screen transition-all duration-300 border-r bg-background flex flex-col",
      collapsed ? "w-16" : "w-56"
    )}>
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <h2 className="text-lg font-semibold">Admin Panel</h2>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        <SidebarLink 
          to="/admin/dashboard" 
          icon={LayoutDashboard} 
          label="Dashboard" 
          active={isActive('/admin/dashboard')}
          collapsed={collapsed}
        />
        <SidebarLink 
          to="/admin/books" 
          icon={BookOpen} 
          label="Books" 
          active={isActive('/admin/books')}
          collapsed={collapsed}
        />
        <SidebarLink 
          to="/admin/users" 
          icon={Users} 
          label="Users" 
          active={isActive('/admin/users')}
          collapsed={collapsed}
        />
        <SidebarLink 
          to="/admin/loans" 
          icon={FileText} 
          label="Loans" 
          active={isActive('/admin/loans')}
          collapsed={collapsed}
        />
        <SidebarLink 
          to="/admin/settings" 
          icon={Settings} 
          label="Settings" 
          active={isActive('/admin/settings')}
          collapsed={collapsed}
        />
      </nav>
      
      <div className="p-2 border-t">
        <Button 
          variant="ghost" 
          className={cn("w-full justify-start", collapsed ? "px-2" : "")}
          onClick={() => logout()}
        >
          <LogOut className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
