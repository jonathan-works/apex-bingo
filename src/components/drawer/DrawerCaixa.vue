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
                  v-model="caixaStore.dtI"
                  label="Data Início *"
                  type="date"
                  :rules="[val => !!val || 'Data início é obrigatória']"
                  outlined
                  dense
                />
                <q-input
                  v-model="caixaStore.dtF"
                  label="Data Final *"
                  type="date"
                  :rules="[
                    val => !!val || 'Data final é obrigatória',
                    val => !dtI || val >= dtI || 'Data final deve ser maior ou igual à data inicial'
                  ]"
                  outlined
                  dense
                />
                <q-card flat bordered >
                  <q-card-section>
                    <table class="full-width">
                      <tbody>
                        <tr v-for="row in caixaStore.caixa ? [
                          { label: 'Dinheiro', value: formatToBRL(caixaStore.caixa.dinheiro), positivo: caixaStore.caixa.dinheiro > 0 },
                          { label: 'Cartão de Crédito', value: formatToBRL(caixaStore.caixa.cartaoCredito), positivo: caixaStore.caixa.cartaoCredito > 0 },
                          { label: 'Cartão de Débito', value: formatToBRL(caixaStore.caixa.cartaoDebito), positivo: caixaStore.caixa.cartaoDebito > 0 },
                          { label: 'Pix', value: formatToBRL(caixaStore.caixa.pix), positivo: caixaStore.caixa.pix > 0 },
                          { label: 'Total Crédito', value: formatToBRL(caixaStore.caixa.totalCredito), positivo: caixaStore.caixa.totalCredito > 0 },
                          { label: 'Total Débito', value: formatToBRL(caixaStore.caixa.totalDebito), positivo: caixaStore.caixa.totalDebito > 0 },
                          { label: 'Saldo', value: formatToBRL(caixaStore.caixa.saldo), positivo: caixaStore.caixa.saldo > 0 }
                        ] : []" :key="row.label">
                          <td>{{ row.label }}</td>
                          <td class="text-right">{{ row.value }}</td>
                        </tr>
                        <tr v-if="!caixaStore.caixa">
                          <td colspan="2" class="text-center">
                            Caixa não disponível para o período
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </q-card-section>
                </q-card>
              </q-item-label>
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>
            <q-btn class="full-width" color="primary" label="Lançar valor" @click="lancarValor"/>

          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <LancarNoCaixaDialog v-model="showDialogLancarNoCaixa"></LancarNoCaixaDialog>
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
import LancarNoCaixaDialog from 'src/components/dialog/LancarNoCaixaDialog.vue'

const notify = useNotify();
const router = useRouter();
const $q = useQuasar();
const showDialogLancarNoCaixa = ref(false);



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

function lancarValor(){
  showDialogLancarNoCaixa.value = true;
}

watch(() => model.value, (open) => {
  if (open) {
    caixaStore.getCaixa();
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
