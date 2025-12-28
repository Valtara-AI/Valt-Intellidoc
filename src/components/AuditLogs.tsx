import React, { useState } from 'react';
import { 
  Shield, 
  Calendar, 
  User, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Download, 
  Filter,
  Search,
  ExternalLink,
  Clock,
  MapPin,
  Monitor,
  Smartphone,
  RefreshCw,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userId: string;
  action: string;
  resource: string;
  resourceType: 'document' | 'query' | 'permission' | 'system';
  result: 'success' | 'failure' | 'warning';
  ipAddress: string;
  userAgent: string;
  location: string;
  device: string;
  details: {
    query?: string;
    response?: string;
    documentPath?: string;
    permissionChange?: string;
    riskLevel?: 'low' | 'medium' | 'high';
    confidence?: number;
    flagReason?: string;
  };
}

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: '2024-03-21T14:30:00Z',
    user: 'Sarah Chen',
    userId: 'schen@company.com',
    action: 'Document Query',
    resource: 'GDPR_Compliance_Policy.pdf',
    resourceType: 'document',
    result: 'success',
    ipAddress: '192.168.1.45',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    location: 'New York, NY',
    device: 'Desktop',
    details: {
      query: 'What are the data retention requirements for personal data?',
      response: 'Based on GDPR Article 5(1)(e), personal data shall be kept in a form...',
      confidence: 0.92,
      riskLevel: 'low'
    }
  },
  {
    id: '2', 
    timestamp: '2024-03-21T14:25:00Z',
    user: 'Michael Torres',
    userId: 'mtorres@company.com',
    action: 'Document Download',
    resource: 'Vendor_Contract_Template.docx',
    resourceType: 'document',
    result: 'warning',
    ipAddress: '192.168.1.78',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    location: 'San Francisco, CA',
    device: 'Desktop',
    details: {
      documentPath: '/legal/contracts/Vendor_Contract_Template.docx',
      flagReason: 'Sensitive document accessed outside business hours',
      riskLevel: 'medium'
    }
  },
  {
    id: '3',
    timestamp: '2024-03-21T14:20:00Z',
    user: 'System',
    userId: 'system',
    action: 'Permission Change',
    resource: 'Compliance Documents Folder',
    resourceType: 'permission',
    result: 'success',
    ipAddress: '10.0.0.1',
    userAgent: 'Internal System',
    location: 'Server Room',
    device: 'Server',
    details: {
      permissionChange: 'Added READ access for Legal Team to /compliance/sox',
      riskLevel: 'low'
    }
  },
  {
    id: '4',
    timestamp: '2024-03-21T14:15:00Z',
    user: 'Emma Wilson',
    userId: 'ewilson@company.com',
    action: 'Failed Query',
    resource: 'Restricted HR Documents',
    resourceType: 'query',
    result: 'failure',
    ipAddress: '192.168.1.123',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
    location: 'Chicago, IL',
    device: 'Mobile',
    details: {
      query: 'Show me employee salary information',
      flagReason: 'Attempted access to restricted HR data',
      riskLevel: 'high'
    }
  },
  {
    id: '5',
    timestamp: '2024-03-21T14:10:00Z',
    user: 'David Kim',
    userId: 'dkim@company.com',
    action: 'Document Upload',
    resource: 'New_Privacy_Policy_Draft.pdf',
    resourceType: 'document',
    result: 'success',
    ipAddress: '192.168.1.89',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    location: 'Austin, TX',
    device: 'Desktop',
    details: {
      documentPath: '/policies/privacy/New_Privacy_Policy_Draft.pdf',
      riskLevel: 'low'
    }
  }
];

const riskStats = {
  totalEvents: 1247,
  highRisk: 8,
  mediumRisk: 23,
  lowRisk: 1216,
  flaggedToday: 3,
  trendsUp: true
};

export function AuditLogs() {
  const [logs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [activeTab, setActiveTab] = useState('logs');

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getResultBadgeVariant = (result: string) => {
    switch (result) {
      case 'success': return 'outline';
      case 'warning': return 'secondary';
      case 'failure': return 'destructive';
      default: return 'outline';
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'failure': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'desktop': return <Monitor className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || log.action.toLowerCase().includes(actionFilter.toLowerCase());
    const matchesResult = resultFilter === 'all' || log.result === resultFilter;
    const matchesRisk = riskFilter === 'all' || log.details.riskLevel === riskFilter;

    return matchesSearch && matchesAction && matchesResult && matchesRisk;
  });

  const exportLogs = () => {
    // Simulate CSV export
    const csvContent = [
      'Timestamp,User,Action,Resource,Result,IP Address,Location,Risk Level',
      ...filteredLogs.map(log => 
        `${log.timestamp},${log.user},${log.action},${log.resource},${log.result},${log.ipAddress},${log.location},${log.details.riskLevel || 'N/A'}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit_logs.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Audit Logs</h2>
          <p className="text-muted-foreground">Monitor system activity and compliance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportLogs}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Risk Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{riskStats.totalEvents.toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                  <span>+12% from last week</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-red-700">
                  High Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700">{riskStats.highRisk}</div>
                <div className="text-xs text-red-600">Requires immediate attention</div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-yellow-700">
                  Medium Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-700">{riskStats.mediumRisk}</div>
                <div className="text-xs text-yellow-600">Monitor closely</div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-700">
                  Low Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">{riskStats.lowRisk}</div>
                <div className="text-xs text-green-600">Normal activity</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Flagged Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{riskStats.flaggedToday}</div>
                <div className="text-xs text-muted-foreground">Pending review</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent High Risk Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Recent High Risk Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {logs.filter(log => log.details.riskLevel === 'high').slice(0, 3).map(log => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{log.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{log.user}</p>
                        <p className="text-xs text-muted-foreground">{log.action} - {log.resource}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="destructive">High Risk</Badge>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="query">Document Query</SelectItem>
                    <SelectItem value="download">Document Download</SelectItem>
                    <SelectItem value="upload">Document Upload</SelectItem>
                    <SelectItem value="permission">Permission Change</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={resultFilter} onValueChange={setResultFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Results</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="failure">Failure</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Audit Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {log.user === 'System' ? 'SYS' : log.user.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{log.user}</div>
                            <div className="text-xs text-muted-foreground">{log.userId}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={log.resource}>
                          {log.resource}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getResultIcon(log.result)}
                          <Badge variant={getResultBadgeVariant(log.result)} className="text-xs">
                            {log.result}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.details.riskLevel && (
                          <Badge variant={getRiskBadgeVariant(log.details.riskLevel)} className="text-xs">
                            {log.details.riskLevel.toUpperCase()}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getDeviceIcon(log.device)}
                          <div>
                            <div className="text-sm">{log.location}</div>
                            <div className="text-xs text-muted-foreground">{log.ipAddress}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Audit Log Details</DialogTitle>
                              <DialogDescription>
                                Full details for log entry {log.id}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedLog && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">User</label>
                                    <p className="text-sm">{selectedLog.user} ({selectedLog.userId})</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                                    <p className="text-sm">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Action</label>
                                    <p className="text-sm">{selectedLog.action}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Resource</label>
                                    <p className="text-sm">{selectedLog.resource}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">IP Address</label>
                                    <p className="text-sm">{selectedLog.ipAddress}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                                    <p className="text-sm">{selectedLog.location}</p>
                                  </div>
                                </div>
                                
                                <Separator />
                                
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">User Agent</label>
                                  <p className="text-sm text-muted-foreground">{selectedLog.userAgent}</p>
                                </div>
                                
                                {selectedLog.details.query && (
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Query</label>
                                    <p className="text-sm bg-muted p-2 rounded">{selectedLog.details.query}</p>
                                  </div>
                                )}
                                
                                {selectedLog.details.response && (
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Response</label>
                                    <p className="text-sm bg-muted p-2 rounded">{selectedLog.details.response}</p>
                                  </div>
                                )}
                                
                                {selectedLog.details.flagReason && (
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Flag Reason</label>
                                    <p className="text-sm text-red-700 bg-red-50 p-2 rounded">{selectedLog.details.flagReason}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Analytics Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Activity by Hour</h4>
                  <div className="h-40 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Chart placeholder</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Risk Distribution</h4>
                  <div className="h-40 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Chart placeholder</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Top Users</h4>
                  <div className="space-y-2">
                    {logs.slice(0, 5).map((log, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{log.user}</span>
                        <Badge variant="outline">{Math.floor(Math.random() * 20) + 1} events</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Most Accessed Documents</h4>
                  <div className="space-y-2">
                    {logs.filter(log => log.resourceType === 'document').slice(0, 5).map((log, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="truncate">{log.resource}</span>
                        <Badge variant="outline">{Math.floor(Math.random() * 50) + 1} views</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}