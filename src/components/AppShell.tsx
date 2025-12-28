import {
    Activity,
    Bell,
    FileText,
    HelpCircle,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquare,
    Search,
    Settings as SettingsIcon,
    Shield,
    User,
    Users,
    X
} from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'chat', label: 'RAG Chat', icon: MessageSquare },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'search', label: 'Advanced Search', icon: Search },
  { id: 'audit', label: 'Audit Logs', icon: Shield },
  { id: 'rbac', label: 'RBAC', icon: Users },
  { id: 'admin', label: 'Admin Console', icon: SettingsIcon },
  { id: 'model-ops', label: 'Model Ops', icon: Activity },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  permissions: string[];
  avatar?: string;
}

interface AppShellProps {
  children: React.ReactNode;
  activeView: string;
  onNavigate: (view: string) => void;
  user: User;
  onSignOut: () => void;
}

export function AppShell({ children, activeView, onNavigate, user, onSignOut }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleProfileClick = () => {
    onNavigate('profile');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`bg-card border-r border-border transition-all duration-200 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                <Image src="/Valtara_AI_Logo.svg" alt="Valtara AI Logo" width={32} height={32} className="rounded-md" />
                <span className="font-semibold text-foreground">Valt Intellidoc</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2"
            >
              {sidebarCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              
              // Hide admin features if user doesn't have admin permissions
              if (['rbac', 'admin', 'model-ops', 'audit'].includes(item.id) && 
                  !user.permissions.includes('admin')) {
                return null;
              }
              
              return (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "secondary" : "ghost"}
                  className={`w-full justify-start ${sidebarCollapsed ? 'px-3' : 'px-3'}`}
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="ml-3">{item.label}</span>}
                </Button>
              );
            })}
          </nav>

          {/* User Info (collapsed state) */}
          {sidebarCollapsed && (
            <div className="p-2 border-t border-border">
              <Button
                variant="ghost"
                className="w-full p-2"
                onClick={handleProfileClick}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </div>
          )}

          {/* Environment Badge */}
          <div className="p-4 border-t border-border">
            <Badge variant="outline" className={`${sidebarCollapsed ? 'px-1' : 'w-full justify-center'}`}>
              {sidebarCollapsed ? 'On-Prem' : '🔒 On-Premises'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-foreground capitalize">
              {activeView === 'profile' ? 'Profile' : 
               navigation.find(nav => nav.id === activeView)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Global Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search documents..."
                className="pl-10 pr-4 py-2 w-80 bg-input-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-xs">
                3
              </Badge>
            </Button>

            {/* Help */}
            <Button variant="ghost" size="sm">
              <HelpCircle className="w-4 h-4" />
            </Button>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground font-normal">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate('settings')}>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={onSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}