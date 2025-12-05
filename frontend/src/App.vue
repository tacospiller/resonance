<script setup lang="ts">
import { ref } from 'vue';
import Menu from 'primevue/menu';
import DataTable from './components/DataTable.vue';
import UserTable from './components/UserTable.vue';

const activeTab = ref<'products' | 'users'>('products');

const menuItems = ref([
  {
    label: '데이터 관리',
    items: [
      {
        label: '제품 데이터',
        icon: 'pi pi-box',
        command: () => {
          activeTab.value = 'products';
        }
      },
      {
        label: '사용자',
        icon: 'pi pi-user',
        command: () => {
          activeTab.value = 'users';
        }
      }
    ]
  }
]);
</script>

<template>
  <div class="app-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>📊 데이터 에디터</h2>
      </div>
      <Menu :model="menuItems" class="sidebar-menu" />
    </aside>
    <main class="main-content">
      <DataTable v-if="activeTab === 'products'" />
      <UserTable v-if="activeTab === 'users'" />
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

.main-content {
  flex: 1;
  overflow: hidden;
}
</style>
