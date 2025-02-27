<template>
  <div>
    <q-tabs
        v-model="tab"
        inline-label
        class="bg-secondary text-white shadow-2"
      >
      <q-tab v-if="authStore.tipoUser === 'CAIXA'" name="caixa" icon="point_of_sale" label="No caixa"/>
      <q-tab name="abertos" icon="assignment" label="Abertos"/>
      <!-- <q-tab name="cancelados" icon="cancel" label="Cancelados"/> -->
      <q-tab v-if="authStore.tipoUser === 'BARBEIRO'" name="fechados" icon="check_circle" label="Fechados"/>
      <q-tab name="concluidos" icon="check_circle" label="Concluídos"/>
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="caixa" class="q-col-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <q-input
              v-model="pedidoStore.caridaDataIncio"
              type="date"
              label="Data Início"
              outlined
              dense
              @update:model-value="pedidoStore.carregarPedidosAbertos"
            />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              v-model="pedidoStore.caridaDataFim"
              type="date"
              label="Data Fim"
              outlined
              dense
              @update:model-value="pedidoStore.carregarPedidosAbertos"
            />
          </div>
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-card class="bg-positive text-white">
              <q-card-section>
                <div class="text-h6">Total em Caixa</div>
                <div class="row items-center justify-between">
                  <div class="text-h3 q-mt-sm q-pb-md">{{ mascaraValor(pedidoStore.transacoesFinanceirasCaixa?.saldo) }}</div>
                  <q-btn
                    :icon="valoresVisiveis ? 'visibility' : 'visibility_off'"
                    flat
                    round
                    dense
                    @click="valoresVisiveis = !valoresVisiveis"
                  />
                </div>
                <q-separator dark class="q-my-md" />
                <div class="row justify-between items-center">
                  <div>
                    <div class="text-subtitle2">Créditos</div>
                    <div class="text-h6">{{ mascaraValor(pedidoStore.transacoesFinanceirasCaixa?.totalCredito) }}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-subtitle2">Débitos</div>
                    <div class="text-h6">{{ mascaraValor(pedidoStore.transacoesFinanceirasCaixa?.totalDebito) }}</div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-6">
            <q-card class="bg-secondary text-white">
              <q-card-section>
                <div class="text-h6 q-mb-sm">Por Meio de Pagamento</div>
                <div class="row items-center q-mb-sm">
                  <q-icon name="payments" size="sm" class="q-mr-sm" />
                  <div class="text-subtitle1">Dinheiro</div>
                  <div class="text-h6 q-ml-auto">{{ mascaraValor(pedidoStore.transacoesFinanceirasCaixa?.dinheiro) }}</div>
                </div>
                <div class="row items-center q-mb-sm">
                  <q-icon name="credit_card" size="sm" class="q-mr-sm" />
                  <div class="text-subtitle1">Cartão Crédito</div>
                  <div class="text-h6 q-ml-auto">{{ mascaraValor(pedidoStore.transacoesFinanceirasCaixa?.cartaoCredito) }}</div>
                </div>
                <div class="row items-center q-mb-sm">
                  <q-icon name="credit_card" size="sm" class="q-mr-sm" />
                  <div class="text-subtitle1">Cartão Débito</div>
                  <div class="text-h6 q-ml-auto">{{ mascaraValor(pedidoStore.transacoesFinanceirasCaixa?.cartaoDebito) }}</div>
                </div>
                <div class="row items-center">
                  <q-icon name="qr_code" size="sm" class="q-mr-sm" />
                  <div class="text-subtitle1">PIX</div>
                  <div class="text-h6 q-ml-auto">{{ mascaraValor(pedidoStore.transacoesFinanceirasCaixa?.pix) }}</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-md-3" v-for="lancamento in pedidoStore.transacoesFinanceirasCaixa?.lancamentos" :key="lancamento.codigo as string">
            <CardLancamento :lancamento="lancamento"/>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="abertos" class="row q-col-gutter-md fill">
        <div class="col-12 col-md-3" v-for="pedido in pedidoStore.pedidosAbertos" :key="pedido.codigo as string">
          <CardPedido :pedido="pedido" :comanda="pedido.numeroPedido" @update:model-value="pedidoStore.carregarPedidosAbertos"/>
        </div>
        <div class="q-pa-md flex justify-center full-width">
          <q-pagination
            v-model="pedidoStore.paginationPedidosAbertos.page"
            color="primary"
            :max="pedidoStore.paginationPedidosAbertos.rowsNumber / pedidoStore.paginationPedidosAbertos.rowsPerPage"
            :max-pages="10"
            boundary-numbers
            @update:model-value="pedidoStore.carregarPedidosAbertos"
          />
        </div>
      </q-tab-panel>
      <q-tab-panel name="cancelados" class="row q-col-gutter-md">
        <div class="col-12 col-md-3" v-for="pedido in pedidoStore.pedidosCancelados" :key="pedido.codigo as string">
          <CardPedido :pedido="pedido" :comanda="pedido.numeroPedido" @update:model-value="pedidoStore.carregarPedidosCancelados"/>
        </div>
        <div class="q-pa-md flex justify-center full-width">
          <q-pagination
            v-model="pedidoStore.paginationPedidosCancelados.page"
            color="primary"
            :max="pedidoStore.paginationPedidosCancelados.rowsNumber / pedidoStore.paginationPedidosCancelados.rowsPerPage"
            :max-pages="10"
            boundary-numbers
            @update:model-value="pedidoStore.carregarPedidosCancelados"
          />
        </div>
      </q-tab-panel>
      <q-tab-panel name="fechados" class="row q-col-gutter-md">
        <div class="col-12 col-md-3" v-for="pedido in pedidoStore.pedidosFechados" :key="pedido.codigo as string">
          <CardPedido :pedido="pedido" :comanda="pedido.numeroPedido" @update:model-value="pedidoStore.carregarPedidosFechados"/>
        </div>
        <div class="q-pa-md flex justify-center full-width">
          <q-pagination
            v-model="pedidoStore.paginationPedidosFechados.page"
            color="primary"
            :max="pedidoStore.paginationPedidosFechados.rowsNumber / pedidoStore.paginationPedidosFechados.rowsPerPage"
            :max-pages="10"
            boundary-numbers
            @update:model-value="pedidoStore.carregarPedidosFechados"
          />
        </div>
      </q-tab-panel>
      <q-tab-panel name="concluidos" class="row q-col-gutter-md">
        <div class="col-12 col-md-3" v-for="pedido in pedidoStore.pedidosConcluidos" :key="pedido.codigo as string">
          <CardPedido :pedido="pedido" :comanda="pedido.numeroPedido" @update:model-value="pedidoStore.carregarPedidosConcluidos"/>
        </div>
        <div class="q-pa-md flex justify-center full-width">
          <q-pagination
            v-model="pedidoStore.paginationPedidosConcluidos.page"
            color="primary"
            :max="pedidoStore.paginationPedidosConcluidos.rowsNumber / pedidoStore.paginationPedidosConcluidos.rowsPerPage"
            :max-pages="10"
            boundary-numbers
            @update:model-value="pedidoStore.carregarPedidosConcluidos"
          />
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="secondary" :to="{name: 'pedido'}">Incluir pedido</q-btn>
    </q-page-sticky>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { usePedidoStore } from 'src/stores/pedido.store';

const valoresVisiveis = ref(false);

function mascaraValor(valor: number) {
  if (valoresVisiveis.value) {
    return formatToBRL(valor || 0);
  }
  return 'R$ XXXX,XX';
}

function formatToBRL(value: number) {
  if(!value) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
import CardPedido from 'src/components/card/CardPedido.vue';
import CardLancamento from 'src/components/card/CardLancamento.vue';
import { useAuthStore } from 'src/stores/auth.store';

const tab = ref('abertas')
const pedidoStore = usePedidoStore();
const authStore = useAuthStore();
pedidoStore.carregarPedidosAbertos();
// pedidoStore.carregarPedidosCancelados();
pedidoStore.carregarPedidosFechados();
pedidoStore.carregarPedidosConcluidos();
pedidoStore.carregarLancamentosNoCaixa();

tab.value = 'fechados';
if (authStore.tipoUser === 'CAIXA' && tab.value !== 'caixa') {
  tab.value = 'caixa';
}

watch(() => authStore.tipoUser, () => {
  if (authStore.tipoUser !== 'CAIXA' && tab.value === 'caixa') {
    tab.value = 'abertos';
  }else if(authStore.tipoUser === 'CAIXA' && tab.value !== 'caixa'){
    tab.value = 'caixa';
  }
})
</script>
