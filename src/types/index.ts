export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  department: string;
  permissions: string[];
  avatar?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  content?: string;
  summary?: string;
  size?: number;
  status: 'processing' | 'processed' | 'error';
  uploadedBy: string;
  uploadedAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sources?: ChatSource[];
}

export interface ChatSource {
  title: string;
  page?: number;
  snippet: string;
  documentId?: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title?: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface SystemConfig {
  id: string;
  key: string;
  value: string;
  category: string;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  hasMore: boolean;
  page: number;
  limit: number;
}