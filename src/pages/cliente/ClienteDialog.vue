<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    @hide="onHide"
  >
    <q-card class="q-dialog-plugin" style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none q-px-lg">
        <div class="text-h6">{{ isEdit ? 'Editar' : 'Novo' }} Cliente</div>
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
                :rules="[
                  val => !val || new Date(val) <= new Date() || 'Data não pode ser futura',
                  val => !val || new Date().getFullYear() - new Date(val).getFullYear() <= 120 || 'Data inválida',
                  val => form.pessoa.tipoPessoa !== 'FISICA' || !!val || 'Data de nascimento é obrigatória para pessoa física',
                  val => form.pessoa.tipoPessoa !== 'FISICA' || new Date().getFullYear() - new Date(val).getFullYear() >= 18 || 'Cliente deve ser maior de idade'
                ]"
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
                unmasked-value
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
import { Cliente } from 'src/model/cliente.interface';
import { TipoPessoa } from 'src/model/pessoa.interface';
import { useClienteStore } from '../../stores/cliente.store';

const clienteStore = useClienteStore();
const props = defineProps<{
  modelValue: boolean,
  cliente: Cliente | undefined
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>();

const isEdit = computed(() => !!props.cliente);

const tipoPessoaOptions = Object.values(TipoPessoa).map(value => ({
  label: value,
  value: value
}));

const form = ref<Cliente>({
  codigo: props.cliente?.codigo,
  pessoa: {
    codigo: props.cliente?.pessoa.codigo,
    nome: props.cliente?.pessoa?.nome || '',
    tipoPessoa: props.cliente?.pessoa.tipoPessoa || TipoPessoa.FISICA,
    documento: props.cliente?.pessoa.documento || '',
    dataNascimento: props.cliente?.pessoa.dataNascimento || '',
    email: props.cliente?.pessoa.email || '',
    telefone: props.cliente?.pessoa.telefone || ''
  }
});

watch(() => props.cliente, (newCliente) => {
  if (newCliente) {
    form.value = {
      ...newCliente,
      pessoa: {
        ...newCliente.pessoa
      }
    };
    form.value.pessoa.dataNascimento = (newCliente.pessoa.dataNascimento?.split('/').reverse().join('-')) || '';
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
    };
    body.pessoa.dataNascimento = (form.value.pessoa.dataNascimento?.split('-').reverse().join('/')) || '';
    await clienteStore.salvarCliente(body);
    emit('update:modelValue', false);
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
  } catch (error) {
    console.error('Erro ao salvar cliente:', error);
  }
}

function onHide() {
  emit('update:modelValue', false);
}
</script>
