import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, FileText, Settings } from 'lucide-react';

const navigation = [
  { name: 'Employees', href: '/', icon: Users },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex flex-col w-64 bg-gray-800 h-screen fixed">
      <div className="flex items-center h-16 px-4">
        <h1 className="text-white text-xl font-semibold">DocManager</h1>
      </div>
      <nav className="mt-5 flex-1 px-2 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md
                ${isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }
              `}
            >
              <Icon
                className={`
                  mr-3 h-6 w-6
                  ${isActive
                    ? 'text-white'
                    : 'text-gray-400 group-hover:text-gray-300'
                  }
                `}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}