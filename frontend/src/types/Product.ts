export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

export interface TableColumn {
  key: keyof Product;
  label: string;
  type: 'text' | 'number';
  sortable: boolean;
}
