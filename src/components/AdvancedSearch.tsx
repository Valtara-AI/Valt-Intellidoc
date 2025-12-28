import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  FileType, 
  User, 
  Tag, 
  Shield, 
  Download,
  Eye,
  Star,
  Clock,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Bookmark
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';

interface AdvancedSearchProps {
  onViewDocument: (document: any) => void;
}

const mockResults = [
  {
    id: "1",
    name: "GDPR_Compliance_Policy.pdf",
    path: "/compliance/gdpr",
    type: "PDF",
    size: "2.4 MB",
    pages: 24,
    created: "2024-01-15",
    modified: "2024-03-20",
    owner: "Legal Department",
    tags: ["GDPR", "Compliance", "Privacy"],
    sensitivity: "Confidential",
    snippet: "Personal data shall be processed lawfully, fairly and in a transparent manner in relation to the data subject...",
    relevance: 0.92,
    lastAccessed: "2 hours ago"
  },
  {
    id: "2",
    name: "Data_Retention_Guidelines.docx",
    path: "/policies/data-retention", 
    type: "DOCX",
    size: "1.8 MB",
    pages: 15,
    created: "2024-02-10",
    modified: "2024-03-15",
    owner: "Compliance Team",
    tags: ["Data Retention", "Policy", "Legal"],
    sensitivity: "Internal",
    snippet: "Data retention periods must align with legal requirements and business needs, with regular review cycles...",
    relevance: 0.87,
    lastAccessed: "1 day ago"
  },
  {
    id: "3",
    name: "Privacy_Impact_Assessment_Template.xlsx",
    path: "/templates/privacy",
    type: "XLSX", 
    size: "456 KB",
    pages: 8,
    created: "2024-01-20",
    modified: "2024-02-28",
    owner: "Privacy Office",
    tags: ["PIA", "Template", "Privacy"],
    sensitivity: "Internal",
    snippet: "Template for conducting privacy impact assessments for new data processing activities...",
    relevance: 0.78,
    lastAccessed: "3 days ago"
  }
];

const filterOptions = {
  documentTypes: ["PDF", "DOCX", "XLSX", "PPTX", "TXT"],
  sensitivity: ["Public", "Internal", "Confidential", "Restricted"],
  dateRanges: ["Last 7 days", "Last 30 days", "Last 90 days", "Last year", "All time"],
  owners: ["Legal Department", "Compliance Team", "Privacy Office", "IT Department"],
  tags: ["GDPR", "Compliance", "Privacy", "Legal", "Policy", "Data Retention", "PIA", "Template"]
};

export function AdvancedSearch({ onViewDocument }: AdvancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState('relevance');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedFilters, setSelectedFilters] = useState({
    documentTypes: [] as string[],
    sensitivity: [] as string[],
    dateRange: '',
    owners: [] as string[],
    tags: [] as string[]
  });
  const [showFilters, setShowFilters] = useState(true);

  const handleFilterChange = (category: string, value: string, checked: boolean) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: checked 
        ? [...prev[category as keyof typeof prev] as string[], value]
        : (prev[category as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      documentTypes: [],
      sensitivity: [],
      dateRange: '',
      owners: [],
      tags: []
    });
  };

  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity.toLowerCase()) {
      case 'confidential': return 'destructive';
      case 'restricted': return 'destructive';
      case 'internal': return 'secondary';
      case 'public': return 'outline';
      default: return 'outline';
    }
  };

  const getFileTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'PDF': return '📄';
      case 'DOCX': return '📝';
      case 'XLSX': return '📊';
      case 'PPTX': return '📋';
      default: return '📄';
    }
  };

  return (
    <div className="h-full flex">
      {/* Filters Sidebar */}
      {showFilters && (
        <div className="w-72 border-r border-border bg-card">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>

            {/* Document Type */}
            <div className="mb-6">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Document Type
              </label>
              <div className="space-y-2">
                {filterOptions.documentTypes.map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`type-${type}`}
                      checked={selectedFilters.documentTypes.includes(type)}
                      onCheckedChange={(checked) => 
                        handleFilterChange('documentTypes', type, !!checked)
                      }
                    />
                    <label htmlFor={`type-${type}`} className="text-sm">{type}</label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Sensitivity */}
            <div className="mb-6">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Sensitivity Level
              </label>
              <div className="space-y-2">
                {filterOptions.sensitivity.map(level => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`sensitivity-${level}`}
                      checked={selectedFilters.sensitivity.includes(level)}
                      onCheckedChange={(checked) => 
                        handleFilterChange('sensitivity', level, !!checked)
                      }
                    />
                    <label htmlFor={`sensitivity-${level}`} className="text-sm">{level}</label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Date Range */}
            <div className="mb-6">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Date Range
              </label>
              <Select value={selectedFilters.dateRange} onValueChange={(value) => 
                setSelectedFilters(prev => ({ ...prev, dateRange: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.dateRanges.map(range => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="mb-6" />

            {/* Owners */}
            <div className="mb-6">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Document Owner
              </label>
              <div className="space-y-2">
                {filterOptions.owners.map(owner => (
                  <div key={owner} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`owner-${owner}`}
                      checked={selectedFilters.owners.includes(owner)}
                      onCheckedChange={(checked) => 
                        handleFilterChange('owners', owner, !!checked)
                      }
                    />
                    <label htmlFor={`owner-${owner}`} className="text-sm">{owner}</label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Tags */}
            <div className="mb-6">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Tags
              </label>
              <div className="space-y-2">
                {filterOptions.tags.map(tag => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`tag-${tag}`}
                      checked={selectedFilters.tags.includes(tag)}
                      onCheckedChange={(checked) => 
                        handleFilterChange('tags', tag, !!checked)
                      }
                    />
                    <label htmlFor={`tag-${tag}`} className="text-sm">{tag}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Search Header */}
        <div className="border-b border-border p-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search documents, content, metadata..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              <Button>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-muted-foreground">Sort by:</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="size">Size</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {mockResults.length} results
                </span>
                <Separator orientation="vertical" className="h-4" />
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedFilters.documentTypes.length > 0 || 
              selectedFilters.sensitivity.length > 0 || 
              selectedFilters.owners.length > 0 || 
              selectedFilters.tags.length > 0 ||
              selectedFilters.dateRange) && (
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {selectedFilters.documentTypes.map(type => (
                  <Badge key={type} variant="secondary">
                    {type}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-4 w-4 p-0"
                      onClick={() => handleFilterChange('documentTypes', type, false)}
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
                {selectedFilters.sensitivity.map(level => (
                  <Badge key={level} variant="secondary">
                    {level}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-4 w-4 p-0"
                      onClick={() => handleFilterChange('sensitivity', level, false)}
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
                {selectedFilters.owners.map(owner => (
                  <Badge key={owner} variant="secondary">
                    {owner}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-4 w-4 p-0"
                      onClick={() => handleFilterChange('owners', owner, false)}
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
                {selectedFilters.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-4 w-4 p-0"
                      onClick={() => handleFilterChange('tags', tag, false)}
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
                {selectedFilters.dateRange && (
                  <Badge variant="secondary">
                    {selectedFilters.dateRange}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-4 w-4 p-0"
                      onClick={() => setSelectedFilters(prev => ({ ...prev, dateRange: '' }))}
                    >
                      ×
                    </Button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-auto p-4">
          {viewMode === 'list' ? (
            <div className="space-y-4">
              {mockResults.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewDocument(doc)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">{getFileTypeIcon(doc.type)}</span>
                          <h3 className="font-semibold text-foreground">{doc.name}</h3>
                          <Badge variant={getSensitivityColor(doc.sensitivity)}>
                            {doc.sensitivity}
                          </Badge>
                          <Badge variant="outline">
                            {Math.round(doc.relevance * 100)}% match
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {doc.snippet}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <FileType className="w-3 h-3 mr-1" />
                            {doc.type} • {doc.size} • {doc.pages} pages
                          </span>
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {doc.owner}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Modified {doc.modified}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            Accessed {doc.lastAccessed}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {doc.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockResults.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewDocument(doc)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getFileTypeIcon(doc.type)}</span>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm truncate">{doc.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{doc.size} • {doc.pages} pages</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
                      {doc.snippet}
                    </p>
                    
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={getSensitivityColor(doc.sensitivity)} className="text-xs">
                        {doc.sensitivity}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(doc.relevance * 100)}% match
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {doc.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {doc.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{doc.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      <p>{doc.owner}</p>
                      <p>Modified {doc.modified}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}