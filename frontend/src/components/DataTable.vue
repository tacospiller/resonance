<script setup lang="ts">
import BaseTable from './BaseTable.vue';
import type { Product } from '../types/Product';

const columns = [
  { field: 'id', header: 'ID', sortable: true, editable: false, style: { width: '5%' } },
  { field: 'name', header: '제품명', sortable: true, editable: true, type: 'text' as const, style: { width: '20%' } },
  { field: 'category', header: '카테고리', sortable: true, editable: true, type: 'text' as const, style: { width: '15%' } },
  {
    field: 'price',
    header: '가격',
    sortable: true,
    editable: true,
    type: 'number' as const,
    style: { width: '12%' },
    formatter: (value: number) => `${value.toLocaleString()}원`
  },
  { field: 'stock', header: '재고', sortable: true, editable: true, type: 'number' as const, style: { width: '10%' } },
  { field: 'description', header: '설명', sortable: false, editable: true, type: 'text' as const, style: { width: '28%' } },
];

const defaultData: Product[] = [
  { id: 1, name: '노트북', category: '전자기기', price: 1500000, stock: 10, description: '고성능 노트북' },
  { id: 2, name: '마우스', category: '전자기기', price: 30000, stock: 50, description: '무선 마우스' },
  { id: 3, name: '키보드', category: '전자기기', price: 80000, stock: 30, description: '기계식 키보드' },
];

const newItemFactory = (): Product => {
  return {
    id: Date.now(),
    name: '새 제품',
    category: '미분류',
    price: 0,
    stock: 0,
    description: '',
  };
};

const globalFilterFields = ['name', 'category', 'description'];
</script>

<template>
  <BaseTable
    :columns="columns"
    storage-key="products-data"
    :default-data="defaultData"
    :new-item-factory="newItemFactory"
    export-file-name="products.json"
    :global-filter-fields="globalFilterFields"
  />
</template>
