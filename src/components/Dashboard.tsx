import React from 'react';
import { 
  FileText, 
  MessageSquare, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  Activity,
  Database,
  Cpu,
  HardDrive,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

const kpiData = [
  {
    title: "Documents Ingested",
    value: "24,847",
    change: "+12%",
    trend: "up",
    icon: FileText,
    description: "Total documents in system"
  },
  {
    title: "Queries Today",
    value: "1,329",
    change: "+8%",
    trend: "up", 
    icon: MessageSquare,
    description: "RAG queries processed"
  },
  {
    title: "Active Users",
    value: "287",
    change: "+23%",
    trend: "up",
    icon: Users,
    description: "Users active this week"
  },
  {
    title: "Compliance Flags",
    value: "3",
    change: "-2",
    trend: "down",
    icon: AlertTriangle,
    description: "Requiring review"
  }
];

const recentActivity = [
  {
    user: "Sarah Chen",
    action: "Queried contract documents",
    time: "2 minutes ago",
    type: "query",
    avatar: "/api/placeholder/32/32"
  },
  {
    user: "Michael Torres", 
    action: "Downloaded compliance report",
    time: "5 minutes ago", 
    type: "download",
    avatar: "/api/placeholder/32/32"
  },
  {
    user: "System",
    action: "Ingested 47 new documents",
    time: "12 minutes ago",
    type: "system",
    avatar: null
  },
  {
    user: "Emma Wilson",
    action: "Updated RBAC permissions",
    time: "1 hour ago",
    type: "admin",
    avatar: "/api/placeholder/32/32"
  },
  {
    user: "David Kim",
    action: "Flagged sensitive document access",
    time: "2 hours ago",
    type: "compliance",
    avatar: "/api/placeholder/32/32"
  }
];

const suggestedPrompts = [
  "Find all contracts mentioning data retention policies",
  "Summarize recent compliance updates from Q4",
  "What are the key terms in our vendor agreements?",
  "Show me documents related to GDPR compliance"
];

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className={`h-3 w-3 mr-1 ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <span className={kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {kpi.change}
                  </span>
                  <span className="ml-1">{kpi.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Activity
              <Button variant="ghost" size="sm" onClick={() => onNavigate('audit')}>
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  {activity.avatar ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.avatar} />
                      <AvatarFallback>{activity.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.user}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.action}
                    </p>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              System Health
              <Button variant="ghost" size="sm" onClick={() => onNavigate('model-ops')}>
                Details <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">GPU Usage</span>
                </div>
                <span className="text-sm font-medium">72%</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Storage</span>
                </div>
                <span className="text-sm font-medium">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Vector DB</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Healthy
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Model Status</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => onNavigate('chat')} className="h-auto p-4 flex-col">
              <MessageSquare className="h-6 w-6 mb-2" />
              Start RAG Chat
            </Button>
            <Button variant="outline" onClick={() => onNavigate('search')} className="h-auto p-4 flex-col">
              <Search className="h-6 w-6 mb-2" />
              Advanced Search
            </Button>
            <Button variant="outline" onClick={() => onNavigate('admin')} className="h-auto p-4 flex-col">
              <Database className="h-6 w-6 mb-2" />
              Ingest Documents
            </Button>
            <Button variant="outline" onClick={() => onNavigate('rbac')} className="h-auto p-4 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Manage Access
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suggested Prompts</CardTitle>
            <CardDescription>Try these popular queries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestedPrompts.map((prompt, index) => (
              <Button 
                key={index}
                variant="ghost" 
                className="w-full text-left justify-start h-auto p-3 text-sm"
                onClick={() => onNavigate('chat')}
              >
                <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{prompt}</span>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="flex items-center text-amber-800">
            <Info className="h-4 w-4 mr-2" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-700">
            Model update available: LLaMA 3.1 70B is ready for deployment. 
            <Button variant="link" className="h-auto p-0 ml-1 text-amber-800" onClick={() => onNavigate('model-ops')}>
              Review update
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}