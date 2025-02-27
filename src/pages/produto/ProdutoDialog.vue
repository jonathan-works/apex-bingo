<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    @hide="onHide"
  >
    <q-card class="q-dialog-plugin" style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none q-px-lg">
        <div class="text-h6">{{ isEdit ? 'Editar' : 'Novo' }} Produto</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-pa-sm">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="form.nome"
                label="Nome *"
                :rules="[
                  val => !!val || 'Nome é obrigatório',
                  val => val.length >= 3 || 'Mínimo de 3 caracteres',
                  val => val.length <= 100 || 'Máximo de 100 caracteres'
                ]"
                outlined
                dense
              />
            </div>

            <div class="col-12">
              <q-input
                v-model="form.descricao"
                label="Descrição *"
                type="textarea"
                :rules="[val => !!val || 'Descrição é obrigatória']"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.valorCusto"
                label="Valor de Custo *"
                type="number"
                :rules="[val => !!val || 'Valor de custo é obrigatório']"
                prefix="R$"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.valorVenda"
                label="Valor de Venda *"
                type="number"
                :rules="[val => !!val || 'Valor de venda é obrigatório']"
                prefix="R$"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.comissao"
                label="Comissão *"
                type="number"
                :rules="[val => !!val || 'Comissão é obrigatória']"
                suffix="%"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.orderExibicao"
                label="Ordem de Exibição *"
                type="number"
                :rules="[val => !!val || 'Ordem de exibição é obrigatória']"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.quantidadeEstoque"
                label="Quantidade em Estoque *"
                type="number"
                :rules="[val => !!val || 'Quantidade em estoque é obrigatória']"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.descontoMaximoPorcentagem"
                label="Desconto Máximo *"
                type="number"
                :rules="[val => !!val || 'Desconto máximo é obrigatório']"
                suffix="%"
                outlined
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="form.unidadeMedida"
                :options="unidadeMedidaOptions"
                label="Unidade de Medida *"
                :rules="[val => !!val || 'Unidade de medida é obrigatória']"
                outlined
                dense
                emit-value
                map-options
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
import { Produto } from 'src/model/produto.interface';
import { UnidadeMedida } from 'src/model/unidade-medida.enum';
import { useProdutoStore } from 'src/stores/produto.store';

const produtoStore = useProdutoStore();
const props = defineProps<{
  modelValue: boolean,
  produto: Produto | undefined
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>();

const isEdit = computed(() => !!props.produto);

const form = ref<Produto>({
  codigo: props.produto?.codigo,
  nome: props.produto?.nome || '',
  descricao: props.produto?.descricao || '',
  valorCusto: props.produto?.valorCusto || 0,
  valorVenda: props.produto?.valorVenda || 0,
  comissao: props.produto?.comissao || 0,
  orderExibicao: props.produto?.orderExibicao || 0,
  quantidadeEstoque: props.produto?.quantidadeEstoque || 0,
  descontoMaximoPorcentagem: props.produto?.descontoMaximoPorcentagem || 0,
  unidadeMedida: props.produto?.unidadeMedida || ''
});

const unidadeMedidaOptions = Object.values(UnidadeMedida).map(value => ({
  label: value,
  value: value
}));

watch(() => props.produto, (newProduto) => {
  if (newProduto) {
    form.value = {
      ...newProduto,
      nome: newProduto.nome,
      descricao: newProduto.descricao,
      valorCusto: newProduto.valorCusto,
      valorVenda: newProduto.valorVenda,
      comissao: newProduto.comissao,
      orderExibicao: newProduto.orderExibicao,
      quantidadeEstoque: newProduto.quantidadeEstoque,
      descontoMaximoPorcentagem: newProduto.descontoMaximoPorcentagem,
      unidadeMedida: newProduto.unidadeMedida
    };
  } else {
    form.value = {
      codigo: undefined,
      nome: '',
      descricao: '',
      valorCusto: 0,
      valorVenda: 0,
      comissao: 0,
      orderExibicao: 0,
      quantidadeEstoque: 0,
      descontoMaximoPorcentagem: 0,
      unidadeMedida: ''
    };
  }
}, { immediate: true });

async function onSubmit() {
  try {
    await produtoStore.salvarProduto(form.value);
    emit('update:modelValue', false);
  } catch (error) {
    console.error('Erro ao salvar produto:', error);
  }
}

function onHide() {
  emit('update:modelValue', false);
}
</script>
