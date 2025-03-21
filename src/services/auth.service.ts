import useApi from "src/composable/UseApi";
import axios, { AxiosResponse } from "axios";
import { ClienteConfigGestor } from "src/model/cliente-config.interface";
import { AuthResponse, AuthToken, AuthTokenGestor } from "src/model/auth-token.interface";

export const authService = {
    async loginGestor(username: string, password: string): Promise<AxiosResponse<AuthTokenGestor>> {
      return await axios.post<AuthTokenGestor>('https://gestor-api.2apex.com.br/token', null,
        {
          auth: {
            username,
            password
          }
        }
      );
    },
    async verificarClienteGestor(codigoCliente: string, token: string): Promise<AxiosResponse<ClienteConfigGestor>> {
      return await axios.get<ClienteConfigGestor>(`https://gestor-api.2apex.com.br/verificar-cliente/${codigoCliente}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    },
    async login(username: string, password: string): Promise<AuthToken> {
      return await useApi('/login').post({username, password}, {
        headers: {
          'Authorization': null
        }
      });
    },
    async refreshToken(refreshToken: string): Promise<AuthResponse> {
      return await useApi('/refresh').post(null, {
        params: {
          refresh_token: refreshToken
        }
      });
    }
}
