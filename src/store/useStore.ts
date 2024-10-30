import { create } from 'zustand';
import type { Employee, Document, DocumentType } from '../types';

interface Store {
  employees: Employee[];
  documents: Document[];
  documentTypes: DocumentType[];
  addEmployee: (employee: Employee) => void;
  updateEmployee: (employee: Employee) => void;
  removeEmployee: (id: string) => void;
  addDocument: (document: Document) => void;
  updateDocument: (document: Document) => void;
  removeDocument: (id: string) => void;
  addDocumentType: (documentType: DocumentType) => void;
  updateDocumentType: (documentType: DocumentType) => void;
  removeDocumentType: (id: string) => void;
}

export const useStore = create<Store>((set) => ({
  employees: [],
  documents: [],
  documentTypes: [
    {
      id: '1',
      name: 'Medical Certificate',
      category: 'Health',
      isRecurring: true,
      validityPeriod: 365,
    },
    {
      id: '2',
      name: 'Driver\'s License',
      category: 'Certification',
      isRecurring: true,
      validityPeriod: 730,
    },
  ],
  
  addEmployee: (employee) =>
    set((state) => ({ employees: [...state.employees, employee] })),
    
  updateEmployee: (employee) =>
    set((state) => ({
      employees: state.employees.map((e) =>
        e.id === employee.id ? employee : e
      ),
    })),
    
  removeEmployee: (id) =>
    set((state) => ({
      employees: state.employees.filter((e) => e.id !== id),
    })),
    
  addDocument: (document) =>
    set((state) => ({ documents: [...state.documents, document] })),
    
  updateDocument: (document) =>
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === document.id ? document : d
      ),
    })),
    
  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
    })),
    
  addDocumentType: (documentType) =>
    set((state) => ({
      documentTypes: [...state.documentTypes, documentType],
    })),
    
  updateDocumentType: (documentType) =>
    set((state) => ({
      documentTypes: state.documentTypes.map((dt) =>
        dt.id === documentType.id ? documentType : dt
      ),
    })),
    
  removeDocumentType: (id) =>
    set((state) => ({
      documentTypes: state.documentTypes.filter((dt) => dt.id !== id),
    })),
}));