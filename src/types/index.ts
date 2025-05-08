export interface Product {
  id: string;
  name: string;
  image: string;
  width: number;
  height: number;
  x: number;
  y: number;
  rotation: number;
  shelfId: string | null;
  stackedOn: string | null; // ID of the product this is stacked on
  stackSize: number; // Number of products in the stack (1 if not stacked)
}

export interface Shelf {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type HistoryAction = {
  type: 'ADD' | 'MOVE' | 'REMOVE' | 'ROTATE' | 'STACK';
  productId: string;
  prevProps?: Partial<Product>;
  newProps?: Partial<Product>;
  stackedProductId?: string;
};

export interface PlanogramState {
  products: Product[];
  shelves: Shelf[];
  selectedProductId: string | null;
  history: HistoryAction[];
  historyIndex: number;
}