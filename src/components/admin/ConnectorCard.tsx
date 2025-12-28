import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Settings, RefreshCw, Trash } from 'lucide-react';
import { DataConnector } from './types';
import { getConnectorIcon, getConnectorStatusBadge } from './helpers';

interface ConnectorCardProps {
  connector: DataConnector;
  onConfigure: (id: string) => void;
  onSync: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ConnectorCard({ connector, onConfigure, onSync, onDelete }: ConnectorCardProps) {
  const ConnectorIcon = getConnectorIcon(connector.type);
  const statusBadge = getConnectorStatusBadge(connector.status);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ConnectorIcon className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-sm">{connector.name}</CardTitle>
          </div>
          <Badge variant={statusBadge.variant}>
            {statusBadge.text}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Documents:</span>
            <span>{connector.documentsCount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Last Sync:</span>
            <span>{new Date(connector.lastSync).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Schedule:</span>
            <span>{connector.configuration.schedule || 'Manual'}</span>
          </div>
          {connector.configuration.url && (
            <div>
              <span className="block">URL:</span>
              <code className="text-xs bg-muted px-1 py-0.5 rounded break-all">
                {connector.configuration.url}
              </code>
            </div>
          )}
          {connector.configuration.path && (
            <div>
              <span className="block">Path:</span>
              <code className="text-xs bg-muted px-1 py-0.5 rounded break-all">
                {connector.configuration.path}
              </code>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onConfigure(connector.id)}>
            <Settings className="w-3 h-3 mr-1" />
            Configure
          </Button>
          <Button variant="outline" size="sm" onClick={() => onSync(connector.id)}>
            <RefreshCw className="w-3 h-3 mr-1" />
            Sync
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(connector.id)}>
            <Trash className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}