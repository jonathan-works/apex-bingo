import useApi from 'src/composable/UseApi';
import { EventoFilter, EventoRequest, EventoResponse } from 'src/model/evento.interface';

export const eventoService = {
  async list(filter: EventoFilter| null = null, page = 0, size = 10, order = 'desc', coluna = 'codigo'): Promise<PageEventoResponse> {
    return await useApi('/api/v1/eventos').list({ filter, page, size, order, coluna });
  },

  async listAll(): Promise<EventoResponse[]> {
    return await useApi('/api/v1/eventos/todos').list();
  },

  async create(request: EventoRequest): Promise<EventoResponse> {
    return await useApi('/api/v1/eventos').post(request);
  },

  async update(id: number, request: EventoRequest): Promise<EventoResponse> {
    return await useApi('/api/v1/eventos').update(request, id);
  },

  async delete(id: number): Promise<void> {
    return await useApi('/api/v1/eventos').remove(id);
  },

  async findById(id: number): Promise<EventoResponse> {
    return await useApi(`/api/v1/eventos/${id}`).list();
  }
};
