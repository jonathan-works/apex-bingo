<template>
  <q-tab-panel name="servicos" class="row q-col-gutter-md">
    <div class="col-12 col-md-6" v-for="produto in pedidoStore.produtos">
      <q-card :key="produto.codigo as number" flat bordered>
        <q-card-section horizontal>
          <q-card-section class="q-pt-xs">
            <div class="text-overline">Produto</div>
            <div class="text-h5 q-mt-sm q-mb-xs">{{produto.nome}}</div>
            <div class="text-caption text-grey">
              {{produto.descricao}}
            </div>
          </q-card-section>
        </q-card-section>
        <q-separator />
        <q-card-actions align="between">
          <q-btn flat>
            {{formatToBRL(produto.valorVenda)}}
          </q-btn>
          <q-btn flat color="accent" icon="add" @click="adicionarCarrinho(produto)">
            Adicionar
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-tab-panel>
</template>

<script setup lang="ts">
import { ItemPedido } from 'src/model/pedido.interface';
import { Produto } from 'src/model/produto.interface';
import { usePedidoComandaStore } from 'src/stores/pedido-comanda.store'
import { useRouter } from 'vue-router';
const pedidoStore = usePedidoComandaStore();
pedidoStore.carregarProdutos();

function formatToBRL(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function adicionarCarrinho(produto: Produto){
  const item: ItemPedido = {
    produto: produto,
    quantidade: 1,
    valorUnitario: produto.valorVenda
  } as ItemPedido;

  const router = useRouter();

  pedidoStore.adicionarCarrinho(item, router);
}
</script>
