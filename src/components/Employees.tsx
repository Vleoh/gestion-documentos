import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Table } from './shared/Table';
import { Modal } from './shared/Modal';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Employee } from '../types';

function Employees() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { employees, addEmployee, updateEmployee, removeEmployee } = useStore();

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: (info: any) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-medium">
                {info.getValue().split(' ').map((n: string) => n[0]).join('')}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{info.getValue()}</div>
            <div className="text-gray-500">{info.row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Department',
      accessorKey: 'department',
    },
    {
      header: 'Position',
      accessorKey: 'position',
    },
    {
      header: 'Documents',
      accessorKey: 'documents',
      cell: (info: any) => (
        <div className="flex space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {info.getValue().filter((d: any) => d.status === 'valid').length} Valid
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            {info.getValue().filter((d: any) => d.status === 'expiring').length} Expiring
          </span>
        </div>
      ),
    },
    {
      header: 'Actions',
      cell: (info: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedEmployee(info.row.original)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => removeEmployee(info.row.original.id)}
            className="text-red-600 hover:text-red-900"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Employees</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <Table data={employees} columns={columns} />
      </div>

      <Modal
        isOpen={isAddModalOpen || !!selectedEmployee}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedEmployee(null);
        }}
        title={selectedEmployee ? 'Edit Employee' : 'Add Employee'}
      >
        <EmployeeForm
          employee={selectedEmployee}
          onSubmit={(data) => {
            if (selectedEmployee) {
              updateEmployee({ ...selectedEmployee, ...data });
            } else {
              addEmployee({
                ...data,
                id: Math.random().toString(36).substr(2, 9),
                documents: [],
              });
            }
            setIsAddModalOpen(false);
            setSelectedEmployee(null);
          }}
        />
      </Modal>
    </div>
  );
}

function EmployeeForm({ employee, onSubmit }: { employee?: Employee | null, onSubmit: (data: Partial<Employee>) => void }) {
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    email: employee?.email || '',
    department: employee?.department || '',
    position: employee?.position || '',
    phone: employee?.phone || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="department" className="block text-sm font-medium text-gray-700">
          Department
        </label>
        <input
          type="text"
          id="department"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="position" className="block text-sm font-medium text-gray-700">
          Position
        </label>
        <input
          type="text"
          id="position"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => onSubmit(formData)}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {employee ? 'Update' : 'Add'} Employee
        </button>
      </div>
    </form>
  );
}

export default Employees;