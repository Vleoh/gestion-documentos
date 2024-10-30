import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Table } from './shared/Table';
import { Modal } from './shared/Modal';
import { Plus, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import type { Document, DocumentType } from '../types';

function Documents() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const { documents, documentTypes, employees, addDocument, updateDocument } = useStore();

  const columns = [
    {
      header: 'Document',
      accessorKey: 'type',
      cell: (info: any) => (
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-gray-400 mr-3" />
          <div>
            <div className="font-medium text-gray-900">{info.getValue().name}</div>
            <div className="text-sm text-gray-500">{info.getValue().category}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Employee',
      accessorKey: 'employeeId',
      cell: (info: any) => {
        const employee = employees.find((e) => e.id === info.getValue());
        return employee ? employee.name : 'N/A';
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (info: any) => {
        const status = info.getValue();
        const statusConfig = {
          valid: { icon: CheckCircle, className: 'text-green-600 bg-green-100' },
          expiring: { icon: AlertTriangle, className: 'text-yellow-600 bg-yellow-100' },
          expired: { icon: AlertTriangle, className: 'text-red-600 bg-red-100' },
        }[status];

        const Icon = statusConfig.icon;

        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.className}`}>
            <Icon className="h-4 w-4 mr-1" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      header: 'Expiry Date',
      accessorKey: 'expiryDate',
      cell: (info: any) => format(new Date(info.getValue()), 'MMM dd, yyyy'),
    },
    {
      header: 'Last Updated',
      accessorKey: 'lastUpdated',
      cell: (info: any) => format(new Date(info.getValue()), 'MMM dd, yyyy'),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Documents</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Document
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <Table data={documents} columns={columns} />
      </div>

      <Modal
        isOpen={isAddModalOpen || !!selectedDocument}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedDocument(null);
        }}
        title={selectedDocument ? 'Edit Document' : 'Add Document'}
      >
        <DocumentForm
          document={selectedDocument}
          documentTypes={documentTypes}
          employees={employees}
          onSubmit={(data) => {
            if (selectedDocument) {
              updateDocument({ ...selectedDocument, ...data });
            } else {
              addDocument({
                ...data,
                id: Math.random().toString(36).substr(2, 9),
                status: 'valid',
                lastUpdated: new Date(),
                history: [],
              });
            }
            setIsAddModalOpen(false);
            setSelectedDocument(null);
          }}
        />
      </Modal>
    </div>
  );
}

function DocumentForm({ 
  document, 
  documentTypes, 
  employees, 
  onSubmit 
}: { 
  document?: Document | null;
  documentTypes: DocumentType[];
  employees: Employee[];
  onSubmit: (data: Partial<Document>) => void;
}) {
  const [formData, setFormData] = useState({
    type: document?.type || documentTypes[0],
    employeeId: document?.employeeId || '',
    expiryDate: document?.expiryDate ? format(new Date(document.expiryDate), 'yyyy-MM-dd') : '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      expiryDate: new Date(formData.expiryDate),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Document Type
        </label>
        <select
          id="type"
          value={formData.type.id}
          onChange={(e) => {
            const type = documentTypes.find((t) => t.id === e.target.value);
            if (type) setFormData({ ...formData, type });
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {documentTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="employee" className="block text-sm font-medium text-gray-700">
          Employee
        </label>
        <select
          id="employee"
          value={formData.employeeId}
          onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select Employee</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
          Expiry Date
        </label>
        <input
          type="date"
          id="expiryDate"
          value={formData.expiryDate}
          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {document ? 'Update' : 'Add'} Document
        </button>
      </div>
    </form>
  );
}

export default Documents;