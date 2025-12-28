import {
  BookmarkPlus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Maximize,
  RotateCw,
  Search,
  Share,
  Shield,
  Tag,
  User,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface DocumentViewerProps {
  selectedDocument?: any;
}

const mockDocument = {
  id: "1",
  name: "GDPR_Compliance_Policy.pdf",
  path: "/compliance/gdpr/GDPR_Compliance_Policy.pdf",
  size: "2.4 MB",
  pages: 24,
  type: "PDF",
  created: "2024-01-15",
  modified: "2024-03-20",
  owner: "Legal Department",
  tags: ["GDPR", "Compliance", "Privacy", "Legal"],
  sensitivity: "Confidential",
  description: "Comprehensive GDPR compliance policy covering data processing, subject rights, and organizational requirements.",
  version: "v3.2",
  language: "English",
  extractedText: `GDPR Compliance Policy

1. Introduction
This policy outlines our organization's commitment to data protection and compliance with the General Data Protection Regulation (GDPR).

2. Data Processing Principles
Personal data shall be processed lawfully, fairly and in a transparent manner in relation to the data subject. Data must be collected for specified, explicit and legitimate purposes and not further processed in a manner that is incompatible with those purposes.

3. Legal Basis for Processing
We process personal data based on the following legal grounds:
- Consent of the data subject
- Performance of a contract
- Legal obligation
- Vital interests
- Public task
- Legitimate interests

4. Data Subject Rights
Individuals have the following rights under GDPR:
- Right to be informed
- Right of access
- Right to rectification
- Right to erasure
- Right to restrict processing
- Right to data portability
- Right to object
- Rights in relation to automated decision making

5. Data Protection by Design and Default
We implement appropriate technical and organisational measures to ensure that data protection principles are integrated into all data processing activities.`,
  highlights: [
    {
      text: "Personal data shall be processed lawfully, fairly and in a transparent manner",
      page: 1,
      position: { top: 180, left: 50, width: 400, height: 20 }
    },
    {
      text: "Data protection principles are integrated into all data processing activities",
      page: 1, 
      position: { top: 520, left: 50, width: 380, height: 20 }
    }
  ]
};

export function DocumentViewer({ selectedDocument }: DocumentViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('preview');

  const document = selectedDocument || mockDocument;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));

  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity.toLowerCase()) {
      case 'confidential': return 'destructive';
      case 'restricted': return 'secondary'; 
      case 'internal': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="h-full flex">
      {/* Document Viewer */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-md">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{document.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {document.size} • {document.pages} pages • {document.type}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant={getSensitivityColor(document.sensitivity)}>
                <Shield className="w-3 h-3 mr-1" />
                {document.sensitivity}
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <BookmarkPlus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="border-b border-border p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {document.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(document.pages, prev + 1))}
                disabled={currentPage === document.pages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search in document..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-40"
                />
              </div>
              
              <Separator orientation="vertical" className="h-6" />
              
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm min-w-[60px] text-center">{zoomLevel}%</span>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              
              <Button variant="outline" size="sm">
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
            <TabsTrigger value="preview">Document Preview</TabsTrigger>
            <TabsTrigger value="text">Extracted Text</TabsTrigger>
            <TabsTrigger value="highlights">Highlights</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="flex-1 p-4">
            <Card className="h-full">
              <CardContent className="p-4 h-full">
                {/* PDF Preview Simulation */}
                <div 
                  className="relative bg-white border border-border rounded-lg shadow-sm h-full overflow-auto"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
                >
                  <div className="p-8 min-h-full bg-white">
                    <div className="max-w-2xl">
                      <h1 className="text-2xl font-bold text-gray-900 mb-6">GDPR Compliance Policy</h1>
                      
                      {document.highlights.map((highlight: any, index: number) => (
                        <div key={index} className="mb-6">
                          <div 
                            className="bg-yellow-200/50 px-2 py-1 rounded border-l-4 border-yellow-400"
                            style={{
                              position: currentPage === highlight.page ? 'relative' : 'absolute',
                              visibility: currentPage === highlight.page ? 'visible' : 'hidden'
                            }}
                          >
                            <p className="text-gray-900">{highlight.text}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2 h-6 px-2 text-xs"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Cite this passage
                            </Button>
                          </div>
                        </div>
                      ))}

                      <div className="space-y-4 text-gray-800 text-sm leading-relaxed">
                        <h2 className="text-lg font-semibold">1. Introduction</h2>
                        <p>This policy outlines our organization's commitment to data protection and compliance with the General Data Protection Regulation (GDPR).</p>
                        
                        <h2 className="text-lg font-semibold">2. Data Processing Principles</h2>
                        <p>Personal data shall be processed lawfully, fairly and in a transparent manner in relation to the data subject. Data must be collected for specified, explicit and legitimate purposes.</p>
                        
                        <h2 className="text-lg font-semibold">3. Legal Basis for Processing</h2>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Consent of the data subject</li>
                          <li>Performance of a contract</li>
                          <li>Legal obligation</li>
                          <li>Legitimate interests</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="text" className="flex-1 p-4">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <ScrollArea className="h-full p-4">
                  <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                    {document.extractedText}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="highlights" className="flex-1 p-4">
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {document.highlights.map((highlight: any, index: number) => (
                    <Card key={index} className="border border-yellow-200 bg-yellow-50/50">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-foreground">{highlight.text}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                Page {highlight.page}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Highlighted
                              </Badge>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="ml-2">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Metadata Panel */}
      <div className="w-80 border-l border-border bg-card">
        <div className="p-4">
          <h3 className="font-semibold mb-4">Document Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <div className="flex items-center space-x-2 mt-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{document.created}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Modified</label>
              <div className="flex items-center space-x-2 mt-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{document.modified}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Owner</label>
              <div className="flex items-center space-x-2 mt-1">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{document.owner}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Version</label>
              <div className="mt-1">
                <Badge variant="outline">{document.version}</Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Language</label>
              <div className="mt-1">
                <span className="text-sm">{document.language}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Path</label>
              <div className="mt-1">
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {document.path}
                </code>
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium text-muted-foreground">Tags</label>
              <div className="flex flex-wrap gap-1 mt-2">
                {document.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="text-sm text-foreground mt-1">{document.description}</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Eye className="w-4 h-4 mr-2" />
                View Access Log
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BookmarkPlus className="w-4 h-4 mr-2" />
                Add to Favorites
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Tag className="w-4 h-4 mr-2" />
                Add Tags
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}