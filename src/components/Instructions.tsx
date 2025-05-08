import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

const Instructions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200"
      >
        <HelpCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg p-4 border border-gray-200 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-800">How to Use</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={18} />
        </button>
      </div>
      
      <ul className="text-sm text-gray-600 space-y-2">
        <li className="flex items-start">
          <span className="inline-block w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">1</span>
          <span>Drag products from the bottom area onto the shelves</span>
        </li>
        <li className="flex items-start">
          <span className="inline-block w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">2</span>
          <span>Click on a product to select it and see its details</span>
        </li>
        <li className="flex items-start">
          <span className="inline-block w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">3</span>
          <span>Use the rotation buttons to change product orientation</span>
        </li>
        <li className="flex items-start">
          <span className="inline-block w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">4</span>
          <span>Use undo/redo buttons to revert or redo changes</span>
        </li>
      </ul>
    </div>
  );
};

export default Instructions;