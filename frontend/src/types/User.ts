export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  joinDate: string;
}

export interface UserTableColumn {
  key: keyof User;
  label: string;
  type: 'text' | 'number';
  sortable: boolean;
}
