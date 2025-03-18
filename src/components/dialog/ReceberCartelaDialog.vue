<template>
    <q-dialog v-model="model" persistent>
        <q-card class="minimo-dialog">
            <q-form @submit.prevent="submit">
                <q-card-section>
                    <q-card-title>
                        Receber Cartela
                    </q-card-title>
                </q-card-section>
                <q-card-section>
                    <q-select
                    dense
                    outlined
                    emit-value
                    map-options
                    v-model="meioPagamentoSelecionado"
                    :options="meioPagamento"
                    label="Meio de pagamento *"
                    :rules="[val => !!val || 'Meio de pagamento é obrigatório']"
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
                        label="Receber"
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
import { ReceberCartelaRequest } from "src/model/cartela.interface";

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

const meioPagamentoSelecionado = ref<string>("");
const meioPagamento = Object.keys(MeioPagamento).map((key) => ({ label: MeioPagamento[key as keyof typeof MeioPagamento], value: key as string }));

async function submit() {

    const receberCartelaRequest: ReceberCartelaRequest = {
        meioPagamento: meioPagamentoSelecionado.value,
        dataPagamento: (new Date().toISOString().split('T')[0] as string).split('-').reverse().join('/').toString()
    };

    const codigo = gestaoCartelaStore.gestaoCartela?.codigo as string;
    await gestaoCartelaStore.receberCartela(codigo, props.codigo, receberCartelaRequest);
    await gestaoCartelaStore.carregarCarteiraPorIdStatusNumber();
    model.value = false
}
</script>
