import { api } from 'src/boot/axios';
import { Pagamento } from 'src/model/pagamento.interface';

export const pagamentoService = {
  async registrarPagamento(pagamento: Pagamento) {
    return await api.post('api/v1/pagamentos', pagamento);
  },
};
