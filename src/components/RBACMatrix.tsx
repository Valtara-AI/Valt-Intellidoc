import {
  AlertTriangle,
  CheckCircle,
  Eye,
  Play,
  Plus,
  Save,
  Search,
  XCircle
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Switch } from './ui/switch';

interface Permission {
  read: boolean;
  write: boolean;
  admin: boolean;
}

interface Folder {
  id: string;
  name: string;
  path: string;
  children?: Folder[];
  permissions: { [groupId: string]: Permission };
}

interface Group {
  id: string;
  name: string;
  description: string;
  userCount: number;
  type: 'builtin' | 'custom';
}

const mockGroups: Group[] = [
  { id: '1', name: 'Legal Team', description: 'Legal department members', userCount: 12, type: 'custom' },
  { id: '2', name: 'Compliance Officers', description: 'Compliance and audit team', userCount: 8, type: 'custom' },
  { id: '3', name: 'IT Admins', description: 'System administrators', userCount: 5, type: 'builtin' },
  { id: '4', name: 'All Users', description: 'All authenticated users', userCount: 287, type: 'builtin' },
  { id: '5', name: 'Executives', description: 'C-level and senior management', userCount: 15, type: 'custom' },
];

const mockFolders: Folder[] = [
  {
    id: '1',
    name: 'Compliance Documents',
    path: '/compliance',
    permissions: {
      '1': { read: true, write: true, admin: false },
      '2': { read: true, write: true, admin: true },
      '3': { read: true, write: false, admin: true },
      '4': { read: true, write: false, admin: false },
      '5': { read: true, write: false, admin: false },
    },
    children: [
      {
        id: '1-1',
        name: 'GDPR',
        path: '/compliance/gdpr',
        permissions: {
          '1': { read: true, write: true, admin: false },
          '2': { read: true, write: true, admin: true },
          '3': { read: true, write: false, admin: false },
          '4': { read: false, write: false, admin: false },
          '5': { read: true, write: false, admin: false },
        }
      },
      {
        id: '1-2', 
        name: 'SOX Compliance',
        path: '/compliance/sox',
        permissions: {
          '1': { read: true, write: false, admin: false },
          '2': { read: true, write: true, admin: true },
          '3': { read: true, write: false, admin: false },
          '4': { read: false, write: false, admin: false },
          '5': { read: true, write: true, admin: false },
        }
      }
    ]
  },
  {
    id: '2',
    name: 'Legal Contracts',
    path: '/legal',
    permissions: {
      '1': { read: true, write: true, admin: true },
      '2': { read: true, write: false, admin: false },
      '3': { read: true, write: false, admin: true },
      '4': { read: false, write: false, admin: false },
      '5': { read: true, write: false, admin: false },
    },
    children: [
      {
        id: '2-1',
        name: 'Vendor Agreements',
        path: '/legal/vendors',
        permissions: {
          '1': { read: true, write: true, admin: false },
          '2': { read: true, write: false, admin: false },
          '3': { read: false, write: false, admin: false },
          '4': { read: false, write: false, admin: false },
          '5': { read: true, write: false, admin: false },
        }
      }
    ]
  },
  {
    id: '3',
    name: 'HR Policies',
    path: '/hr',
    permissions: {
      '1': { read: false, write: false, admin: false },
      '2': { read: true, write: false, admin: false },
      '3': { read: true, write: false, admin: true },
      '4': { read: true, write: false, admin: false },
      '5': { read: true, write: true, admin: false },
    }
  }
];

export function RBACMatrix() {
  const [folders, setFolders] = useState<Folder[]>(mockFolders);
  const [groups] = useState<Group[]>(mockGroups);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1', '2']));
  const [simulationMode, setSimulationMode] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const updatePermission = (folderId: string, groupId: string, permissionType: keyof Permission, value: boolean) => {
    if (!simulationMode) {
      setFolders(prevFolders => 
        updateFolderPermissions(prevFolders, folderId, groupId, permissionType, value)
      );
      toast.success('Permission updated');
    }
  };

  const updateFolderPermissions = (folders: Folder[], targetId: string, groupId: string, permissionType: keyof Permission, value: boolean): Folder[] => {
    return folders.map(folder => {
      if (folder.id === targetId) {
        return {
          ...folder,
          permissions: {
            ...folder.permissions,
            [groupId]: {
              ...folder.permissions[groupId],
              [permissionType]: value
            }
          }
        };
      }
      if (folder.children) {
        return {
          ...folder,
          children: updateFolderPermissions(folder.children, targetId, groupId, permissionType, value)
        };
      }
      return folder;
    });
  };

  const runSimulation = () => {
    const affectedUsers = Math.floor(Math.random() * 50) + 10;
    const gainAccess = Math.floor(Math.random() * 20) + 5;
    const loseAccess = Math.floor(Math.random() * 15) + 3;
    
    setSimulationResults({
      affectedUsers,
      gainAccess,
      loseAccess,
      riskLevel: loseAccess > 10 ? 'high' : affectedUsers > 30 ? 'medium' : 'low'
    });
  };

  const applyChanges = () => {
    setSimulationMode(false);
    setSimulationResults(null);
    toast.success('RBAC changes applied successfully');
  };

  const renderPermissionCell = (folder: Folder, group: Group, permissionType: keyof Permission) => {
    const permission = folder.permissions[group.id];
    const hasPermission = permission?.[permissionType] || false;
    
    return (
      <div className="flex justify-center">
        <Switch
          checked={hasPermission}
          onCheckedChange={(checked) => updatePermission(folder.id, group.id, permissionType, checked)}
          disabled={simulationMode}
        />
      </div>
    );
  };

  const renderFolder = (folder: Folder, level: number = 0) => {
    const filteredGroups = selectedGroup === 'all' ? groups : groups.filter(g => g.id === selectedGroup);
    const matchesSearch = folder.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         folder.path.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch && searchTerm) return null;

    return (
      <div key={folder.id}>
        <div className={`border-b border-border ${level > 0 ? 'ml-4' : ''}`}>
          <div className="flex items-center py-3">
            {/* Folder Name */}
            <div className="w-80 flex items-center space-x-2">
              {folder.children && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFolder(folder.id)}
                  className="h-6 w-6 p-0"
                >
                  {expandedFolders.has(folder.id) ? '−' : '+'}
                </Button>
              )}
              <span className="font-medium text-sm">{folder.name}</span>
              <Badge variant="outline" className="text-xs">
                {folder.path}
              </Badge>
            </div>

            {/* Permission Columns */}
            {filteredGroups.map(group => (
              <div key={group.id} className="flex-1 grid grid-cols-3 gap-4 px-4 min-w-0">
                {renderPermissionCell(folder, group, 'read')}
                {renderPermissionCell(folder, group, 'write')}
                {renderPermissionCell(folder, group, 'admin')}
              </div>
            ))}

            {/* Actions */}
            <div className="w-20 flex justify-center">
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Child Folders */}
        {folder.children && expandedFolders.has(folder.id) && (
          <div>
            {folder.children.map(child => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredGroups = selectedGroup === 'all' ? groups : groups.filter(g => g.id === selectedGroup);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">RBAC Matrix</h2>
          <p className="text-muted-foreground">Manage role-based access control permissions</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="simulation-mode">Simulation Mode</Label>
            <Switch
              id="simulation-mode"
              checked={simulationMode}
              onCheckedChange={setSimulationMode}
            />
          </div>
          {simulationMode && (
            <Button onClick={runSimulation} variant="outline">
              <Play className="w-4 h-4 mr-2" />
              Run Simulation
            </Button>
          )}
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Simulation Results */}
      {simulationResults && (
        <Card className={`border-2 ${
          simulationResults.riskLevel === 'high' ? 'border-red-200 bg-red-50/50' :
          simulationResults.riskLevel === 'medium' ? 'border-yellow-200 bg-yellow-50/50' :
          'border-green-200 bg-green-50/50'
        }`}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className={`w-5 h-5 mr-2 ${
                simulationResults.riskLevel === 'high' ? 'text-red-600' :
                simulationResults.riskLevel === 'medium' ? 'text-yellow-600' :
                'text-green-600'
              }`} />
              Simulation Results - {simulationResults.riskLevel.toUpperCase()} RISK
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{simulationResults.affectedUsers}</div>
                <div className="text-sm text-muted-foreground">Users Affected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{simulationResults.gainAccess}</div>
                <div className="text-sm text-muted-foreground">Gain Access</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{simulationResults.loseAccess}</div>
                <div className="text-sm text-muted-foreground">Lose Access</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={applyChanges} variant="default">
                <CheckCircle className="w-4 h-4 mr-2" />
                Apply Changes
              </Button>
              <Button onClick={() => setSimulationResults(null)} variant="outline">
                <XCircle className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search folders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                {groups.map(group => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Group</DialogTitle>
                  <DialogDescription>
                    Add a new user group for permission management.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Input id="description" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Group</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Permission Matrix */}
      <Card>
        <CardContent className="p-0">
          {/* Header Row */}
          <div className="border-b border-border bg-muted/30">
            <div className="flex items-center py-3">
              <div className="w-80 px-4">
                <span className="font-medium">Folder / Repository</span>
              </div>
              
              {filteredGroups.map(group => (
                <div key={group.id} className="flex-1 px-4">
                  <div className="text-center">
                    <div className="font-medium text-sm">{group.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {group.userCount} users
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-muted-foreground">
                      <div>Read</div>
                      <div>Write</div>
                      <div>Admin</div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="w-20 text-center">
                <span className="font-medium text-sm">Actions</span>
              </div>
            </div>
          </div>

          {/* Permission Rows */}
          <div>
            {folders.map(folder => renderFolder(folder))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Permission Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Read:</strong> View documents and search content
            </div>
            <div>
              <strong>Write:</strong> Upload, edit, and delete documents
            </div>
            <div>
              <strong>Admin:</strong> Manage permissions and settings
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}