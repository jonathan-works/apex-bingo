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
