<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    @hide="onHide"
  >
    <q-card class="q-dialog-plugin" style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none q-px-lg">
        <div class="text-h6">{{ isEdit ? 'Editar' : 'Novo' }} Serviço</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-pa-sm">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="form.nome"
                label="Nome *"
                :rules="[
                  val => !!val || 'Nome é obrigatório',
                  val => val.length >= 10 || 'Mínimo de 10 caracteres',
                  val => val.length <= 100 || 'Máximo de 100 caracteres'
                ]"
                outlined
                dense
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="form.descricao"
                label="Descrição *"
                type="textarea"
                :rules="[val => !!val || 'Descrição é obrigatória']"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.valor"
                label="Valor *"
                type="number"
                :rules="[val => !!val || 'Valor é obrigatório']"
                prefix="R$"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.duracao"
                label="Duração (minutos) *"
                type="number"
                :rules="[val => !!val || 'Duração é obrigatória']"
                suffix="min"
                outlined
                dense
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
import { useDialogPluginComponent } from 'quasar';
import { Servico } from 'src/model/servico.interface';
import { useServicoStore } from '../../stores/servico.store';

const servicoStore = useServicoStore();
const props = defineProps<{
  modelValue: boolean,
  servico: Servico | undefined
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>();

const isEdit = computed(() => !!props.servico);

const form = ref<Servico>({
  codigo: props.servico?.codigo,
  nome: props.servico?.nome || '',
  descricao: props.servico?.descricao || '',
  valor: props.servico?.valor || 0,
  duracao: props.servico?.duracao || 0
});

watch(() => props.servico, (newServico) => {
  if (newServico) {
    form.value = {
      ...newServico,
      nome: newServico.nome,
      descricao: newServico.descricao,
      valor: newServico.valor,
      duracao: newServico.duracao
    };
  } else {
    form.value = {
      codigo: undefined,
      nome: '',
      descricao: '',
      valor: 0,
      duracao: 0
    };
  }
}, { immediate: true });

async function onSubmit() {
  try {
    await servicoStore.salvarServico(form.value);
    emit('update:modelValue', false);
  } catch (error) {
    console.error('Erro ao salvar serviço:', error);
  }
}

function onHide() {
  emit('update:modelValue', false);
}
</script>
