export type Employee = {
  id: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  position: string;
  documents: Document[];
};

export type Document = {
  id: string;
  type: DocumentType;
  employeeId: string;
  expiryDate: Date;
  status: 'valid' | 'expiring' | 'expired';
  lastUpdated: Date;
  history: DocumentHistory[];
};

export type DocumentType = {
  id: string;
  name: string;
  description: string;
  isRecurring: boolean;
  validityPeriod?: number; // in days
  category: string;
};

export type DocumentHistory = {
  id: string;
  documentId: string;
  action: 'created' | 'updated' | 'expired' | 'renewed';
  date: Date;
  updatedBy: string;
};