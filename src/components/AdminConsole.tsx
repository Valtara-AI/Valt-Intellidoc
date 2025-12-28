import { Plus, Settings } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConnectorCard } from './admin/ConnectorCard';
import { IngestionJobCard } from './admin/IngestionJobCard';
import { mockConnectors, mockJobs, mockMetrics } from './admin/mockData';
import { DataConnector, IngestionJob } from './admin/types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function AdminConsole() {
  const [jobs, setJobs] = useState<IngestionJob[]>(mockJobs);
  const [connectors, setConnectors] = useState<DataConnector[]>(mockConnectors);
  const [activeTab, setActiveTab] = useState('ingestion');

  const handleJobAction = (action: string, id: string) => {
    toast.success(`Job ${action} successful`);
    // Update job status logic would go here
  };

  const handleConnectorAction = (action: string, id: string) => {
    toast.success(`Connector ${action} successful`);
    // Update connector logic would go here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Admin Console</h2>
          <p className="text-muted-foreground">Manage data ingestion and system configuration</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Connector
        </Button>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.totalDocuments.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Storage Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.storageUsed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Indexing Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.indexingRate}/hour</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Error Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(mockMetrics.errorRate * 100).toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ingestion">Ingestion Jobs</TabsTrigger>
          <TabsTrigger value="connectors">Data Connectors</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="ingestion" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active Ingestion Jobs</h3>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              New Job
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <IngestionJobCard
                key={job.id}
                job={job}
                onPause={(id) => handleJobAction('pause', id)}
                onResume={(id) => handleJobAction('resume', id)}
                onRetry={(id) => handleJobAction('retry', id)}
                onDelete={(id) => handleJobAction('delete', id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="connectors" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Data Connectors</h3>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Connector
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectors.map((connector) => (
              <ConnectorCard
                key={connector.id}
                connector={connector}
                onConfigure={(id) => handleConnectorAction('configure', id)}
                onSync={(id) => handleConnectorAction('sync', id)}
                onDelete={(id) => handleConnectorAction('delete', id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">System settings and configuration options will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}