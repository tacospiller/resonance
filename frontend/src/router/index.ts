import { createRouter, createWebHistory } from 'vue-router';

const LAST_ROUTE_KEY = 'lastVisitedRoute';

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

// 라우트 변경 후 마지막 경로 저장
router.afterEach((to) => {
  // 루트 경로가 아닌 경우에만 저장
  if (to.path !== '/') {
    localStorage.setItem(LAST_ROUTE_KEY, to.path);
  }
});

// 루트 경로 접속 시 마지막 경로로 리다이렉트
router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    const lastRoute = localStorage.getItem(LAST_ROUTE_KEY);
    if (lastRoute) {
      next(lastRoute);
      return;
    }
  }
  next();
});

export default router;
