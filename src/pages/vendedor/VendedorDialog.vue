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
        <div class="text-h6">{{ isEdit ? 'Editar' : 'Novo' }} Vendedor</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-pa-sm">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                dense
                outlined
                v-model="form.pessoa.nome"
                label="Nome *"
                :rules="[val => !!val || 'Nome é obrigatório']"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                  dense
                  outlined
                  emit-value
                  map-options
                  v-model="form.pessoa.tipoPessoa"
                  :options="tiposPessoa"
                  label="Tipo de Pessoa *"
                  :rules="[val => !!val || 'Tipo de Pessoa é obrigatório']"
                  @update:model-value="onTipoPessoaUpdate"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                dense
                outlined
                v-model="form.pessoa.documento"
                :label="form.pessoa.tipoPessoa === TipoPessoa.FISICA ? 'CPF *' : 'CNPJ *'"
                :mask="form.pessoa.tipoPessoa === TipoPessoa.FISICA ? '###.###.###-##' : '##.###.###/####-##'"
                :rules="[
                  val => !!val || `${form.pessoa.tipoPessoa === TipoPessoa.FISICA ? 'CPF' : 'CNPJ'} é obrigatório`,
                  val => form.pessoa.tipoPessoa === TipoPessoa.FISICA ? DocumentValidator.validarCPF(val) : DocumentValidator.validarCNPJ(val) || (form.pessoa.tipoPessoa === TipoPessoa.FISICA as TipoPessoa ? 'CPF' : 'CNPJ') + 'não é valido',
                ]"
                unmasked-value
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                dense
                outlined
                v-model="form.pessoa.email"
                label="Email *"
                type="email"
                :rules="[
                  val => !!val || 'Email é obrigatório',
                  val => val && val.includes('@') || 'Email inválido'
                ]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
              dense
                outlined
                v-model="form.pessoa.telefone"
                label="Telefone *"
                mask="(##) #####-####"
                unmasked-value
                :rules="[
                  val => !!val || 'Telefone é obrigatório'
                ]"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                dense
                outlined
                v-model="dataNascimento"
                label="Data de Nascimento *"
                type="date"
                :rules="[
                  val => !!val || 'Data de Nascimento é obrigatório'
                ]"
              />
            </div>
          </div>

          <div class="row justify-end q-gutter-sm q-mt-md">
            <q-btn
              label="Cancelar"
              color="negative"
              v-close-popup
              dense
              flat
            />
            <q-btn
              label="Salvar"
              type="submit"
              color="primary"
              dense
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { TipoPessoa } from 'src/model/pessoa.interface';
import { useVendedorStore } from 'src/stores/vendedor.store';
import { DocumentValidator } from 'src/utils/documentValidator';
import { VendedorResponse } from 'src/model/vendedor.interface';
import { defineEmits, defineProps, computed, ref, watch } from 'vue';

const vendedorStore = useVendedorStore();

const props = defineProps<{
  modelValue: boolean,
  vendedor?: VendedorResponse
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>();

const isEdit = computed(() => !!props.vendedor?.codigo);

const form = ref<VendedorResponse>({
  pessoa: {
    nome: '',
    tipoPessoa: TipoPessoa.FISICA,
    documento: '',
    dataNascimento: '',
    email: '',
    telefone: ''
  }
})

const dataNascimento = computed({
  get: () => form.value.pessoa?.dataNascimento?.split('/').reverse().join('-'),
  set: (value: string) => (form.value.pessoa.dataNascimento = value.split('-').reverse().join('/'))
})

const tiposPessoa = [
  { label: 'Pessoa Física', value: 'FISICA' },
  { label: 'Pessoa Jurídica', value: 'JURIDICA' }
]

watch(() => props.vendedor, (novo) => {
  if (novo) {
      form.value = { ...novo } as VendedorResponse;
  } else {
      form.value = {
        pessoa: {
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

async function onSubmit() {
  try {
      if (isEdit.value) {
          await vendedorStore.atualizarVendedor(form.value);
      } else {
          await vendedorStore.criarVendedor(form.value);
      }
      emit('update:modelValue', false);
  } catch (error) {
  }
}

function onHide() {
  emit('update:modelValue', false);
}

function onTipoPessoaUpdate() {
    if(form.value?.pessoa?.documento){
        form.value.pessoa.documento = '';
    }
}
</script>