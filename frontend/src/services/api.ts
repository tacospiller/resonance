import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Schema {
  id: string;
  name: string;
}

export interface SchemasResponse {
  version: string;
  schemas: Schema[];
}

export interface SchemaColumn {
  field: string;
  header: string;
  sortable: boolean;
  editable: boolean;
  type: 'text' | 'number';
}

export interface SchemaDetail {
  id: string;
  name: string;
  columns: SchemaColumn[];
  data: any[];
}

export const api = {
  getSchemas: async (): Promise<SchemasResponse> => {
    const response = await apiClient.get<SchemasResponse>('/schemas');
    return response.data;
  },

  getSchema: async (schemaId: string): Promise<SchemaDetail> => {
    const response = await apiClient.get<SchemaDetail>(`/schema/${schemaId}`);
    return response.data;
  },
};
