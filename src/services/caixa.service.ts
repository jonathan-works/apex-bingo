import useApi from 'src/composable/UseApi';
import { CaixaFilter, DadosCaixaResponse, LancamentoCaixaRequest } from 'src/model/caixa.interface';

export const caixaService = {
  async list(request: CaixaFilter): Promise<DadosCaixaResponse> {
    return await useApi('/api/v1/caixas').list(request);
  },
  async create(request: LancamentoCaixaRequest): Promise<LancamentoCaixaRequest> {
    return await useApi('/api/v1/caixas').post(request);
  },
};
