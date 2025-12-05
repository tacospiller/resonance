<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import type { User } from '../types/User';

const STORAGE_KEY = 'users-data';

const users = ref<User[]>([]);
const filterText = ref('');

const loadFromStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    users.value = JSON.parse(stored);
  } else {
    users.value = [
      { id: 1, name: '김철수', email: 'kim@example.com', role: '관리자', department: '개발팀', joinDate: '2023-01-15' },
      { id: 2, name: '이영희', email: 'lee@example.com', role: '매니저', department: '마케팅팀', joinDate: '2023-03-20' },
      { id: 3, name: '박지민', email: 'park@example.com', role: '사원', department: '개발팀', joinDate: '2024-05-10' },
    ];
    saveToStorage();
  }
};

const saveToStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users.value));
};

const addRow = () => {
  const newId = users.value.length > 0
    ? Math.max(...users.value.map(u => u.id)) + 1
    : 1;

  const newUser: User = {
    id: newId,
    name: '새 사용자',
    email: 'user@example.com',
    role: '사원',
    department: '미정',
    joinDate: new Date().toISOString().split('T')[0],
  };

  users.value.push(newUser);
  saveToStorage();
};

const deleteRow = (user: User) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    users.value = users.value.filter(u => u.id !== user.id);
    saveToStorage();
  }
};

const onCellEditComplete = (event: any) => {
  let { data, newValue, field } = event;
  data[field] = newValue;
  saveToStorage();
};

const exportData = () => {
  const dataStr = JSON.stringify(users.value, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'users.json';
  link.click();
  URL.revokeObjectURL(url);
};

const importData = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string);
      if (Array.isArray(data)) {
        users.value = data;
        saveToStorage();
      }
    } catch (error) {
      alert('파일 읽기 실패: ' + error);
    }
  };
  reader.readAsText(file);
};

onMounted(() => {
  loadFromStorage();
});
</script>

<template>
  <div class="data-table-container">
    <div class="toolbar">
      <div class="toolbar-left">
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="filterText"
            placeholder="검색..."
            style="width: 300px"
          />
        </IconField>
        <Button
          label="행 추가"
          icon="pi pi-plus"
          @click="addRow"
          severity="success"
        />
      </div>
      <div class="toolbar-right">
        <Button
          label="내보내기"
          icon="pi pi-download"
          @click="exportData"
          severity="info"
        />
        <label>
          <Button
            label="불러오기"
            icon="pi pi-upload"
            severity="info"
          />
          <input
            type="file"
            accept="application/json"
            @change="importData"
            style="display: none"
          />
        </label>
      </div>
    </div>

    <DataTable
      :value="users"
      :globalFilterFields="['name', 'email', 'role', 'department']"
      :globalFilter="filterText"
      editMode="cell"
      @cell-edit-complete="onCellEditComplete"
      sortMode="multiple"
      removableSort
      stripedRows
      paginator
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      tableStyle="min-width: 50rem"
      class="prime-datatable"
    >
      <Column field="id" header="ID" sortable :style="{ width: '5%' }">
        <template #body="{ data }">
          {{ data.id }}
        </template>
      </Column>

      <Column field="name" header="이름" sortable :style="{ width: '15%' }">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" fluid />
        </template>
      </Column>

      <Column field="email" header="이메일" sortable :style="{ width: '25%' }">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" fluid />
        </template>
      </Column>

      <Column field="role" header="역할" sortable :style="{ width: '15%' }">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" fluid />
        </template>
      </Column>

      <Column field="department" header="부서" sortable :style="{ width: '15%' }">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" fluid />
        </template>
      </Column>

      <Column field="joinDate" header="입사일" sortable :style="{ width: '15%' }">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" type="date" fluid />
        </template>
      </Column>

      <Column header="작업" :style="{ width: '10%' }">
        <template #body="{ data }">
          <Button
            icon="pi pi-trash"
            @click="deleteRow(data)"
            severity="danger"
            text
            rounded
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.data-table-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f8f9fa;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
  flex-wrap: wrap;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 10px;
  align-items: center;
}

.prime-datatable {
  flex: 1;
}
</style>
