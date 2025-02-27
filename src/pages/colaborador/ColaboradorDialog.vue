<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    @hide="onHide"
  >
    <q-card class="q-dialog-plugin" style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none q-px-lg">
        <div class="text-h6">{{ isEdit ? 'Editar' : 'Novo' }} Colaborador</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-pa-sm">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="form.pessoa.nome"
                label="Nome *"
                :rules="[
                  val => !!val || 'Nome é obrigatório',
                  val => val.length >= 3 || 'Mínimo de 3 caracteres'
                ]"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="form.pessoa.tipoPessoa"
                :options="tipoPessoaOptions"
                label="Tipo de Pessoa *"
                :rules="[val => !!val || 'Tipo de pessoa é obrigatório']"
                outlined
                dense
                emit-value
                map-options
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.pessoa.documento"
                :label="form.pessoa.tipoPessoa === 'FISICA' ? 'CPF *' : 'CNPJ *'"
                :rules="[
                  val => !!val || 'Documento é obrigatório',
                  val => form.pessoa.tipoPessoa === 'FISICA' ? DocumentValidator.validarCPF(val) : DocumentValidator.validarCNPJ(val)
                ]"
                :mask="form.pessoa.tipoPessoa === 'FISICA' ? '###.###.###-##' : '##.###.###/####-##'"
                outlined
                dense
                unmasked-value
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.pessoa.dataNascimento"
                label="Data de Nascimento"
                type="date"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.pessoa.email"
                label="Email *"
                type="email"
                :rules="[
                  val => !!val || 'Email é obrigatório',
                  val => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) || 'Email inválido'
                ]"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.pessoa.telefone"
                label="Telefone *"
                :rules="[val => !!val || 'Telefone é obrigatório']"
                mask="(##) #####-####"
                outlined
                dense
                unmasked-value
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
import { Colaborador } from 'src/model/colaborador.interface';
import { TipoPessoa } from 'src/model/pessoa.interface';
import { useColaboradorStore } from '../../stores/colaborador.store';

const colaboradorStore = useColaboradorStore();
const props = defineProps<{
  modelValue: boolean,
  colaborador: Colaborador | undefined
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>();

const isEdit = computed(() => !!props.colaborador);

const tipoPessoaOptions = Object.values(TipoPessoa).map(value => ({
  label: value,
  value: value
}));

const form = ref<Colaborador>({
  codigo: props.colaborador?.codigo,
  pessoa: {
    codigo: props.colaborador?.pessoa.codigo,
    nome: props.colaborador?.pessoa?.nome || '',
    tipoPessoa: props.colaborador?.pessoa.tipoPessoa || TipoPessoa.FISICA,
    documento: props.colaborador?.pessoa.documento || '',
    dataNascimento: props.colaborador?.pessoa.dataNascimento || '',
    email: props.colaborador?.pessoa.email || '',
    telefone: props.colaborador?.pessoa.telefone || ''
  }
});

watch(() => props.colaborador, (newColaborador) => {
  if (newColaborador) {
    form.value = {
      ...newColaborador,
      pessoa: {
        ...newColaborador.pessoa
      }
    };
  } else {
    form.value = {
      codigo: undefined,
      pessoa: {
        codigo: undefined,
        nome: '',
        tipoPessoa: TipoPessoa.FISICA,
        documento: '',
        dataNascimento: '',
        email: '',
        telefone: ''
      }
    };
  }
}, { immediate: true });

import { DocumentValidator } from 'src/utils/documentValidator';

async function onSubmit() {
  try {
    const body = {
      ...form.value
    }
    body.pessoa.dataNascimento = form.value.pessoa.dataNascimento?.split('-').reverse().join('/') || '';
    await colaboradorStore.salvarColaborador(body);
    emit('update:modelValue', false);
  } catch (error) {
    console.error('Erro ao salvar colaborador:', error);
  }
}

function onHide() {
  emit('update:modelValue', false);
}
</script>
