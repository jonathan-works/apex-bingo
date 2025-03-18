<template>
  <q-drawer v-model="model" side="right" bordered>
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label>
            <h1 class="text-h6 text-secondary text-bold">Caixa</h1>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>
            <div class="q-py-sm">
              Período:
              <q-item-label>
                <q-input
                  v-model="dtI"
                  label="Data Início *"
                  type="date"
                  :rules="[val => !!val || 'Data início é obrigatória']"
                  outlined
                  dense
                />
                <q-input
                  v-model="dtF"
                  label="Data Final *"
                  type="date"
                  :rules="[
                    val => !!val || 'Data final é obrigatória',
                    val => !dtInicio || val >= dtInicio || 'Data final deve ser maior ou igual à data inicial'
                  ]"
                  outlined
                  dense
                />
                {{caixaStore.caixa}}
                <!-- <q-chip v-if="true === 'CONCLUIDO'"
                color="positive" text-color="white" icon="done" size="sm">
                  CONCLUÍDO
                </q-chip> -->
                <!-- <q-chip v-if="pedidoComandaStore.pedido?.status === 'ABERTO'"
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
                </q-chip> -->
                <template v-if="true">
                  <!-- <q-chip v-if="true" color="positive" text-color="white" icon="done" size="sm">
                    PAGO
                  </q-chip> -->
                  <!-- <q-chip v-else-if="pedidoComandaStore.dividaParcialmenteQuitada"
                  color="warning" text-color="primary" icon="close" size="sm">
                    PARCIALMENTE PAGO
                  </q-chip> -->
                  <!-- <q-chip v-else-if="!pedidoComandaStore.dividaQuitada"
                  color="negative" text-color="white" icon="close" size="sm">
                    NÃO PAGO
                  </q-chip> -->
                </template>
              </q-item-label>
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>
              <!-- <q-item-label>
                Cliente:
              </q-item-label> -->
              <!-- <q-item-label v-if="!pedidoComandaStore.clienteSelecionado && !pedidoComandaStore.vazio">
                <q-btn flat icon="add" class="full-width" color="accent" label="Selecionar Cliente" @click="pedidoComandaStore.openDialogSelecaoCliente" />
              </q-item-label>
              <q-item-label v-else-if="!pedidoComandaStore.vazio">
                <div class="text-bold text-subtitle1">{{ (pedidoComandaStore.clienteSelecionado as Cliente)?.pessoa?.nome || pedidoComandaStore.clienteSelecionado }}</div>
              </q-item-label> -->
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>
            <!-- <q-item-label>
              Carrinho:
            </q-item-label> -->
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>


<script setup lang="ts">
import DialogSelecaoCliente from 'src/components/dialog/DialogSelecaoCliente.vue';
import DialogPagamento from 'src/components/dialog/DialogPagamento.vue';
import SelectCliente from 'src/components/select/SelectCliente.vue'
import { computed, defineProps, defineEmits, watch, ref } from 'vue';
import { useCaixaStore } from 'src/stores/caixa.store'
import { useAuthStore } from 'src/stores/auth.store';
import useNotify from 'src/composable/UseNotify';
import { Notify, useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const notify = useNotify();
const router = useRouter();
const $q = useQuasar();

const date = new Date();
date.setDate(date.getDate() - 30);
const dtI = ref<string>(date.toISOString().split('T')[0] as string);
const dtF = ref<string>(new Date().toISOString().split('T')[0] as string);

const dataInicio = computed({
  get: () => dtI.value.split('-').reverse().join('/'),
  set: (value) => dtI.value = value.split('/').reverse().join('-'),
});

const dataFinal = computed({
  get: () => dtF.value.split('-').reverse().join('/'),
  set: (value) => dtF.value = value.split('/').reverse().join('-'),
});

const authStore = useAuthStore();
const caixaStore = useCaixaStore();

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

watch(() => model.value, (open) => {
  if (open) {
    caixaStore.getCaixa(dataInicio.value, dataFinal.value);
  } 
}, { immediate: true });

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
