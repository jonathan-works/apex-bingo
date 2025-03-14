import useApi from 'src/composable/UseApi';
import { DevolverCartelaRequest, ReceberCartelaRequest } from 'src/model/cartela.interface';
import { GestaoCartelaFilter, GestaoCartelaItemResponse, GestaoCartelaRequest, GestaoCartelaResponse, PageGestaoCartelaResponse } from 'src/model/gestao-cartela.interfave';

export const gestaoCartelaService = {
  async list(filter: GestaoCartelaFilter| null = null, page = 0, size = 10, order = 'desc', coluna = 'codigo'): Promise<PageGestaoCartelaResponse> {
    return await useApi('/api/v1/gestao-cartelas').list({ filter, page, size, order, coluna });
  },

  async create(request: GestaoCartelaRequest): Promise<GestaoCartelaResponse> {
    return await useApi('/api/v1/gestao-cartelas').post(request);
  },

  async update(id: string, request: GestaoCartelaRequest): Promise<GestaoCartelaResponse> {
    return await useApi('/api/v1/gestao-cartelas').update(request, id);
  },

  async receberCartela(gestaoCartelaCodigo: number, gestaoCodigo: number, receberCartela: ReceberCartelaRequest): Promise<GestaoCartelaItemResponse> {
    return await useApi(`/api/v1/gestao-cartelas/receber-cartela/${gestaoCartelaCodigo}/gestao/${gestaoCodigo}/cartela`).patch(receberCartela);
  },

  async informarSorteada(gestaoCartelaCodigo: number, gestaoCodigo: number, receberCartela: ReceberCartelaRequest): Promise<GestaoCartelaItemResponse> {
    return await useApi(`/api/v1/gestao-cartelas/informar-sorteada/${gestaoCartelaCodigo}/gestao/${gestaoCodigo}/cartela`).patch(receberCartela);
  },

  async informarGanhador(gestaoCartelaCodigo: number, gestaoCodigo: number, receberCartela: ReceberCartelaRequest): Promise<GestaoCartelaItemResponse> {
    return await useApi(`/api/v1/gestao-cartelas/informar-ganhadora/${gestaoCartelaCodigo}/gestao/${gestaoCodigo}/cartela`).patch(receberCartela);
  },

  async delete(id: string): Promise<void> {
    return await useApi('/api/v1/gestao-cartelas').remove(id);
  },

  async devolver(codigo: string): Promise<void> {
    return await useApi(`/api/v1/gestao-cartelas/${codigo}/devolucao`).remove(id);
  },

  async findById(id: string): Promise<GestaoCartelaResponse> {
    return await useApi(`/api/v1/gestao-cartelas/${id}`).list();
  }
};
