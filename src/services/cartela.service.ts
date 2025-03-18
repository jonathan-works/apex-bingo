import useApi from 'src/composable/UseApi';
import { CartelaFilter, CartelaRequest, CartelaResponse, PageCartelaResponse } from 'src/model/cartela.interface';
import { UploadRequest, UploadResponse } from 'src/model/upload.interface';

export const cartelaService = {
  async list(filter: CartelaFilter | null = null, page = 0, size = 10, order = 'desc', coluna = 'codigo'): Promise<PageCartelaResponse> {
    let request = { page, size, order, coluna };
    
    if(filter !== null) {
      request = { ...request, ...filter };
    }
    return await useApi('/api/v1/cartelas').list(request);
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
  },

  async uploadCartela(request: UploadRequest): Promise<UploadResponse> {
    return await useApi('/api/v1/cartelas/upload').post(request);
  }
};
