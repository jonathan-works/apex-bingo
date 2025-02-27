<template>
  <div>
    <q-tabs
        v-model="tab"
        inline-label
        class="bg-secondary text-white shadow-2"
      >
        <q-tab name="servicos" icon="room_service" label="Serviços" />
        <q-tab name="produtos" icon="inventory_2" label="Produtos" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <TabServico name="servicos"/>
      <TabProduto name="produtos"/>
    </q-tab-panels>

    <DrawerComandaDigital v-model="pedidoComandaStore.drawerComandaDigitalIsOpen"></DrawerComandaDigital>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="shopping_cart" color="secondary" @click="pedidoComandaStore.toogleCarrinho">
        <q-badge v-if="pedidoComandaStore.quantidade > 0" color="red" floating>
          {{pedidoComandaStore.quantidade}}
        </q-badge>
        Comanda Digital
      </q-btn>
    </q-page-sticky>
    <q-page-sticky position="bottom-left" :offset="[18, 18]">
      <q-btn fab icon="arrow_back" color="secondary" :to="{name: 'pedidos'}">
        Voltar
      </q-btn>
    </q-page-sticky>
  </div>
</template>

<script setup lang="ts">
import DrawerComandaDigital from 'components/drawer/DrawerComandaDigital.vue'
import TabServico from 'components/tab/TabServico.vue'
import TabProduto from 'components/tab/TabProduto.vue'
import { ref, watch } from 'vue';
import { usePedidoComandaStore } from 'src/stores/pedido-comanda.store';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth.store';

const route = useRoute();
const router = useRouter();

const tab = ref('servicos')
const pedidoComandaStore = usePedidoComandaStore();
const authStore = useAuthStore();

const codigoPedido = route.query?.p;
if(codigoPedido){
  pedidoComandaStore.carregarPedido(codigoPedido as string).then(() =>{
    pedidoComandaStore.toogleCarrinho(true);
  });
}else{
  pedidoComandaStore.clienteSelecionado = null;
  pedidoComandaStore.pedido = null;
  if(pedidoComandaStore.drawerComandaDigitalIsOpen){
    pedidoComandaStore.toogleCarrinho(false);
  }
}

watch(() => authStore.tipoUser, () => {
  if(authStore.tipoUser === 'CAIXA' && pedidoComandaStore.pedido?.status !== "FECHADO"){
    router.push({name: "pedidos"});
  }
})

</script>
