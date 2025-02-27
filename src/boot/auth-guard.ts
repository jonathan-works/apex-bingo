import { boot } from 'quasar/wrappers';
import { useAuthStore } from 'src/stores/auth.store';

export default boot(({ router }) => {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next('/login');
    } else if (to.path === '/login' && authStore.isAuthenticated) {
      next('/');
    } else {
      next();
    }
  });
});
