export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  phone: string;
  documents: Document[];
}

export interface Document {
  id: string;
  type: DocumentType;
  employeeId: string;
  status: 'valid' | 'expiring' | 'expired';
  expiryDate: Date;
  lastUpdated: Date;
  history: DocumentHistory[];
}

export interface DocumentType {
  id: string;
  name: string;
  category: string;
  description?: string;
  isRecurring: boolean;
  validityPeriod?: number;
}

export interface DocumentHistory {
  date: Date;
  action: string;
  userId: string;
  details: string;
}