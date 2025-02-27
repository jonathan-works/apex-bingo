<template>
  <q-tab-panel name="servicos" class="row q-col-gutter-md">
    <div class="col-12 col-md-6" v-for="servico in pedidoStore.servicos" :key="servico.codigo as number">
      <q-card class="my-card" flat bordered>
        <q-card-section horizontal>
          <q-card-section class="q-pt-xs">
            <div class="text-overline">Serviço</div>
            <div class="text-h5 q-mt-sm q-mb-xs">{{servico.nome}}</div>
            <div class="text-caption text-grey">
              {{servico.descricao}}
            </div>
          </q-card-section>
        </q-card-section>
        <q-separator />
        <q-card-actions align="between">
          <q-btn flat>
            tempo médio:
            {{servico.duracao}} min
          </q-btn>
          <q-btn flat color="accent" icon="add" @click="adicionarCarrinho(servico)">
            Adicionar
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-tab-panel>
</template>

<script setup lang="ts">
import { ItemPedido } from 'src/model/pedido.interface';
import { Servico } from 'src/model/servico.interface';
import { usePedidoComandaStore } from 'src/stores/pedido-comanda.store'
import { useRouter } from 'vue-router';
const pedidoStore = usePedidoComandaStore();
pedidoStore.carregarServicos();

function adicionarCarrinho(servico: Servico){
  servico.codigo = servico.id as number;
  const item: ItemPedido = {
    servico: servico,
    quantidade: 1,
    valorUnitario: servico.valor
  } as ItemPedido;

  const router = useRouter();

  pedidoStore.adicionarCarrinho(item, router);
}
</script>
