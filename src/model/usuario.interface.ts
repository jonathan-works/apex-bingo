import { PessoaRequest, PessoaResponse } from "./pessoa.interface";
import { RoleResponse } from "./role.interface";
import { PageResponse } from "./page.interface";
import { Perfil } from "./perfil.enum";

export interface UsuarioResponse{
  codigo?: number,
  pessoa: PessoaResponse,
  roles: RoleResponse[]
}

export interface UsuarioRequest{
  codigo?: number,
  pessoa: PessoaRequest,
  roles: RoleResponse[],
  perfil: Perfil
  password: string
}

export interface UsuarioFilter{
  nome?: string,
  documento?: string,
}

export interface PageUsuarioResponse extends PageResponse<UsuarioResponse[]> {}