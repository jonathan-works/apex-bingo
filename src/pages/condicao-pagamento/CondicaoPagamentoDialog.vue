<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    @hide="onHide"
  >
    <q-card class="q-dialog-plugin" style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none q-px-lg">
        <div class="text-h6">{{ isEdit ? 'Editar' : 'Nova' }} Condição de Pagamento</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-pa-sm">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="form.descricao"
                label="Descrição *"
                :rules="[val => !!val || 'Descrição é obrigatória']"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.parcela"
                label="Parcelas *"
                type="number"
                :rules="[val => !!val || 'Número de parcelas é obrigatório']"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.intervalo"
                label="Intervalo (dias) *"
                type="number"
                :rules="[val => !!val || 'Intervalo é obrigatório']"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.juros"
                label="Juros (%) *"
                type="number"
                :rules="[val => !!val || 'Juros é obrigatório']"
                suffix="%"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="form.tipo"
                :options="tipoOptions"
                label="Tipo *"
                :rules="[val => !!val || 'Tipo é obrigatório']"
                outlined
                dense
                emit-value
                map-options
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="form.meioPagamento"
                :options="meioPagamentoOptions"
                label="Meio de Pagamento *"
                :rules="[val => !!val || 'Meio de pagamento é obrigatório']"
                outlined
                dense
                emit-value
                map-options
              />
            </div>
          </div>

          <div class="row justify-end q-gutter-sm">
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
import { ref, defineEmits, defineProps, watch, computed } from 'vue';
import { CondicaoPagamento } from 'src/model/condicao-pagamento.interface';
import { TipoPagamento } from 'src/model/tipo-pagamento.enum';
import { MeioPagamento } from 'src/model/meio-pagamento.enum';
import { useCondicaoPagamentoStore } from '../../stores/condicao-pagamento.store';

const condicaoPagamentoStore = useCondicaoPagamentoStore();
const props = defineProps<{
  modelValue: boolean,
  condicaoPagamento: CondicaoPagamento | undefined
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>();

const isEdit = computed(() => !!props.condicaoPagamento);

const form = ref<CondicaoPagamento>({
  codigo: props.condicaoPagamento?.codigo,
  descricao: props.condicaoPagamento?.descricao || '',
  parcela: props.condicaoPagamento?.parcela || 1,
  intervalo: props.condicaoPagamento?.intervalo || 0,
  juros: props.condicaoPagamento?.juros || 0,
  tipo: props.condicaoPagamento?.perfil || TipoPagamento['À vista'],
  meioPagamento: props.condicaoPagamento?.meioPagamento || MeioPagamento.Dinheiro
});

const tipoOptions = Object.keys(TipoPagamento).map((key) => ({
  label: TipoPagamento[key as keyof typeof TipoPagamento],
  value: key
}));

const meioPagamentoOptions = Object.keys(MeioPagamento).map((key) => ({
  label: MeioPagamento[key as keyof typeof MeioPagamento],
  value: key
}));

watch(() => props.condicaoPagamento, (newCondicao) => {
  if (newCondicao) {
    form.value = {
      ...newCondicao,
      descricao: newCondicao.descricao,
      parcela: newCondicao.parcela,
      intervalo: newCondicao.intervalo,
      juros: newCondicao.juros,
      tipo: newCondicao.tipo,
      meioPagamento: newCondicao.meioPagamento
    };
  } else {
    form.value = {
      codigo: undefined,
      descricao: '',
      parcela: 1,
      intervalo: 0,
      juros: 0,
      tipo: TipoPagamento['À vista'],
      meioPagamento: MeioPagamento.Dinheiro
    };
  }
}, { immediate: true });

async function onSubmit() {
  try {
    await condicaoPagamentoStore.salvarCondicaoPagamento(form.value);
    emit('update:modelValue', false);
  } catch (error) {
    console.error('Erro ao salvar condição de pagamento:', error);
  }
}

function onHide() {
  emit('update:modelValue', false);
}
</script>
