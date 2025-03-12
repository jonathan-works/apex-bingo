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
          <div class="text-h6">{{ isEdit ? 'Editar' : 'Novo' }} Usuario</div>
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
                  :label="form.pessoa.tipoPessoa === TipoPessoa.FISICA ? 'CPF' : 'CNPJ'"
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
                  :rules="[
                    val => !!val || 'Telefone é obrigatório'
                  ]"
                  unmasked-value
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
                    val => !!val || 'Data de Nascimento é obrigatória'
                  ]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  dense
                  outlined
                  v-model="form.password"
                  label="Senha *"
                  type="text"
                  :rules="[
                    val => !!val || 'Senha é obrigatória'
                  ]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  dense
                  outlined
                  v-model="form.perfil"
                  :options="perfis"
                  label="Perfil *"
                  emit-value
                  map-options
                  :rules="[val => !!val || 'Perfil é obrigatório']"
                />
              </div>
              <div class="col-12">
                <q-select
                    dense
                    outlined
                    use-chips
                    v-model="form.roles"
                    :options="usuarioStore.roles"
                    label="Funcionalidades"
                    multiple
                    option-label="descricao"
                >
                    <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                        <q-item v-bind="itemProps">
                            <q-item-section>
                            <q-item-label v-html="opt.descricao" />
                            </q-item-section>
                            <q-item-section side>
                            <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
                            </q-item-section>
                        </q-item>
                    </template>
                    <template v-slot:no-option>
                        <q-item>
                            <q-item-section class="text-grey">
                                Nenhum resultado
                            </q-item-section>
                        </q-item>
                    </template>
                </q-select>
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
import { UsuarioRequest } from 'src/model/usuario.interface';
import { useUsuarioStore } from 'src/stores/usuario.store';
import { defineEmits, defineProps, computed, ref, watch } from 'vue';
import { Perfil } from 'src/model/perfil.enum';
import { DocumentValidator } from 'src/utils/documentValidator';
import { TipoPessoa } from 'src/model/pessoa.interface';
  
const usuarioStore = useUsuarioStore();

usuarioStore.carregarRoles();

const props = defineProps<{
    modelValue: boolean,
    usuario?: UsuarioRequest
}>();

const perfis = Object.keys(Perfil).map((key) => ({ label: Perfil[key as keyof typeof Perfil], value: key }));

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>();

const isEdit = computed(() => !!props.usuario?.codigo);

const form = ref<UsuarioRequest>({
codigo: undefined,
pessoa: {
    codigo: undefined,
    nome: '',
    tipoPessoa: TipoPessoa.FISICA,
    documento: '',
    dataNascimento: '',
    email: '',
    telefone: ''
},
password: ''
})

const dataNascimento = computed({
    get: () => form.value.pessoa?.dataNascimento?.split('/').reverse().join('-'),
    set: (value: string) => (form.value.pessoa.dataNascimento = value.split('-').reverse().join('/'))
})

const tiposPessoa = [
    { label: 'Pessoa Física', value: TipoPessoa.FISICA },
    { label: 'Pessoa Jurídica', value: TipoPessoa.JURIDICA }
]

watch(() => props.usuario, (novo) => {
if (novo) {
    form.value = { ...novo } as UsuarioRequest;
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
        telefone: '',
        },
        password: ''
    };
}
}, { immediate: true });

async function onSubmit() {
    try {
        if (isEdit.value) {
            await usuarioStore.atualizarUsuario(form.value);
        } else {
            await usuarioStore.criarUsuario(form.value);
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