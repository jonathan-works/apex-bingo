import { defineStore } from 'pinia';
import { AxiosResponse } from 'axios';
import { jwtDecode} from "jwt-decode";
import { authService } from 'src/services/auth.service';
import { cryptoService } from 'src/services/crypto.service';
import { ClienteConfigGestor } from 'src/model/cliente-config.interface';
import { AuthResponse, AuthToken, AuthTokenGestor } from 'src/model/auth-token.interface';

const AUTH_TOKEN_KEY = 'auth_token';
const CLIENT_CONFIG_KEY = 'client_config';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authToken: null as AuthToken | null,
    authTokenGestor: null as AuthTokenGestor | null,
    clienteConfigGestor: null as ClienteConfigGestor | null,
    isRefreshing: false,
    refreshSubscribers: [] as Array<(authToken: AuthResponse) => void>
  }),

  getters: {
    isAuthenticated: (state) => {
      if (state.authToken?.token) return true;

      const storedToken = sessionStorage.getItem(AUTH_TOKEN_KEY);
      if (storedToken) {
        try {
          const decryptedToken = cryptoService.decrypt(storedToken);
          state.authToken = JSON.parse(decryptedToken);
          return true;
        } catch {
          sessionStorage.removeItem(AUTH_TOKEN_KEY);
        }
      }
      return false;
    },

    token: (state) => {
      return state.authToken?.token || sessionStorage.getItem(AUTH_TOKEN_KEY);
    },

    storedClienteConfigGestor: (state) => {
      if (state.clienteConfigGestor) return state.clienteConfigGestor;

      const storedConfig = sessionStorage.getItem(CLIENT_CONFIG_KEY);
      if (storedConfig) {
        try {
          const decryptedConfig = cryptoService.decrypt(storedConfig);
          state.clienteConfigGestor = JSON.parse(decryptedConfig);
          return state.clienteConfigGestor;
        } catch {
          sessionStorage.removeItem(CLIENT_CONFIG_KEY);
        }
      }
      return null;
    },

    tipoUser: (state) => {
      return state.authToken?.perfil || localStorage.getItem("tipoUser") || "BARBEIRO";
    }
  },

  actions: {
    tokenValido(){
      try {
        const token = useAuthStore().token;
        const decoded = jwtDecode(token as string);
        const currentTime = Date.now() / 1000;
        return decoded.exp && decoded.exp > currentTime
      } catch (error) {
        return false
      }
    },

    async login(username: string, password: string, codigoCliente: string) {

      const usernameGestor = "adrianoaguiardez@gmail.com";
      const passwordGestor = "#2024Log";

      if (!this.storedClienteConfigGestor) {
        await authService.loginGestor(usernameGestor, passwordGestor)
          .then(({ data }: AxiosResponse<AuthTokenGestor>) => {

            this.authTokenGestor = data;

            return authService.verificarClienteGestor(codigoCliente, data.token)
              .then(({ data: clienteData }: AxiosResponse<ClienteConfigGestor>) => {
                this.setClienteConfigGestor(clienteData);
              });
          });
      }

      return authService.login(username, password)
              .then((data: AuthToken) => {
                this.setAuthToken(data);
              })
    },

    setAuthToken(token: AuthToken) {
      this.authToken = token;
      const encrypted = cryptoService.encrypt(JSON.stringify(token));
      sessionStorage.setItem(AUTH_TOKEN_KEY, encrypted);
    },

    setClienteConfigGestor(config: ClienteConfigGestor) {
      this.clienteConfigGestor = config;
      const encrypted = cryptoService.encrypt(JSON.stringify(config));
      sessionStorage.setItem(CLIENT_CONFIG_KEY, encrypted);
    },

    getStoredAuthToken(): AuthToken | null {
      const storedToken = sessionStorage.getItem(AUTH_TOKEN_KEY);
      if (!storedToken) return null;

      try {
        const decryptedToken = cryptoService.decrypt(storedToken);
        return JSON.parse(decryptedToken);
      } catch {
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
        return null;
      }
    },
    getStoredClienteConfigGestor(): ClienteConfigGestor | null {
      const storedClienteConfigGestor= sessionStorage.getItem(CLIENT_CONFIG_KEY);
      if (!storedClienteConfigGestor) return null;

      try {
        const decryptedClienteConfig = cryptoService.decrypt(storedClienteConfigGestor);
        return JSON.parse(decryptedClienteConfig);
      } catch {
        sessionStorage.removeItem(CLIENT_CONFIG_KEY);
        return null;
      }
    },

    logout() {
      this.authToken = null;
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
    },

    changeClientConfig(){
      this.clienteConfigGestor = null;
      sessionStorage.removeItem(CLIENT_CONFIG_KEY);
    },

    async refreshToken(): Promise<AuthResponse> {
      if (this.isRefreshing) {
        return new Promise((resolve) => {
          this.refreshSubscribers.push((authResponse: AuthResponse) => {
            resolve(authResponse);
          });
        });
      }

      this.isRefreshing = true;

      try {
        const storedAuthToken: AuthToken | null = this.getStoredAuthToken();
        if (!storedAuthToken?.token) {
          throw new Error('No refresh token available');
        }

        const authResponse: AuthResponse = await authService.refreshToken(storedAuthToken.refreshToken);

        const newAuthToken = {
          ...storedAuthToken
        } as AuthToken;

        newAuthToken.token = authResponse.access_token;
        newAuthToken.refreshToken = authResponse.refresh_token;

        this.setAuthToken(newAuthToken);

        this.refreshSubscribers.forEach(callback => callback(authResponse));
        this.refreshSubscribers = [];

        return authResponse;
      } catch (error) {
        this.logout();
        throw error;
      } finally {
        this.isRefreshing = false;
      }
    },

    onRefreshToken(callback: (authToken: AuthResponse) => void) {
      this.refreshSubscribers.push(callback);
    },

    setTipo(tipo: 'BARBEIRO' | 'CAIXA') {
      if (this.authToken) {
        this.authToken.perfil = tipo;
        localStorage.setItem("tipoUser", tipo);
      }
    }

  },
});
