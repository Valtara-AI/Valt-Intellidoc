import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Pause,
  Database,
  HardDrive,
  Cloud,
  Upload
} from 'lucide-react';

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'running': return Play;
    case 'completed': return CheckCircle;
    case 'failed': return XCircle;
    case 'paused': return Pause;
    default: return CheckCircle;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'running': return 'text-blue-600';
    case 'completed': return 'text-green-600';
    case 'failed': return 'text-red-600';
    case 'paused': return 'text-yellow-600';
    default: return 'text-gray-600';
  }
};

export const getConnectorIcon = (type: string) => {
  switch (type) {
    case 'sharepoint': return Database;
    case 's3': return Cloud;
    case 'google_drive': return HardDrive;
    case 'file_upload': return Upload;
    default: return Database;
  }
};

export const getConnectorStatusBadge = (status: string) => {
  switch (status) {
    case 'connected': return { variant: 'secondary' as const, text: 'Connected' };
    case 'disconnected': return { variant: 'outline' as const, text: 'Disconnected' };
    case 'error': return { variant: 'destructive' as const, text: 'Error' };
    default: return { variant: 'outline' as const, text: 'Unknown' };
  }
};

export const formatDuration = (startTime: string, endTime?: string) => {
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();
  const diff = Math.floor((end.getTime() - start.getTime()) / 1000 / 60);
  
  if (diff < 60) return `${diff}m`;
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  return `${hours}h ${minutes}m`;
};