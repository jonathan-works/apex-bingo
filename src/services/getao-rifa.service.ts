import useApi from 'src/composable/UseApi';
import { CartelaFilter, GestaoRifaResponse, PageGestaoRifaResponse } from 'src/model/cartela-rifa.interface';
import { GestaoRifaRequest } from 'src/model/gestao-rifa.interface';

export const gestaoRifaService = {
  async list(filter: CartelaFilter| null = null, page = 0, size = 10, order = 'desc', coluna = 'codigo'): Promise<PageGestaoRifaResponse> {
    return await useApi('/api/v1/cartelas').list({ filter, page, size, order, coluna });
  },

  async create(request: GestaoRifaRequest): Promise<GestaoRifaResponse> {
    return await useApi('/api/v1/cartelas').post(request);
  },

  async update(id: string, request: GestaoRifaRequest): Promise<GestaoRifaResponse> {
    return await useApi('/api/v1/cartelas').update(request, id);
  },

  async delete(id: string): Promise<void> {
    return await useApi('/api/v1/cartelas').remove(id);
  },

  async findById(id: string): Promise<GestaoRifaResponse> {
    return await useApi(`/api/v1/cartelas/${id}`).list();
  }
};
