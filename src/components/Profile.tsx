import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { 
  User, 
  Building2, 
  Shield, 
  Settings, 
  Bell, 
  Lock, 
  FileText,
  Activity,
  Clock
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  permissions: string[];
  avatar?: string;
}

interface ProfileProps {
  user: User;
  onSignOut: () => void;
}

export function Profile({ user, onSignOut }: ProfileProps) {
  const [notifications, setNotifications] = useState({
    email: true,
    system: true,
    security: true
  });

  const recentActivity = [
    { action: 'Viewed document', item: 'Contract_Analysis_Q4.pdf', time: '2 hours ago' },
    { action: 'Downloaded report', item: 'Compliance_Summary.docx', time: '1 day ago' },
    { action: 'Created chat session', item: 'M&A Due Diligence Query', time: '2 days ago' },
    { action: 'Accessed audit logs', item: 'System Activity Review', time: '3 days ago' },
  ];

  const permissions = [
    { name: 'Document Access', enabled: user.permissions.includes('read'), level: 'Read' },
    { name: 'Document Upload', enabled: user.permissions.includes('write'), level: 'Write' },
    { name: 'User Management', enabled: user.permissions.includes('admin'), level: 'Admin' },
    { name: 'Audit Logs', enabled: user.permissions.includes('audit'), level: 'Admin' },
    { name: 'Model Operations', enabled: user.permissions.includes('model-ops'), level: 'Admin' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-lg">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold">{user.name}</h1>
            <p className="text-muted-foreground">{user.role} • {user.department}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button variant="outline" onClick={onSignOut}>
          Sign Out
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Your corporate account information managed by IT
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={user.name} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input value={user.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input value={user.role} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input value={user.department} disabled />
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Profile information is managed by your system administrator and cannot be modified directly.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Access Permissions
              </CardTitle>
              <CardDescription>
                Your current access levels and permissions within the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {permissions.map((permission, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${permission.enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <div>
                        <p className="font-medium">{permission.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {permission.enabled ? `${permission.level} access granted` : 'Access not granted'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={permission.enabled ? 'default' : 'secondary'}>
                      {permission.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your recent actions and system interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.item}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Manage how you receive notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, email: checked }))
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>System Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about system updates and maintenance
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.system}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, system: checked }))
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Security Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts about security events and login activity
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.security}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, security: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}