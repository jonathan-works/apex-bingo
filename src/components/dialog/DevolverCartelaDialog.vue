<template>
    <q-dialog v-model="model" persistent>
        <q-card class="minimo-dialog">
            <q-form @submit.prevent="submit">
                <q-card-section>
                    <q-card-title>
                        Devolver Cartela
                    </q-card-title>
                </q-card-section>
                <q-card-section>
                    <q-input
                        dense
                        outlined
                        v-model="motivo"
                        label="Motivo *"
                        :rules="[val => !!val || 'Motivo é obrigatório']"
                    />
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn
                        flat
                        label="Cancelar"
                        color="primary"
                        @click="model = false"
                    />
                    <q-btn
                        label="Devolver"
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
import { DevolverCartelaRequest, ReceberCartelaRequest } from "src/model/cartela.interface";

const gestaoCartelaStore = useGestaoCartelaStore();

const props = defineProps<{ 
    modelValue: boolean;
    codigo: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const motivo = ref<string>("");
const meioPagamento = Object.keys(MeioPagamento).map((key) => ({ label: MeioPagamento[key as keyof typeof MeioPagamento], value: key as string }));

async function submit() {

    const receberCartelaRequest: DevolverCartelaRequest = {
        motivo: motivo.value,
    };

    const codigo = gestaoCartelaStore.gestaoCartela?.codigo as string;
    await gestaoCartelaStore.devolver(codigo, props.codigo, receberCartelaRequest);
    await gestaoCartelaStore.carregarCarteiraPorIdStatusNumber();
    model.value = false
}
</script>
