import React, { useState } from 'react';
import { 
  Cpu, 
  HardDrive, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Settings,
  BarChart3,
  Zap,
  Clock,
  Database,
  RefreshCw,
  Play,
  Pause,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Slider } from './ui/slider';

interface ModelMetrics {
  gpuUsage: number;
  memoryUsage: number;
  queueLength: number;
  throughput: number;
  latency: number;
  availability: number;
}

const mockMetrics: ModelMetrics = {
  gpuUsage: 72,
  memoryUsage: 85,
  queueLength: 3,
  throughput: 12.5,
  latency: 2.3,
  availability: 99.8
};

const availableModels = [
  { id: 'llama-3.1-70b', name: 'LLaMA 3.1 70B', status: 'active', size: '140GB' },
  { id: 'llama-3.1-8b', name: 'LLaMA 3.1 8B', status: 'standby', size: '16GB' },
  { id: 'mistral-7b', name: 'Mistral 7B', status: 'available', size: '14GB' }
];

export function ModelOps() {
  const [selectedModel, setSelectedModel] = useState('llama-3.1-70b');
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([2048]);
  const [autoScaling, setAutoScaling] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Model Operations</h2>
          <p className="text-muted-foreground">Monitor and manage LLM models and infrastructure</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Cpu className="w-4 h-4 mr-1" />
              GPU Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{mockMetrics.gpuUsage}%</div>
            <Progress value={mockMetrics.gpuUsage} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <HardDrive className="w-4 h-4 mr-1" />
              Memory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{mockMetrics.memoryUsage}%</div>
            <Progress value={mockMetrics.memoryUsage} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Activity className="w-4 h-4 mr-1" />
              Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.queueLength}</div>
            <p className="text-xs text-muted-foreground">requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Zap className="w-4 h-4 mr-1" />
              Throughput
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.throughput}</div>
            <p className="text-xs text-muted-foreground">req/sec</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Latency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.latency}s</div>
            <p className="text-xs text-muted-foreground">avg response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.availability}%</div>
            <p className="text-xs text-green-600">Healthy</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="models" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="scaling">Auto-Scaling</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Models</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableModels.map((model) => (
                  <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Database className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{model.name}</h4>
                        <p className="text-sm text-muted-foreground">Size: {model.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        model.status === 'active' ? 'default' :
                        model.status === 'standby' ? 'secondary' : 'outline'
                      }>
                        {model.status}
                      </Badge>
                      {model.status === 'active' && (
                        <Button variant="outline" size="sm">
                          <Pause className="w-4 h-4 mr-1" />
                          Stop
                        </Button>
                      )}
                      {model.status !== 'active' && (
                        <Button variant="outline" size="sm">
                          <Play className="w-4 h-4 mr-1" />
                          Start
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="primary-model">Primary Model</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="fallback-model">Fallback Model</Label>
                  <Select defaultValue="llama-3.1-8b">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inference Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Temperature: {temperature[0]}</Label>
                  <Slider
                    value={temperature}
                    onValueChange={setTemperature}
                    max={2}
                    min={0}
                    step={0.1}
                  />
                  <p className="text-xs text-muted-foreground">
                    Controls randomness in the output
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Max Tokens: {maxTokens[0]}</Label>
                  <Slider
                    value={maxTokens}
                    onValueChange={setMaxTokens}
                    max={4096}
                    min={256}
                    step={256}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum response length
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-scaling">Enable Auto-scaling</Label>
                  <Switch
                    id="auto-scaling"
                    checked={autoScaling}
                    onCheckedChange={setAutoScaling}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">GPU Utilization (24h)</h4>
                  <div className="h-40 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">GPU Usage Chart</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Response Times (24h)</h4>
                  <div className="h-40 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Latency Chart</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Request Volume (24h)</h4>
                  <div className="h-40 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Volume Chart</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Error Rates (24h)</h4>
                  <div className="h-40 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Error Chart</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scaling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Scaling Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Scale Up Threshold</Label>
                  <Select defaultValue="80">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="70">70% GPU Usage</SelectItem>
                      <SelectItem value="80">80% GPU Usage</SelectItem>
                      <SelectItem value="90">90% GPU Usage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Scale Down Threshold</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20">20% GPU Usage</SelectItem>
                      <SelectItem value="30">30% GPU Usage</SelectItem>
                      <SelectItem value="40">40% GPU Usage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <Label>Queue-based Scaling</Label>
                  <Switch defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Automatically scale based on request queue length
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}