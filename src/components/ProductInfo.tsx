import React from 'react';
import { RotateCw, RotateCcw, Undo, Redo } from 'lucide-react';
import { usePlanogram } from '../context/PlanogramContext';
import { COLORS } from '../constants';

const ProductInfo: React.FC = () => {
  const { state, dispatch } = usePlanogram();
  const { products, selectedProductId, historyIndex, history } = state;
  
  const selectedProduct = selectedProductId
    ? products.find((p) => p.id === selectedProductId)
    : null;
    
  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < history.length - 1;

  const handleRotate = (direction: 'cw' | 'ccw') => {
    if (!selectedProduct) return;
    
    const newRotation = selectedProduct.rotation + (direction === 'cw' ? 90 : -90);
    
    dispatch({
      type: 'ROTATE_PRODUCT',
      payload: { id: selectedProduct.id, rotation: newRotation },
    });
  };

  const handleUndo = () => {
    dispatch({ type: 'UNDO' });
  };

  const handleRedo = () => {
    dispatch({ type: 'REDO' });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {selectedProduct ? 'Selected Product' : 'Product Information'}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className={`p-2 rounded ${
              canUndo
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-gray-400 cursor-not-allowed'
            }`}
            title="Undo"
          >
            <Undo size={20} />
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className={`p-2 rounded ${
              canRedo
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-gray-400 cursor-not-allowed'
            }`}
            title="Redo"
          >
            <Redo size={20} />
          </button>
        </div>
      </div>

      {selectedProduct ? (
        <div>
          <div className="mb-4">
            <p className="font-medium text-gray-700">{selectedProduct.name}</p>
            <p className="text-sm text-gray-500">
              Position: ({Math.round(selectedProduct.x)}, {Math.round(selectedProduct.y)})
            </p>
            <p className="text-sm text-gray-500">
              Size: {selectedProduct.width} × {selectedProduct.height}
            </p>
            <p className="text-sm text-gray-500">
              Rotation: {selectedProduct.rotation}°
            </p>
            <p className="text-sm text-gray-500">
              Shelf: {selectedProduct.shelfId || 'None'}
            </p>
            {selectedProduct.stackSize > 1 && (
              <p className="text-sm text-gray-500">
                Stack Size: {selectedProduct.stackSize}
              </p>
            )}
            {selectedProduct.stackedOn && (
              <p className="text-sm text-gray-500">
                Stacked on: Product {selectedProduct.stackedOn}
              </p>
            )}
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleRotate('ccw')}
              className="flex items-center justify-center p-2 bg-gray-100 hover:bg-gray-200 rounded-full w-10 h-10"
              title="Rotate counter-clockwise"
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={() => handleRotate('cw')}
              className="flex items-center justify-center p-2 bg-gray-100 hover:bg-gray-200 rounded-full w-10 h-10"
              title="Rotate clockwise"
            >
              <RotateCw size={18} />
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">
          Select a product to view its details and make adjustments.
        </p>
      )}
    </div>
  );
};

export default ProductInfo;