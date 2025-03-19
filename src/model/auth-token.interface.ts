export interface AuthTokenGestor {
  email: string;
  expireIn: number;
  nome: string;
  roles: string[];
  token: string;
  uuidv4: string;
}

export interface AuthToken {
  codigo: number;
  email: string;
  nome: string;
  perfil: "BARBEIRO" | "CAIXA";
  refreshToken: string;
  token: string;
}

export interface AuthTokenRefresh {
  codigo: number;
  email: string;
  nome: string;
  perfil: "BARBEIRO" | "CAIXA";
  refreshToken: string;
  token: string;

  access_token: string;
  expires_in: number;

}

export interface AuthResponse {
  access_token: string;
  expires_in: number;
  'not-before-policy': number;
  refresh_expires_in: number;
  refresh_token: string;
  scope: string;
  session_state: string;
  token_type: string;
}
