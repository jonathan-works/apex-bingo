<template>
    <q-dialog
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
        @hide="onHide"
        persistent
        transition-show="slide-up"
        transition-hide="slide-down"
    >
      <q-card class="q-dialog-plugin" style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none q-px-lg">
          <div class="text-h6">{{ isEdit ? 'Editar' : 'Nova' }} Cartela</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
  
        <q-card-section>
          <q-form @submit="onSubmit" class="q-pa-sm">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <SelectEvento
                  label="Evento *"
                  v-model:items-filtrados="cartelaStore.eventosFiltrados"
                  v-model:items="cartelaStore.eventos"
                  v-model="form.evento as EventoResponse" 
                  :rules="[(val: any) => !!val || 'Evento é obrigatório']"
                  clearable />
              </div>
              <div class="col-md-3 col-12">
                <q-input
                  v-model="form.valor"
                  label="Valor *"
                  :rules="[
                    val => !!val || 'Valor é obrigatória',
                    val => val.length >= 1 || 'Mínimo de 1 caracteres'
                  ]"
                  type="number"
                  outlined
                  dense
                />
              </div>
              <div class="col-md-3 col-12">
                <q-input
                  v-model="form.numeroInicial"
                  label="Número Inicial *"
                  :rules="[
                    val => !!val || 'Número Inícial é obrigatória',
                    val => val.length >= 1 || 'Mínimo de 1 caracteres'
                  ]"
                  type="number"
                  outlined
                  dense
                />
              </div>
              <div class="col-md-3 col-12">
                <q-input
                  v-model="form.numeroFinal"
                  label="Número Final *"
                  :rules="[
                    val => !!val || 'Número Final é obrigatória',
                    val => val.length >= 1 || 'Mínimo de 1 caracteres'
                  ]"
                  type="number"
                  outlined
                  dense
                />
              </div>
              <div class="col-md-3 col-12">
                <q-select
                    dense
                    outlined
                    emit-value
                    map-options
                    v-model="form.ativo"
                    :options="tipo"
                    label="Tipo *"
                    :rules="[val => !!val || 'Ativo é obrigatório']"
                />
              </div>
            </div>
  
            <div class="row justify-end q-gutter-sm q-mt-md">
              <q-btn
                label="Cancelar"
                color="negative"
                flat
                v-close-popup
              />
              <q-btn
                :label="isEdit ? 'Salvar' : 'Criar'"
                type="submit"
                color="primary"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>
  
<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { useCartelaStore } from 'src/stores/cartela.store';
import { EventoResponse } from 'src/model/evento.interface';
import { CartelaRequest } from 'src/model/cartela.interface';
import { StatusCartela } from 'src/model/status-cartela.enum';
import { VendedorRequest } from 'src/model/vendedor.interface';
import { GestaoCartelaRequest } from 'src/model/gestao-cartela.interfave';
import SelectEvento from 'src/components/select/SelectEvento.vue';
import { Tipo } from 'src/model/tipo.enum';

interface Props {
  modelValue: boolean;
  cartela?: CartelaRequest | null;
}

const props = withDefaults(defineProps<Props>(), {
  cartela: null
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>();


const cartelaStore = useCartelaStore();

onMounted(async () => {
  await cartelaStore.carregarEventos();
  await cartelaStore.carregarVendedor();
});

const isEdit = computed(() => !!props.cartela?.codigo);
const tipo = Object.keys(Tipo).map((key) => ({ label: Tipo[key as keyof typeof Tipo], value: key as string }));

const form = ref<CartelaRequest>({
  numeroInicial: undefined,
  numeroFinal: undefined,
  valor: undefined,
  tipo: 'C',
  evento: undefined
});

watch(() => props.cartela, (newCartela) => {
  if (newCartela) {
    form.value = { ...newCartela };
  } else {
    form.value = {
      numeroInicial: undefined,
      numeroFinal: undefined,
      valor: undefined,
      tipo: 'C',
      evento: undefined
    };
  }
}, { immediate: true });

async function onSubmit() {
  try {
    if (isEdit.value) {
      await cartelaStore.atualizarCartela(form.value);
    } else {
      await cartelaStore.criarCartela(form.value);
    }
    emit('update:modelValue', false);
  } catch (error) {
    // Erro já tratado no store
  }
}

function onHide() {
  emit('update:modelValue', false);
}
</script>
src/model/status-cartela.enum