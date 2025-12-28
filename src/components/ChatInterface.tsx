import {
  Bot,
  Copy,
  ExternalLink,
  FileText,
  Lightbulb,
  PaperclipIcon,
  Send,
  Settings,
  ThumbsDown,
  ThumbsUp,
  User
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: Citation[];
  confidence?: number;
}

interface Citation {
  id: string;
  document: string;
  page: number;
  snippet: string;
  similarity: number;
  path: string;
}

interface ChatInterfaceProps {
  onViewDocument: (document: any) => void;
}

const suggestedPrompts = [
  "Find all contracts mentioning data retention",
  "Summarize recent compliance updates",
  "What are the key terms in vendor agreements?", 
  "Show me GDPR-related documents"
];

const mockCitations: Citation[] = [
  {
    id: "1",
    document: "GDPR_Compliance_Policy.pdf",
    page: 12,
    snippet: "Personal data shall be processed lawfully, fairly and in a transparent manner...",
    similarity: 0.92,
    path: "/compliance/gdpr"
  },
  {
    id: "2", 
    document: "Data_Retention_Guidelines.docx",
    page: 3,
    snippet: "Data retention periods must align with legal requirements and business needs...",
    similarity: 0.87,
    path: "/policies/data-retention"
  }
];

export function ChatInterface({ onViewDocument }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your document intelligence assistant. I can help you search through your document repository, answer questions, and provide insights from your enterprise documents. What would you like to know?',
      timestamp: new Date(),
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemPromptEnabled, setSystemPromptEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Based on your query "${input}", I found relevant information in your document repository. The GDPR compliance requirements indicate that personal data processing must follow specific guidelines including lawful basis, transparency, and data subject rights. Additionally, your data retention policies specify that different types of data have varying retention periods based on regulatory requirements.`,
        timestamp: new Date(),
        citations: mockCitations,
        confidence: 0.89
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Response copied to clipboard');
  };

  const handleFeedback = (messageId: string, positive: boolean) => {
    toast.success(`Thank you for your ${positive ? 'positive' : 'negative'} feedback`);
  };

  return (
    <div className="flex h-full max-h-[calc(100vh-8rem)]">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">RAG Assistant</h2>
              <p className="text-sm text-muted-foreground">
                Ask questions about your document repository
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="system-prompt" className="text-sm">System Prompt</Label>
                <Switch 
                  id="system-prompt"
                  checked={systemPromptEnabled}
                  onCheckedChange={setSystemPromptEnabled}
                />
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} space-x-2`}>
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback>
                    {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                
                <Card className={`${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                  <CardContent className="p-3">
                    <p className="text-sm">{message.content}</p>
                    
                    {/* Confidence Score */}
                    {message.confidence && (
                      <div className="mt-2 flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          Confidence: {Math.round(message.confidence * 100)}%
                        </Badge>
                      </div>
                    )}

                    {/* Citations */}
                    {message.citations && message.citations.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Sources:</p>
                        {message.citations.map((citation) => (
                          <Card key={citation.id} className="border border-border/50">
                            <CardContent className="p-2">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-1 mb-1">
                                    <FileText className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-xs font-medium truncate">
                                      {citation.document}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                      p.{citation.page}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {citation.snippet}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xs text-muted-foreground">
                                      {Math.round(citation.similarity * 100)}% match
                                    </span>
                                  </div>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="ml-2 h-6 w-6 p-0"
                                  onClick={() => onViewDocument(citation)}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    {message.type === 'assistant' && (
                      <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-border/50">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(message.content)}
                          className="h-6 px-2"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(message.id, true)}
                          className="h-6 px-2"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(message.id, false)}
                          className="h-6 px-2"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex space-x-2 max-w-[80%]">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <Card className="bg-card">
                  <CardContent className="p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce anim-delay-100" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce anim-delay-200" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <div className="space-y-3">
            {/* Suggested Prompts */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-1">
                  <Lightbulb className="w-3 h-3" />
                  <span>Try these prompts:</span>
                </div>
                <div className="flex flex-wrap gap-2 w-full">
                  {suggestedPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setInput(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <PaperclipIcon className="w-4 h-4" />
              </Button>
              <div className="flex-1 relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask the assistant about your document repository..."
                  className="min-h-[60px] resize-none pr-12"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className="absolute bottom-2 right-2"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}