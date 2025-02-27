import { Lancamento } from "./lancamento.interface";

export interface TransacaoFinanceira {
  cartaoCredito: number;
  cartaoDebito: number;
  dinheiro: number;
  pix: number;
  saldo: number;
  totalCredito: number;
  totalDebito: number;
  lancamentos: Lancamento[];
}
