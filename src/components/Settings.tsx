import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Table } from './shared/Table';
import { Modal } from './shared/Modal';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { DocumentType } from '../types';

function Settings() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<DocumentType | null>(null);
  const { documentTypes } = useStore();

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Category',
      accessorKey: 'category',
    },
    {
      header: 'Type',
      accessorKey: 'isRecurring',
      cell: (info: any) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {info.getValue() ? 'Recurring' : 'One-time'}
        </span>
      ),
    },
    {
      header: 'Validity Period',
      accessorKey: 'validityPeriod',
      cell: (info: any) => info.getValue() ? `${info.getValue()} days` : 'N/A',
    },
    {
      header: 'Actions',
      cell: (info: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedDocType(info.row.original)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button className="text-red-600 hover:text-red-900">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Document Types</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Document Type
          </button>
        </div>
        <Table data={documentTypes} columns={columns} />
      </div>

      <Modal
        isOpen={isAddModalOpen || !!selectedDocType}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedDocType(null);
        }}
        title={selectedDocType ? 'Edit Document Type' : 'Add Document Type'}
      >
        <DocumentTypeForm
          documentType={selectedDocType}
          onSubmit={(data) => {
            console.log('Submit document type:', data);
            setIsAddModalOpen(false);
            setSelectedDocType(null);
          }}
        />
      </Modal>
    </div>
  );
}

function DocumentTypeForm({ 
  documentType, 
  onSubmit 
}: { 
  documentType?: DocumentType | null;
  onSubmit: (data: Partial<DocumentType>) => void;
}) {
  const [formData, setFormData] = useState({
    name: documentType?.name || '',
    category: documentType?.category || '',
    description: documentType?.description || '',
    isRecurring: documentType?.isRecurring || false,
    validityPeriod: documentType?.validityPeriod || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      validityPeriod: formData.validityPeriod ? parseInt(formData.validityPeriod as string) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <input
          type="text"
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isRecurring"
          checked={formData.isRecurring}
          onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-700">
          Recurring Document
        </label>
      </div>

      {formData.isRecurring && (
        <div>
          <label htmlFor="validityPeriod" className="block text-sm font-medium text-gray-700">
            Validity Period (days)
          </label>
          <input
            type="number"
            id="validityPeriod"
            value={formData.validityPeriod}
            onChange={(e) => setFormData({ ...formData, validityPeriod: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {documentType ? 'Update' : 'Add'} Document Type
        </button>
      </div>
    </form>
  );
}

export default Settings;