import {
    AlertTriangle,
    Bell,
    CheckCircle,
    Database,
    Eye,
    EyeOff,
    Globe,
    Lock,
    Palette,
    Shield,
    User
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';

export function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    audit: true,
    security: true
  });
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Settings</h2>
          <p className="text-muted-foreground">Manage your account and system preferences</p>
        </div>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/api/placeholder/80/80" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">Change Photo</Button>
                  <Button variant="ghost" size="sm">Remove</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john.doe@company.com" />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select defaultValue="legal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="it">IT</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" placeholder="Tell us about yourself..." />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Password & Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button variant="outline">Update Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Two-Factor Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Receive codes via SMS to your mobile device
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Enabled
                  </Badge>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>API Key</Label>
                <div className="flex space-x-2">
                  <Input 
                    type={showApiKey ? "text" : "password"}
                    value="sk-1234567890abcdef..."
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline" size="sm">Regenerate</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your queries and system status
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
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get instant notifications in your browser
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, push: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Audit Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Notifications for compliance and security events
                  </p>
                </div>
                <Switch
                  checked={notifications.audit}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, audit: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Security Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Important security and access notifications
                  </p>
                </div>
                <Switch
                  checked={notifications.security}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, security: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Display Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Switch to dark theme for better low-light viewing
                  </p>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>

              <Separator />

              <div>
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Timezone</Label>
                <Select defaultValue="utc-5">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                    <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                    <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                    <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Data Privacy & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">GDPR Compliant</h4>
                    <p className="text-sm text-blue-700">
                      Your data is processed according to GDPR requirements
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Data Processing Consent</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Query Analytics</p>
                      <p className="text-xs text-muted-foreground">
                        Allow processing of query patterns for system improvement
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Usage Statistics</p>
                      <p className="text-xs text-muted-foreground">
                        Share anonymized usage data for product development
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Data Export</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Download all your personal data and query history
                </p>
                <Button variant="outline" size="sm">
                  Request Data Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Application Version</Label>
                  <p className="text-sm text-muted-foreground">v2.1.4</p>
                </div>
                <div>
                  <Label>Database Version</Label>
                  <p className="text-sm text-muted-foreground">PostgreSQL 15.2</p>
                </div>
                <div>
                  <Label>Model Version</Label>
                  <p className="text-sm text-muted-foreground">LLaMA 3.1-70B</p>
                </div>
                <div>
                  <Label>Last Backup</Label>
                  <p className="text-sm text-muted-foreground">2024-03-21 02:00 UTC</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">System Health</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Connection</span>
                    <Badge variant="secondary">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Model API</span>
                    <Badge variant="secondary">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Vector Database</span>
                    <Badge variant="secondary">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Synced
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-red-900">Clear Query History</h4>
                  <p className="text-sm text-red-700 mb-2">
                    Permanently delete all your query history and chat data
                  </p>
                  <Button variant="destructive" size="sm">
                    Clear History
                  </Button>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium text-red-900">Delete Account</h4>
                  <p className="text-sm text-red-700 mb-2">
                    Permanently delete your account and all associated data
                  </p>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}