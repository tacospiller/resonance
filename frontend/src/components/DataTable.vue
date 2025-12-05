<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import type { Product } from '../types/Product';

const STORAGE_KEY = 'products-data';

const products = ref<Product[]>([]);
const filterText = ref('');

const loadFromStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    products.value = JSON.parse(stored);
  } else {
    products.value = [
      { id: 1, name: '노트북', category: '전자기기', price: 1500000, stock: 10, description: '고성능 노트북' },
      { id: 2, name: '마우스', category: '전자기기', price: 30000, stock: 50, description: '무선 마우스' },
      { id: 3, name: '키보드', category: '전자기기', price: 80000, stock: 30, description: '기계식 키보드' },
    ];
    saveToStorage();
  }
};

const saveToStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products.value));
};

const addRow = () => {
  const newId = products.value.length > 0
    ? Math.max(...products.value.map(p => p.id)) + 1
    : 1;

  const newProduct: Product = {
    id: newId,
    name: '새 제품',
    category: '미분류',
    price: 0,
    stock: 0,
    description: '',
  };

  products.value.push(newProduct);
  saveToStorage();
};

const deleteRow = (product: Product) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    products.value = products.value.filter(p => p.id !== product.id);
    saveToStorage();
  }
};

const onCellEditComplete = (event: any) => {
  let { data, newValue, field } = event;

  if (field === 'price' || field === 'stock') {
    const numValue = parseFloat(newValue);
    if (!isNaN(numValue) && numValue >= 0) {
      data[field] = numValue;
    }
  } else {
    data[field] = newValue;
  }

  saveToStorage();
};

const exportData = () => {
  const dataStr = JSON.stringify(products.value, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'products.json';
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
        products.value = data;
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
      :value="products"
      :globalFilterFields="['name', 'category', 'description']"
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

      <Column field="name" header="제품명" sortable :style="{ width: '20%' }">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" fluid />
        </template>
      </Column>

      <Column field="category" header="카테고리" sortable :style="{ width: '15%' }">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" fluid />
        </template>
      </Column>

      <Column field="price" header="가격" sortable :style="{ width: '12%' }">
        <template #body="{ data }">
          {{ data.price.toLocaleString() }}원
        </template>
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" type="number" fluid />
        </template>
      </Column>

      <Column field="stock" header="재고" sortable :style="{ width: '10%' }">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" type="number" fluid />
        </template>
      </Column>

      <Column field="description" header="설명" :style="{ width: '28%' }">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" fluid />
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
