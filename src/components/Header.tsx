import React from 'react';
import { LayoutGrid } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm py-4 px-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <LayoutGrid size={24} className="text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-800">Planogram Designer</h1>
        </div>
        <div className="text-sm text-gray-500">
          Drag products onto shelves to create your layout
        </div>
      </div>
    </header>
  );
};

export default Header;