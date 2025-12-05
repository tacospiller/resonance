import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
    },
    {
      path: '/:schemaId',
      name: 'schema'
    }
  ]
});

export default router;
