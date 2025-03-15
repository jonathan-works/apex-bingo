import useApi from 'src/composable/UseApi';
import { CartelaFilter, CartelaRequest, CartelaResponse } from 'src/model/cartela.interface';

export const cartelaService = {
  async list(filter: CartelaFilter | null = null, page = 0, size = 10, order = 'desc', coluna = 'codigo'): Promise<PageGestaoRifaResponse> {
    return await useApi('/api/v1/cartelas').list({ filter, page, size, order, coluna });
  },

  async listAll(): Promise<CartelaResponse[]> {
    return await useApi('/api/v1/cartelas/todos').list();
  },

  async create(request: CartelaRequest): Promise<CartelaResponse> {
    return await useApi('/api/v1/cartelas').post(request);
  },

  async update(id: string, request: CartelaRequest): Promise<CartelaResponse> {
    return await useApi('/api/v1/cartelas').update(request, id);
  },

  async delete(id: string): Promise<void> {
    return await useApi('/api/v1/cartelas').remove(id);
  },

  async findById(id: string): Promise<CartelaResponse> {
    return await useApi(`/api/v1/cartelas/${id}`).list();
  }
};
