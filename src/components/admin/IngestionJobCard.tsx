import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Play, Pause, RefreshCw, Trash, AlertCircle } from 'lucide-react';
import { IngestionJob } from './types';
import { getStatusIcon, getStatusColor, formatDuration } from './helpers';

interface IngestionJobCardProps {
  job: IngestionJob;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onRetry: (id: string) => void;
  onDelete: (id: string) => void;
}

export function IngestionJobCard({ job, onPause, onResume, onRetry, onDelete }: IngestionJobCardProps) {
  const StatusIcon = getStatusIcon(job.status);
  const statusColor = getStatusColor(job.status);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{job.name}</CardTitle>
          <div className="flex items-center space-x-2">
            <StatusIcon className={`w-4 h-4 ${statusColor}`} />
            <Badge variant={job.status === 'failed' ? 'destructive' : 'secondary'}>
              {job.status}
            </Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{job.source}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>{job.documentsProcessed}/{job.totalDocuments} docs</span>
          </div>
          <Progress value={job.progress} className="h-2" />
        </div>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Started:</span>
            <span>{new Date(job.started).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Duration:</span>
            <span>{formatDuration(job.started, job.lastUpdate)}</span>
          </div>
        </div>

        {job.errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-md p-2">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-red-800">Error</p>
                <p className="text-xs text-red-700">{job.errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          {job.status === 'running' && (
            <Button variant="outline" size="sm" onClick={() => onPause(job.id)}>
              <Pause className="w-3 h-3 mr-1" />
              Pause
            </Button>
          )}
          {(job.status === 'paused' || job.status === 'failed') && (
            <Button variant="outline" size="sm" onClick={() => onResume(job.id)}>
              <Play className="w-3 h-3 mr-1" />
              Resume
            </Button>
          )}
          {job.status === 'failed' && (
            <Button variant="outline" size="sm" onClick={() => onRetry(job.id)}>
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => onDelete(job.id)}>
            <Trash className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}