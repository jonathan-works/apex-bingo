<template>
    <q-dialog v-model="model" persistent>
        <q-card class="minimo-dialog">
            <q-form @submit.prevent="submit">
                <q-card-section>
                    <q-card-title>
                        Lançar no Cartela
                    </q-card-title>
                </q-card-section>
                <q-card-section>
                    <div class="row full-width">
                        <div class="col-12 row q-col-gutter-x-sm">
                            <div class="col-md-6 col-12">
                                <q-select
                                    dense
                                    outlined
                                    emit-value
                                    map-options
                                    v-model="form.tipo"
                                    :options="tipo"
                                    :rules="[(val: any) => !!val || 'Tipo é obrigatório']"
                                    label="Tipo *"
                                />
                            </div>
                            <div class="col-md-6 col-12">
                                <q-select
                                    dense
                                    outlined
                                    emit-value
                                    map-options
                                    v-model="form.meioPagamento"
                                    :options="meioPagamento"
                                    :rules="[(val: any) => !!val || 'Meio de pagamento é obrigatório']"
                                    label="Meio de pagamento *"
                                />
                            </div>
                            <div class="col-12">
                                <SelectEvento
                                    label="Evento *"
                                    v-model:items-filtrados="caixaStore.eventosFiltrados"
                                    v-model:items="caixaStore.eventos"
                                    v-model="form.evento" 
                                    :rules="[(val: any) => !!val || 'Evento é obrigatório']"
                                    clearable 
                                />
                            </div>
                            <div class="col-12">
                                <InputMoeda
                                    v-model="form.valor"
                                    label="Valor *"
                                    :rules="[(val: string) => !!val || 'Valor é obrigatória']"
                                    outlined
                                    dense
                                />
                            </div>
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
                        label="Lançar"
                        color="primary"
                        type="submit"
                    />
                </q-card-actions>
            </q-form>
        </q-card>
    </q-dialog>
</template>
<script setup lang="ts">
import { LancamentoCaixaRequest } from "src/model/caixa.interface";
import { MeioPagamento } from "src/model/meio-pagamento.enum";
import { TipoPagamento } from "src/model/tipo-pagamento.enum";
import InputMoeda from 'src/components/input/InputMoeda.vue';
import { computed, ref, watch } from "vue";
import { useCaixaStore } from "src/stores/caixa.store";
import SelectEvento from 'src/components/select/SelectEvento.vue';

const caixaStore = useCaixaStore();

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

const form = ref<LancamentoCaixaRequest>({
    valor: null,
    tipo: null,
    meioPagamento: null,
    evento: null
});

watch(() => props.modelValue, (open) => {
  if (open) {
    caixaStore.carregarEventos();
  } 
}, { immediate: true });

const tipo = Object.keys(TipoPagamento).map((key) => ({ label: TipoPagamento[key as keyof typeof TipoPagamento], value: key as string }));
const meioPagamento = Object.keys(MeioPagamento).map((key) => ({ label: MeioPagamento[key as keyof typeof MeioPagamento], value: key as string }));

async function submit() {

    await caixaStore.criarLancamentoCaixa(form.value);
    await caixaStore.getCaixa()
    model.value = false
}
</script>
