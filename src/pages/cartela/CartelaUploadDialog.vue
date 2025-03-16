<template>
    <q-dialog v-model="model" persistent>
        <q-card class="minimo-dialog">
            <q-form @submit.prevent="submit">
                <q-card-section>
                    <q-card-title>
                        Upload Cartela
                    </q-card-title>
                </q-card-section>
                <q-card-section>
                    <div class="row q-col-gutter-md">
                      <div class="col-12">
                        <q-select
                          dense
                          outlined
                          emit-value
                          map-options
                          v-model="form.ativo"
                          :options="tipo"
                          label="Tipo *"
                          :rules="[val => !!val || 'Tipo é obrigatório']"
                        />
                      </div>
                      <div class="col-12">
                        <SelectEvento
                          label="Evento *"
                          v-model:items-filtrados="cartelaStore.eventosFiltrados"
                          v-model:items="cartelaStore.eventos"
                          v-model="form.evento as EventoResponse" 
                          :rules="[(val: any) => !!val || 'Evento é obrigatório']"
                          clearable />
                      </div>
                      <div class="col-12">
                        <q-file
                          dense
                          outlined
                          v-model="file"
                          label="Selecione um arquivo"
                          @update:model-value="processFile"
                          :rules="[val => !!val || 'Arquivo é obrigatório']"
                        >
                          <template v-slot:prepend>
                            <q-icon name="cloud_upload" />
                          </template>
                        </q-file>
                        
                      </div>
                      <div class="col-12">
                        <InputMoeda
                          v-model="form.valor"
                          label="Valor *"
                          :rules="[
                              val => !!val || 'Valor é obrigatória',
                            ]"
                          outlined
                          dense
                          />
                      </div>
                    </div>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn
                        flat
                        label="Cancelar"
                        color="primary"
                        @click="model = false"
                    />
                    <q-btn
                        label="Enviar"
                        color="primary"
                        type="submit"
                    />
                </q-card-actions>
            </q-form>
        </q-card>
    </q-dialog>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { MeioPagamento } from "src/model/meio-pagamento.enum";
import { useGestaoCartelaStore } from "src/stores/gestao-cartela.store";
import { useCartelaStore } from "src/stores/cartela.store";
import { UploadRequest } from "src/model/upload.interface";
import { EventoRequest } from "src/model/evento.interface";
import InputMoeda from 'src/components/input/InputMoeda.vue';
import SelectEvento from 'src/components/select/SelectEvento.vue';
import { Tipo } from "src/model/tipo.enum";

const cartelaStore = useCartelaStore();

const props = defineProps<{ 
    modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const arquivo = ref<File>();

const tipo = Object.keys(Tipo).map((key) => ({ label: Tipo[key as keyof typeof Tipo], value: key as string }));

const form = ref<UploadRequest>({
  tipo: "",
  evento: null,
  valor: 0,
  fileName: "",
  base64: "",
  mimeType: "",
});

const file = ref<File | null>(null);

const processFile = async () => {
  if (!file.value) return;

  const reader = new FileReader();
  reader.readAsDataURL(file.value);

  reader.onload = () => {
    form.value = {
      ...form.value,
      fileName: file.value!.name,
      mimeType: file.value!.type,
      base64: reader.result as string,
    };
  };
};

async function submit() {
    await cartelaStore.uploadCartela(form.value);
    model.value = false
}
</script>
