import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { INITIAL_PRODUCTS, INITIAL_SHELVES } from '../constants';
import { HistoryAction, PlanogramState, Product } from '../types';

const initialState: PlanogramState = {
  products: INITIAL_PRODUCTS,
  shelves: INITIAL_SHELVES,
  selectedProductId: null,
  history: [],
  historyIndex: -1,
};

type PlanogramAction =
  | { type: 'SELECT_PRODUCT'; payload: string | null }
  | { type: 'MOVE_PRODUCT'; payload: { id: string; x: number; y: number; shelfId: string | null; stackedOn: string | null } }
  | { type: 'ROTATE_PRODUCT'; payload: { id: string; rotation: number } }
  | { type: 'UNDO' }
  | { type: 'REDO' };

const PlanogramContext = createContext<{
  state: PlanogramState;
  dispatch: React.Dispatch<PlanogramAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

function updateStackSizes(products: Product[]): Product[] {
  const stackSizes = new Map<string, number>();
  
  // Count products in each stack
  products.forEach(product => {
    if (product.stackedOn) {
      const rootProduct = findRootProduct(products, product);
      if (rootProduct) {
        stackSizes.set(rootProduct.id, (stackSizes.get(rootProduct.id) || 1) + 1);
      }
    }
  });
  
  // Update stack sizes
  return products.map(product => ({
    ...product,
    stackSize: product.stackedOn ? 1 : (stackSizes.get(product.id) || 0) + 1
  }));
}

function findRootProduct(products: Product[], product: Product): Product | null {
  if (!product.stackedOn) return product;
  const parent = products.find(p => p.id === product.stackedOn);
  return parent ? findRootProduct(products, parent) : null;
}

function planogramReducer(state: PlanogramState, action: PlanogramAction): PlanogramState {
  switch (action.type) {
    case 'SELECT_PRODUCT':
      return {
        ...state,
        selectedProductId: action.payload,
      };

    case 'MOVE_PRODUCT': {
      const { id, x, y, shelfId, stackedOn } = action.payload;
      const product = state.products.find((p) => p.id === id);
      
      if (!product) return state;
      
      const newHistory: HistoryAction = {
        type: stackedOn ? 'STACK' : 'MOVE',
        productId: id,
        prevProps: { 
          x: product.x, 
          y: product.y, 
          shelfId: product.shelfId,
          stackedOn: product.stackedOn 
        },
        newProps: { x, y, shelfId, stackedOn },
        stackedProductId: stackedOn
      };
      
      let newProducts = state.products.map((p) =>
        p.id === id ? { ...p, x, y, shelfId, stackedOn } : p
      );
      
      // Update stack sizes
      newProducts = updateStackSizes(newProducts);
      
      return {
        ...state,
        products: newProducts,
        history: [...state.history.slice(0, state.historyIndex + 1), newHistory],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'ROTATE_PRODUCT': {
      const { id, rotation } = action.payload;
      const product = state.products.find((p) => p.id === id);
      
      if (!product) return state;
      
      const newHistory: HistoryAction = {
        type: 'ROTATE',
        productId: id,
        prevProps: { rotation: product.rotation },
        newProps: { rotation },
      };
      
      const newProducts = state.products.map((p) =>
        p.id === id ? { ...p, rotation } : p
      );
      
      return {
        ...state,
        products: newProducts,
        history: [...state.history.slice(0, state.historyIndex + 1), newHistory],
        historyIndex: state.historyIndex + 1,
      };
    }

    case 'UNDO': {
      if (state.historyIndex < 0) return state;
      
      const action = state.history[state.historyIndex];
      let updatedProducts = [...state.products];
      
      const productIndex = updatedProducts.findIndex((p) => p.id === action.productId);
      if (productIndex >= 0 && action.prevProps) {
        updatedProducts[productIndex] = {
          ...updatedProducts[productIndex],
          ...action.prevProps,
        };
        updatedProducts = updateStackSizes(updatedProducts);
      }
      
      return {
        ...state,
        products: updatedProducts,
        historyIndex: state.historyIndex - 1,
      };
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      
      const action = state.history[state.historyIndex + 1];
      let updatedProducts = [...state.products];
      
      const productIndex = updatedProducts.findIndex((p) => p.id === action.productId);
      if (productIndex >= 0 && action.newProps) {
        updatedProducts[productIndex] = {
          ...updatedProducts[productIndex],
          ...action.newProps,
        };
        updatedProducts = updateStackSizes(updatedProducts);
      }
      
      return {
        ...state,
        products: updatedProducts,
        historyIndex: state.historyIndex + 1,
      };
    }

    default:
      return state;
  }
}

export const PlanogramProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(planogramReducer, initialState);

  return (
    <PlanogramContext.Provider value={{ state, dispatch }}>
      {children}
    </PlanogramContext.Provider>
  );
};

export const usePlanogram = () => useContext(PlanogramContext);