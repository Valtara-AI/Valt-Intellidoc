import { IngestionJob, DataConnector, SystemMetrics } from './types';

export const mockJobs: IngestionJob[] = [
  {
    id: '1',
    name: 'Legal Documents Sync',
    source: 'SharePoint - Legal Folder',
    status: 'running',
    progress: 67,
    documentsProcessed: 134,
    totalDocuments: 200,
    started: '2024-03-21T10:30:00Z',
    lastUpdate: '2024-03-21T14:45:00Z'
  },
  {
    id: '2',
    name: 'Compliance Archive Import',
    source: 'S3 Bucket - compliance-docs',
    status: 'completed',
    progress: 100,
    documentsProcessed: 456,
    totalDocuments: 456,
    started: '2024-03-21T08:00:00Z',
    lastUpdate: '2024-03-21T12:30:00Z'
  },
  {
    id: '3',
    name: 'HR Policies Update',
    source: 'Google Drive - HR Folder',
    status: 'failed',
    progress: 23,
    documentsProcessed: 12,
    totalDocuments: 52,
    started: '2024-03-21T13:15:00Z',
    lastUpdate: '2024-03-21T13:45:00Z',
    errorMessage: 'Authentication failed: Invalid Google Drive credentials'
  }
];

export const mockConnectors: DataConnector[] = [
  {
    id: '1',
    name: 'SharePoint Production',
    type: 'sharepoint',
    status: 'connected',
    lastSync: '2024-03-21T14:30:00Z',
    documentsCount: 2847,
    configuration: {
      url: 'https://company.sharepoint.com/sites/documents',
      schedule: 'Every 6 hours'
    }
  },
  {
    id: '2',
    name: 'AWS S3 Archive',
    type: 's3',
    status: 'connected',
    lastSync: '2024-03-21T12:00:00Z',
    documentsCount: 1234,
    configuration: {
      path: 's3://company-docs/archive/',
      schedule: 'Daily at 2:00 AM'
    }
  },
  {
    id: '3',
    name: 'Google Drive Integration',
    type: 'google_drive',
    status: 'error',
    lastSync: '2024-03-20T18:00:00Z',
    documentsCount: 567,
    configuration: {
      path: '/Shared drives/Company Documents',
      schedule: 'Every 12 hours'
    }
  }
];

export const mockMetrics: SystemMetrics = {
  totalDocuments: 24847,
  storageUsed: '2.4 TB',
  indexingRate: 456,
  errorRate: 0.02
};