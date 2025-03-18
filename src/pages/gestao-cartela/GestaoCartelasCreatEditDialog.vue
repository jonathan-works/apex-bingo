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
          <div class="text-h6">{{ isEdit ? 'Editar' : 'Nova' }} Gestão de Cartela</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
  
        <q-card-section>
          <q-form @submit="onSubmit" class="q-pa-sm">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <SelectVendedor
                  label="Vendedor *"
                  v-model:items-filtrados="gestaoCartelaStore.vendedoresFiltrados"
                  v-model:items="gestaoCartelaStore.vendedores"
                  v-model="form.vendedor as VendedorRequest" 
                  :rules="[(val: any) => !!val || 'Vendedor é obrigatório']"
                  clearable />
              </div>
              <div class="col-md-9 col-12">
                <SelectEvento
                  label="Evento *"
                  v-model:items-filtrados="gestaoCartelaStore.eventosFiltrados"
                  v-model:items="gestaoCartelaStore.eventos"
                  v-model="form.evento as EventoResponse" 
                  :rules="[(val: any) => !!val || 'Evento é obrigatório']"
                  clearable />
              </div>
              <div class="col-md-3 col-12">
                <q-select
                    dense
                    outlined
                    emit-value
                    map-options
                    v-model="form.ativo"
                    :options="ativo"
                    label="Ativo *"
                    :rules="[val => !!val || 'Ativo é obrigatório']"
                />
              </div>
              <div class="col-md-4 col-12">
                <q-input
                  v-model="form.numeroBloco"
                  label="Número do bloco"
                  type="number"
                  outlined
                  dense
                />
              </div>
              <div class="col-md-4 col-12">
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
              <div class="col-md-4 col-12">
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

              <div class="col-12">
                <q-input
                  v-model="form.descricao"
                  label="Descrição *"
                  :rules="[
                    val => !!val || 'Descrição é obrigatória',
                    val => val.length >= 3 || 'Mínimo de 3 caracteres'
                  ]"
                  outlined
                  dense
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
import { EventoResponse } from 'src/model/evento.interface';
import { StatusCartela } from 'src/model/status-cartela.enum';
import { VendedorRequest } from 'src/model/vendedor.interface';
import SelectEvento from 'src/components/select/SelectEvento.vue';
import SelectVendedor from 'src/components/select/SelectVendedor.vue';
import SelectCartela from 'src/components/select/SelectCartela.vue';
import { useGestaoCartelaStore } from 'src/stores/gestao-cartela.store';
import { GestaoCartelaRequest } from 'src/model/gestao-cartela.interfave';

interface Props {
  modelValue: boolean;
  gestaoCartela?: GestaoCartelaRequest | null;
}

const props = withDefaults(defineProps<Props>(), {
  gestaoCartela: null
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>();

const gestaoCartelaStore = useGestaoCartelaStore();

onMounted(() => {
  gestaoCartelaStore.carregarEventos();
  gestaoCartelaStore.carregarVendedor();
  gestaoCartelaStore.carregarCartelas();
});

const isEdit = computed(() => !!props.gestaoCartela?.codigo);
const ativo = Object.keys(StatusCartela).map((key) => ({ label: StatusCartela[key as keyof typeof StatusCartela], value: key as string }));

const form = ref<GestaoCartelaRequest>({
  numeroBloco: undefined,
  numeroInicial: undefined,
  numeroFinal: undefined,
  tipo: 'C',
  evento: undefined,
  vendedor: undefined
});

watch(() => props.gestaoCartela, (newCartela, oudCartela) => {
  if (newCartela) {
    form.value = { ...newCartela };
    //if(newCartela.codigo !== oudCartela?.codigo) {
    //  gestaoCartelaStore.carregarCarteiraPorIdStatusNumber();
    //}
  } else {
    form.value = {
      numeroBloco: undefined,
      numeroInicial: undefined,
      numeroFinal: undefined,
      tipo: 'C',
      evento: undefined,
      vendedor: undefined
    };
  }
}, { immediate: true });

async function onSubmit() {
  try {
    if (isEdit.value) {
      await gestaoCartelaStore.atualizarGestaoCartela(form.value);
    } else {
      await gestaoCartelaStore.criarGestaoCartela(form.value);
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