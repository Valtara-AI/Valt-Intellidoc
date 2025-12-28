export interface IngestionJob {
  id: string;
  name: string;
  source: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  documentsProcessed: number;
  totalDocuments: number;
  started: string;
  lastUpdate: string;
  errorMessage?: string;
}

export interface DataConnector {
  id: string;
  name: string;
  type: 'sharepoint' | 's3' | 'google_drive' | 'file_upload';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  documentsCount: number;
  configuration: {
    url?: string;
    path?: string;
    credentials?: string;
    schedule?: string;
  };
}

export interface SystemMetrics {
  totalDocuments: number;
  storageUsed: string;
  indexingRate: number;
  errorRate: number;
}