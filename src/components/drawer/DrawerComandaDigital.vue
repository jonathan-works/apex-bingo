<template>
  <q-drawer v-model="model" side="right" bordered>
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label>
            <h1 class="text-h6 text-secondary text-bold">Comanda Digital</h1>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>
            <div class="q-py-sm">
              Status:
              <q-item-label>
                <q-chip v-if="pedidoComandaStore.pedido?.status === 'CONCLUIDO'"
                color="positive" text-color="white" icon="done" size="sm">
                  CONCLUÍDO
                </q-chip>
                <q-chip v-if="pedidoComandaStore.pedido?.status === 'ABERTO'"
                text-color="negative" icon="schedule" size="sm">
                  PEDIDO ABERTO
                </q-chip>
                <q-chip v-if="pedidoComandaStore.pedido?.status === 'FECHADO'"
                color="warning" text-color="primary" icon="currency_exchange" size="sm">
                  PEDIDO FECHADO
                </q-chip>
                <q-chip v-if="pedidoComandaStore.pedido?.status === 'CANCELADO'"
                color="cancelado" text-color="primary" icon="close" size="sm">
                  PEDIDO CANCELADO
                </q-chip>
                <template v-if="!pedidoComandaStore.vazio">
                  <q-chip v-if="pedidoComandaStore.dividaQuitada"
                  color="positive" text-color="white" icon="done" size="sm">
                    PAGO
                  </q-chip>
                  <q-chip v-else-if="pedidoComandaStore.dividaParcialmenteQuitada"
                  color="warning" text-color="primary" icon="close" size="sm">
                    PARCIALMENTE PAGO
                  </q-chip>
                  <q-chip v-else-if="!pedidoComandaStore.dividaQuitada"
                  color="negative" text-color="white" icon="close" size="sm">
                    NÃO PAGO
                  </q-chip>
                </template>
              </q-item-label>
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>
              <q-item-label>
                Cliente:
              </q-item-label>
              <q-item-label v-if="!pedidoComandaStore.clienteSelecionado && !pedidoComandaStore.vazio">
                <q-btn flat icon="add" class="full-width" color="accent" label="Selecionar Cliente" @click="pedidoComandaStore.openDialogSelecaoCliente" />
              </q-item-label>
              <q-item-label v-else-if="!pedidoComandaStore.vazio">
                <div class="text-bold text-subtitle1">{{ (pedidoComandaStore.clienteSelecionado as Cliente)?.pessoa?.nome || pedidoComandaStore.clienteSelecionado }}</div>
              </q-item-label>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>
            <q-item-label>
              Carrinho:
            </q-item-label>
          </q-item-label>
        </q-item-section>
      </q-item>
      <template v-if="(pedidoComandaStore.pedido?.itens.length || 0) > 0">
        <q-item v-for="itemPedido in pedidoComandaStore.pedido?.itens" :key="itemPedido.codigo as number">
          <q-item-section side>
            <q-item-label caption class="quantidade cursor-pointer">
              <q-icon name="edit" class="edit-icon" color="secondary"/>
              {{itemPedido.quantidade}} x
              <q-popup-edit
                v-model="itemPedido.quantidade"
                auto-save
                v-slot="scope"
                @save="(val, valOld) => validarESalvar(val, valOld, itemPedido as ItemPedido)"
              >
                <q-input
                  v-model="scope.value"
                  dense autofocus counter
                  ref="inputRef"
                  @keyup.enter="scope.set"
                  :rules="[
                    val => !!val || 'Valor é obrigatório',
                    val => val > 0 || 'O Valor não pode ser negativo.'
                  ]"
                />
              </q-popup-edit>
              </q-item-label>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{itemPedido.produto?.nome || itemPedido.servico?.nome}}</q-item-label>
            <q-item-label caption lines="2">{{formatToBRL(itemPedido.produto?.valorVenda || itemPedido.servico?.valor || 0)}}</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <!-- Todo: no momento não existe serço para apagar o item -->
            <q-btn :disable="pedidoComandaStore.pedidoTodoPago || true" outline round color="negative" icon="delete" size="sm" />
          </q-item-section>
        </q-item>
      </template>
      <template v-else>
        <q-item>
          <q-item-section>
            <q-item-label>
              <q-item-section>
                <q-item-label caption>Nenhum item incluído</q-item-label>
              </q-item-section>
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <q-item v-if="!pedidoComandaStore.vazio">
        <q-item-section>
          <q-item-label class="flex justify-between text-h6 text-grey-8">
            <div>
              Total:
            </div>
            <div>
              {{ formatToBRL(pedidoComandaStore.pedido?.total  || 0) }}
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-show="pedidoComandaStore.pedido?.status !== 'CONCLUIDO'">
        <q-item-section>
          <q-item-label v-if="pedidoComandaStore.pedido?.status === 'FECHADO' && authStore.tipoUser === 'CAIXA'" class="q-gutter-y-sm">
            <div v-if="!pedidoComandaStore.pedido?.itens.length || !pedidoComandaStore.dividaQuitada">
              <q-btn :disabled="pedidoComandaStore.vazio || !pedidoComandaStore.clienteSelecionado" class="full-width" color="primary" label="Pagar" @click="pedidoComandaStore.openDialogPagamento"/>
            </div>
            <div v-else>
              <q-btn :disabled="pedidoComandaStore.vazio || !pedidoComandaStore.clienteSelecionado" class="full-width" color="primary" label="Concluir Pedido" @click="concluirPedido"/>
            </div>
            <div>
              <q-btn outline :disabled="pedidoComandaStore.vazio && !pedidoComandaStore.clienteSelecionado || !pedidoComandaStore.clienteSelecionado" class="full-width" color="accent" label="Cancelar Pedido" @click="cancelarPedido" />
            </div>
          </q-item-label>
          <q-item-label v-else class="q-gutter-y-sm">
            <div>
              <q-btn :disabled="pedidoComandaStore.vazio || !pedidoComandaStore.clienteSelecionado" class="full-width" color="black" label="Fechar Pedido" @click="fecharPedido"/>
            </div>
            <div>
              <q-btn outline :disabled="pedidoComandaStore.vazio && !pedidoComandaStore.clienteSelecionado || !pedidoComandaStore.clienteSelecionado" class="full-width" color="accent" label="Cancelar Pedido" @click="cancelarPedido" />
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <DialogSelecaoCliente
      v-model="pedidoComandaStore.dialogSelecaoClienteIsOpen"
      v-model:cliente-selecionado="pedidoComandaStore.clienteSelecionado"
      :submit="addCliente"
      />
    <DialogPagamento
      :valorTotal="pedidoComandaStore.pedido?.total || 0"
      :valorTotalPago="pedidoComandaStore.totalPago"
      :valorTotalAPagar="pedidoComandaStore.valorTotalAPagar"
      :valorTroco="pedidoComandaStore.valorTroco"
      :dividaQuitada="pedidoComandaStore.dividaQuitada"
      :pagamentos="pedidoComandaStore.pedido?.pagamentos || []"
      v-model="pedidoComandaStore.dialogPagamentoIsOpen"
      v-model:condicao-pagamento-selecionada="pedidoComandaStore.condicaoPagamentoSelecionada"
      v-model:meio-pagamento-selecionado="pedidoComandaStore.meioPagamentoSelecionado"
      v-model:valor-pago="pedidoComandaStore.valorPago as number"
      @registrar-pagamento="pedidoComandaStore.registrarPagamento"
      @finalizar-pedido="concluirPedido" />
  </q-drawer>
</template>


<script setup lang="ts">
import { Notify, useQuasar } from 'quasar';
import DialogPagamento from 'src/components/dialog/DialogPagamento.vue';
import DialogSelecaoCliente from 'src/components/dialog/DialogSelecaoCliente.vue';
import SelectCliente from 'src/components/select/SelectCliente.vue'
import { usePedidoComandaStore } from 'src/stores/pedido-comanda.store';
import { useAuthStore } from 'src/stores/auth.store';
import { computed, defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import { Produto } from 'src/model/produto.interface';
import { ItemPedido } from 'src/model/pedido.interface';
import { Cliente } from 'src/model/cliente.interface';
import useNotify from 'src/composable/UseNotify';

const notify = useNotify();

const router = useRouter();
const $q = useQuasar();
const pedidoComandaStore = usePedidoComandaStore();
const authStore = useAuthStore();
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

function formatToBRL(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

function cancelarPedido() {
  $q.dialog({
    title: 'Cancelar pedido',
    message: `Deseja realmente cancelar o pedido do Cliente: ${(pedidoComandaStore.clienteSelecionado as Cliente)?.pessoa?.nome || pedidoComandaStore.clienteSelecionado}?`,
    cancel: {
      label: 'Cancelar',
      flat: true,
      color: 'primary'
    },
    ok: {
      label: 'Excluir',
      color: 'negative'
    },
    persistent: true
  }).onOk(async () => {
    pedidoComandaStore.cancelarPedido()
  });
}
function concluirPedido(){
  pedidoComandaStore.concluirPedido()?.then(() =>{
    router.push("/pedidos");
  })
}
function fecharPedido(){
  pedidoComandaStore.fecharPedido()?.then(() =>{
    notify.notifySuccess("Pedido fechado com sucesso!");
    if(authStore.tipoUser === 'BARBEIRO'){
        pedidoComandaStore.dialogPagamentoIsOpen = false;
        pedidoComandaStore.toogleCarrinho();
        pedidoComandaStore.pedido = null;
        pedidoComandaStore.condicaoPagamentoSelecionada = null;
        pedidoComandaStore.meioPagamentoSelecionado = null;
        pedidoComandaStore.valorPago = 0
        //pedidoComandaStore.totalPago = 0;
        pedidoComandaStore.clienteSelecionado = null;
        pedidoComandaStore.condicaoPagamentoSelecionada = null;
        pedidoComandaStore.pedidoTodoPago = false;
      router.push("/pedidos");
    }
  })
}
function editarQuantidade(codigo: number, quantidade: number){
  pedidoComandaStore.editarQuantidade(codigo, quantidade);
}
function validarESalvar(val: number, valOld: number, itemPedido: ItemPedido) {
    if (!val) {
      $q.notify({ type: 'negative', message: 'Valor é obrigatório' });
      pedidoComandaStore.pedido.itens.find((i:ItemPedido) => i.codigo.codigo === itemPedido.codigo).quantidade = valOld;
      return;
    }
    if (val <= 0) {
      $q.notify({ type: 'negative', message: 'O Valor não pode ser negativo.' });
      pedidoComandaStore.pedido.itens.find((i:ItemPedido) => i.codigo.codigo === itemPedido.codigo).quantidade = valOld;
      return;
    }
    editarQuantidade(itemPedido.codigo as number, val);
}
function addCliente(){
  return pedidoComandaStore.addCliente()?.then(() => {
    notify.notifySuccess('Cliente adicionado com sucesso');
  }).catch(({response}) => {
    notify.notifyError(response?.data.msg);
    throw response;
  });
}
</script>
<style scoped>
  .edit-icon {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .quantidade:hover .edit-icon {
    opacity: 1;
  }
</style>
