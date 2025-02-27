<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none q-px-lg">
        <div class="text-h6">{{ isEdit ? 'Editar' : 'Novo' }} Usuário</div>
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
                :rules="[val => !!val || 'Nome é obrigatório']"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="form.pessoa.tipoPessoa"
                :options="['FISICA', 'JURIDICA']"
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
                label="Documento"
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
                  val => val && /^[^@]+@[^@]+\.[^@]+$/.test(val) || 'Email inválido'
                ]"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.pessoa.telefone"
                label="Telefone"
                mask="(##) #####-####"
                outlined
                dense
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
import { ref, defineEmits, defineProps, computed } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { Usuario } from 'src/model/usuario.interface';
import { useUsuarioStore } from '../../stores/usuario.store';

const usuarioStore = useUsuarioStore();
const props = defineProps<{
  modelValue: boolean,
  usuario: Usuario | undefined
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>();

const { dialogRef, onDialogHide } = useDialogPluginComponent();

const isEdit = !!props.usuario;

const form = ref<Usuario>({
  codigo: props.usuario?.codigo,
  pessoa: {
    codigo: props.usuario?.pessoa.codigo,
    nome: props.usuario?.pessoa?.nome || '',
    tipoPessoa: props.usuario?.pessoa.tipoPessoa || 'FISICA',
    documento: props.usuario?.pessoa.documento || '',
    dataNascimento: props.usuario?.pessoa.dataNascimento || '',
    email: props.usuario?.pessoa.email || '',
    telefone: props.usuario?.pessoa.telefone || ''
  }
});

async function onSubmit() {
  try {
    await usuarioStore.salvarUsuario(form.value);
    emit('update:modelValue', false);
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
  }
}
</script>
