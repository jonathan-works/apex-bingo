<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog ref="dialog" v-model="model" backdrop-filter="blur(4px) saturate(150%)" no-esc-dismiss no-backdrop-dismiss no-route-dismiss>
      <q-card :style="{ maxWidth: isMobile ? '100vw' : '40vw', width: '100%' }">
          <q-form @submit="updateCliente" @reset="cancel">
            <q-card-section class="row items-center q-pb-none text-h6">
              Selecione o cliente
            </q-card-section>
            <q-card-section>
              <q-toggle
                v-model="clienteCadastrado"
                label="Cliente cadastrado"
                color="secondary"
              />
              <div v-if="clienteCadastrado">
                <SelectCliente v-model="clienteSelecionado as Cliente" :rules="[val => !!val || 'Cliente é obrigatório']"/>
              </div>
              <div v-else>
                <q-input
                  v-model="clienteSelecionado as string"
                  label="Nome do Cliente"
                  :rules="[
                    val => !!val || 'Nome é obrigatório',
                    val => val.length >= 5 || 'Mínimo de 5 caracteres',
                    val => val.length <= 100 || 'Máximo de 100 caracteres'
                  ]"
                  outlined
                  dense
                />
              </div>

            </q-card-section>
            <q-card-actions align="right">
              <q-btn outline label="Cancelar" color="primary" type="reset" />
              <q-btn label="Salvar" color="primary" type="submit" />
            </q-card-actions>
          </q-form>
        </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Cliente } from 'src/model/cliente.interface';
import SelectCliente from 'src/components/select/SelectCliente.vue'
import { useQuasar } from 'quasar';

const dialog = ref();
const clienteCadastrado = ref(true);
const $q = useQuasar();
const isMobile = computed(() => $q.platform.is.mobile);

const props = defineProps<{
  modelValue: boolean;
  clienteSelecionado: Cliente | string | null;
  submit: () => Promise<void> | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update:clienteSelecionado', value: Cliente | string | null): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const clienteSelecionado = computed({
  get: () => props.clienteSelecionado,
  set: (value: Cliente | string | null) => emit('update:clienteSelecionado', value),
});

function updateCliente(){
  if(props.submit){
    props.submit()?.then(() => {
      dialog.value?.hide();
    })
  }
}

function cancel(){
  clienteSelecionado.value = null;
  dialog.value?.hide();
}

watch(clienteCadastrado, () => {
  clienteSelecionado.value = null;
})
</script>
