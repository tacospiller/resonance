<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Menu from 'primevue/menu';
import SchemaTable from './components/SchemaTable.vue';
import { api, type Schema } from './services/api';

const route = useRoute();
const router = useRouter();

const activeTab = computed(() => route.params.schemaId as string || 'products');
const schemas = ref<Schema[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const menuItems = ref([]);

const loadSchemas = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await api.getSchemas();
    schemas.value = response.schemas;

    // 백엔드에서 받아온 스키마를 메뉴에 추가
    if (schemas.value.length > 0) {
      const schemaItems = schemas.value.map(schema => ({
        label: schema.name,
        icon: 'pi pi-database',
        command: () => {
          router.push(`/${schema.id}`);
        }
      }));

      menuItems.value.push({
        label: '백엔드 스키마',
        items: schemaItems
      });
    }
  } catch (err) {
    error.value = '스키마를 불러오는데 실패했습니다. 백엔드 서버가 실행 중인지 확인하세요.';
    console.error('Failed to load schemas:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadSchemas();
});
</script>

<template>
  <div class="app-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>📊 데이터 에디터</h2>
      </div>
      <div v-if="loading" class="loading-message">
        <i class="pi pi-spin pi-spinner"></i> 로딩 중...
      </div>
      <div v-else-if="error" class="error-message">
        <i class="pi pi-exclamation-triangle"></i> {{ error }}
      </div>
      <Menu v-else :model="menuItems" class="sidebar-menu" />
    </aside>
    <main class="main-content">
      <SchemaTable v-if="schemas.find(s => s.id === activeTab)" :schema-id="activeTab" />
    </main>
  </div>
</template>

<style>
.app-container {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: #f8f9fa;
}

.sidebar {
  width: 280px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  border-right: 1px solid #e9ecef;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.sidebar-menu {
  border: none;
  border-radius: 0;
  width: 100%;
  padding: 10px;
}

.loading-message,
.error-message {
  padding: 20px;
  text-align: center;
  color: #666;
}

.error-message {
  color: #e74c3c;
}

.loading-message i,
.error-message i {
  margin-right: 8px;
}

.main-content {
  flex: 1;
  overflow: hidden;
}

.schema-placeholder {
  padding: 40px;
  text-align: center;
}

.schema-placeholder h2 {
  color: #333;
  margin-bottom: 16px;
}

.schema-placeholder p {
  color: #666;
  margin: 8px 0;
}

.schema-placeholder code {
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
}
</style>
