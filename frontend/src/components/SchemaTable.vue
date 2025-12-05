<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import BaseTable from './BaseTable.vue';
import { api, type SchemaDetail, type DataChanges } from '../services/api';

const props = defineProps<{
  schemaId: string;
}>();

const schemaDetail = ref<SchemaDetail | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const loadSchemaData = async () => {
  try {
    loading.value = true;
    error.value = null;
    schemaDetail.value = await api.getSchema(props.schemaId);
  } catch (err) {
    error.value = '스키마 데이터를 불러오는데 실패했습니다.';
    console.error('Failed to load schema:', err);
  } finally {
    loading.value = false;
  }
};

const newItemFactory = () => {
  if (!schemaDetail.value) return {};

  const newItem: any = { id: Date.now() };
  schemaDetail.value.columns.forEach(col => {
    if (col.field !== 'id') {
      newItem[col.field] = col.type === 'number' ? 0 : '';
    }
  });
  return newItem;
};

const globalFilterFields = () => {
  if (!schemaDetail.value) return [];
  return schemaDetail.value.columns
    .filter(col => col.type === 'text')
    .map(col => col.field);
};

const handleDataChange = async (changes: DataChanges) => {
  try {
    await api.saveData(props.schemaId, changes);
  } catch (err) {
    console.error('Failed to save data:', err);
  }
};

onMounted(() => {
  loadSchemaData();
});

watch(() => props.schemaId, () => {
  loadSchemaData();
});
</script>

<template>
  <div v-if="loading" class="loading-container">
    <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
    <p>스키마 데이터를 불러오는 중...</p>
  </div>
  <div v-else-if="error" class="error-container">
    <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: #e74c3c;"></i>
    <p>{{ error }}</p>
  </div>
  <BaseTable
    v-else-if="schemaDetail"
    :columns="schemaDetail.columns"
    :storage-key="`schema-${schemaId}`"
    :default-data="schemaDetail.data"
    :new-item-factory="newItemFactory"
    :export-file-name="`${schemaId}.json`"
    :global-filter-fields="globalFilterFields()"
    :on-data-change="handleDataChange"
  />
</template>

<style scoped>
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;
  color: #666;
}

.loading-container p,
.error-container p {
  margin-top: 16px;
  font-size: 16px;
}
</style>
