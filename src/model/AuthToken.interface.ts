export interface AuthTokenGestor {
  email: string;
  expireIn: number;
  nome: string;
  roles: string[];
  token: string;
  uuidv4: string;
}

// export interface AuthToken {
//   access_token: string;
//   expires_in: number;
//   refresh_expires_in: number;
//   refresh_token: string;
//   token_type: string;
//   'not-before-policy': number;
//   session_state: string;
//   scope: string;
//   tipo: "BARBEIRO" | "CAIXA";
// }
export interface AuthToken {
  codigo: number;
  email: string;
  nome: string;
  perfil: "BARBEIRO" | "CAIXA";
  refreshToken: string;
  token: string;
}
