import axios from 'axios';
import { boot } from 'quasar/wrappers';
import { useAuthStore } from 'src/stores/auth.store';
import { Router } from 'vue-router';

const api = axios.create({
  baseURL: 'https://apex-sort.2apex.com.br'
});

export default boot(({ router }) => {
  api.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    const token = authStore.authToken?.token || authStore.getStoredAuthToken()?.token;
    const schemaCliente =  authStore.clienteConfigGestor?.schemaCliente || authStore.getStoredClienteConfigGestor()?.schemaCliente

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (schemaCliente) {
      config.headers.schema = schemaCliente;
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const authStore = useAuthStore();

      const logout = () => {
        authStore.logout();
        router.push('/login');
      }

      if ((!authStore.tokenValido() || error.response?.status === 401) && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newAuthToken = await authStore.refreshToken();
          authStore.setAuthToken(newAuthToken);
          originalRequest.headers.Authorization = `Bearer ${newAuthToken.token}`;
          return api(originalRequest);
        } catch (refreshError) {
          logout();
          return Promise.reject(refreshError);
        }
      } else {
        logout();
      }

      return Promise.reject(error);
    }
  );
});

export { api };
