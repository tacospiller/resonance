<script setup lang="ts">
import BaseTable from './BaseTable.vue';
import type { User } from '../types/User';

const columns = [
  { field: 'id', header: 'ID', sortable: true, editable: false, style: { width: '5%' } },
  { field: 'name', header: '이름', sortable: true, editable: true, type: 'text' as const, style: { width: '15%' } },
  { field: 'email', header: '이메일', sortable: true, editable: true, type: 'text' as const, style: { width: '25%' } },
  { field: 'role', header: '역할', sortable: true, editable: true, type: 'text' as const, style: { width: '15%' } },
  { field: 'department', header: '부서', sortable: true, editable: true, type: 'text' as const, style: { width: '15%' } },
  { field: 'joinDate', header: '입사일', sortable: true, editable: true, type: 'date' as const, style: { width: '15%' } },
];

const defaultData: User[] = [
  { id: 1, name: '김철수', email: 'kim@example.com', role: '관리자', department: '개발팀', joinDate: '2023-01-15' },
  { id: 2, name: '이영희', email: 'lee@example.com', role: '매니저', department: '마케팅팀', joinDate: '2023-03-20' },
  { id: 3, name: '박지민', email: 'park@example.com', role: '사원', department: '개발팀', joinDate: '2024-05-10' },
];

const newItemFactory = (): User => {
  return {
    id: Date.now(),
    name: '새 사용자',
    email: 'user@example.com',
    role: '사원',
    department: '미정',
    joinDate: new Date().toISOString().split('T')[0],
  };
};

const globalFilterFields = ['name', 'email', 'role', 'department'];
</script>

<template>
  <BaseTable
    :columns="columns"
    storage-key="users-data"
    :default-data="defaultData"
    :new-item-factory="newItemFactory"
    export-file-name="users.json"
    :global-filter-fields="globalFilterFields"
  />
</template>
