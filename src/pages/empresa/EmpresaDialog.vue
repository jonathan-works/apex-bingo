<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    @hide="onHide"
  >
    <q-card class="q-dialog-plugin" style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none q-px-lg">
        <div class="text-h6">{{ isEdit ? 'Editar' : 'Nova' }} Empresa</div>
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
import { Empresa } from 'src/model/empresa.interface';
import { PessoaRequest, TipoPessoa } from 'src/model/pessoa.interface';
import { useEmpresaStore } from '../../stores/empresa.store';

const empresaStore = useEmpresaStore();
const props = defineProps<{
  modelValue: boolean,
  empresa: Empresa | undefined
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>();

const isEdit = computed(() => !!props.empresa);

const tipoPessoaOptions = Object.values(TipoPessoa).map(value => ({
  label: value,
  value: value
}));

const form = ref<Empresa>({
  codigo: props.empresa?.codigo,
  pessoa: {
    codigo: props.empresa?.pessoa.codigo,
    nome: props.empresa?.pessoa?.nome || '',
    tipoPessoa: props.empresa?.pessoa.tipoPessoa || TipoPessoa.JURIDICA,
    documento: props.empresa?.pessoa.documento || '',
    email: props.empresa?.pessoa.email || '',
    telefone: props.empresa?.pessoa.telefone || ''
  }
});

watch(() => props.empresa, (newEmpresa) => {
  if (newEmpresa) {
    form.value = {
      ...newEmpresa,
      pessoa: {
        dataNascimento: newEmpresa.pessoa.dataNascimento?.split('/').reverse().join('-') as string
      } as PessoaRequest
    };
  } else {
    form.value = {
      codigo: undefined,
      pessoa: {
        codigo: undefined,
        nome: '',
        tipoPessoa: TipoPessoa.JURIDICA,
        documento: '',
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
      ...form.value,
    }

    body.pessoa.dataNascimento = form.value.pessoa.dataNascimento?.split('-').reverse().join('/') as string
    await empresaStore.salvarEmpresa(body);
    empresaStore.buscarEmpresas();
    emit('update:modelValue', false);
  } catch (error) {
    console.error('Erro ao salvar empresa:', error);
  }
}

function onHide() {
  emit('update:modelValue', false);
}
</script>
