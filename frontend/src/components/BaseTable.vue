<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

interface ColumnDefinition {
  field: string;
  header: string;
  sortable?: boolean;
  editable?: boolean;
  type?: 'text' | 'number' | 'date';
  style?: Record<string, string>;
  formatter?: (value: any) => string;
}

interface DataChanges {
  modified: any[];
  deleted: any[];
}

interface Props {
  columns: ColumnDefinition[];
  storageKey: string;
  defaultData: T[];
  newItemFactory: () => T;
  exportFileName: string;
  globalFilterFields: string[];
  onDataChange?: (changes: DataChanges) => void | Promise<void>;
}

const props = defineProps<Props>();

const items = ref<T[]>([]);
const filterText = ref('');
const modifiedItems = ref<Set<any>>(new Set());
const deletedItems = ref<Set<any>>(new Set());

const loadFromStorage = () => {
  const stored = localStorage.getItem(props.storageKey);
  if (stored) {
    items.value = JSON.parse(stored);
  } else {
    items.value = [...props.defaultData];
    saveToStorage();
  }
};

const saveToStorage = () => {
  localStorage.setItem(props.storageKey, JSON.stringify(items.value));

  if (props.onDataChange && (modifiedItems.value.size > 0 || deletedItems.value.size > 0)) {
    const changes = {
      modified: Array.from(modifiedItems.value),
      deleted: Array.from(deletedItems.value)
    };
    props.onDataChange(changes);

    // Clear tracking after sending
    modifiedItems.value.clear();
    deletedItems.value.clear();
  }
};

const addRow = () => {
  const newItem = props.newItemFactory();
  items.value.push(newItem);
  modifiedItems.value.add(newItem);
  saveToStorage();
};

const deleteRow = (item: T) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    items.value = items.value.filter(i => i !== item);
    deletedItems.value.add(item);
    // Remove from modified if it was being tracked there
    modifiedItems.value.delete(item);
    saveToStorage();
  }
};

const onCellEditComplete = (event: any) => {
  let { data, newValue, field } = event;

  const column = props.columns.find(c => c.field === field);

  if (column?.type === 'number') {
    const numValue = parseFloat(newValue);
    if (!isNaN(numValue) && numValue >= 0) {
      data[field] = numValue;
    }
  } else {
    data[field] = newValue;
  }

  modifiedItems.value.add(data);
  saveToStorage();
};

const exportData = () => {
  const dataStr = JSON.stringify(items.value, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = props.exportFileName;
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
        items.value = data;
        // Track all imported items as modified
        data.forEach(item => modifiedItems.value.add(item));
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
      :value="items"
      :globalFilterFields="globalFilterFields"
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
      <Column
        v-for="column in columns"
        :key="column.field"
        :field="column.field"
        :header="column.header"
        :sortable="column.sortable !== false"
        :style="column.style"
      >
        <template #body="{ data }">
          <span v-if="column.formatter">
            {{ column.formatter(data[column.field]) }}
          </span>
          <span v-else>
            {{ data[column.field] }}
          </span>
        </template>
        <template v-if="column.editable !== false && column.field !== 'id'" #editor="{ data, field }">
          <InputText
            v-model="data[field]"
            :type="column.type === 'number' ? 'number' : column.type === 'date' ? 'date' : 'text'"
            fluid
          />
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
