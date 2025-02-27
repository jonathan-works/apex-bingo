<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        title="Usuários"
        :rows="usuarios"
        :columns="columns"
        row-key="codigo"
        :loading="loading"
        :pagination="pagination"
        @request="onRequest"
        :grid="$q.screen.lt.md || isGridView"
      >
        <template v-slot:top-right>
          <!-- <q-input
            v-model="filter"
            placeholder="Buscar"
            dense
            debounce="300"
            class="q-mr-md"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input> -->

          <div class="row items-center">
            <ButtonToggleView
              v-if="!$q.screen.lt.md"
              v-model:isGrid="isGridView"
            />
            <q-btn color="primary" label="Novo Usuário" @click="openDialog()" class="q-ml-sm" />
          </div>
        </template>

        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4" v-if="$q.screen.lt.md || isGridView">
            <q-card>
              <q-card-section>
                <div class="text-h6">{{ props.row.pessoa.nome }}</div>
                <div class="text-subtitle2">{{ props.row.pessoa.email }}</div>
                <div class="text-subtitle2">{{ props.row.pessoa.telefone }}</div>
              </q-card-section>
              <q-separator />
              <q-card-actions align="center">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="edit"
                  @click="editarUsuario(props.row)"
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  color="negative"
                  icon="delete"
                  @click="confirmarExclusao(props.row)"
                >
                  <q-tooltip>Excluir</q-tooltip>
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-sm">
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              @click="editarUsuario(props.row)"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click="confirmarExclusao(props.row)"
            >
              <q-tooltip>Excluir</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <UsuarioDialog
      v-model="showDialog"
      :usuario="selectedUsuario"
      @save="salvarUsuario"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { usuarioService } from 'src/service/usuario.service';
import { Usuario } from 'src/model/usuario.interface';
import UsuarioDialog from './UsuarioDialog.vue';
import ButtonToggleView from 'src/components/button/ButtonToggleView.vue';

const $q = useQuasar();
const loading = ref(false);
const usuarios = ref<Usuario[]>([]);
const isGridView = ref(false);
const filter = ref('');
const showDialog = ref(false);
const selectedUsuario = ref<Usuario | undefined>();

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});

const columns = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left' as const },
  { name: 'nome', label: 'Nome', field: row => row.pessoa.nome, align: 'left' as const },
  { name: 'email', label: 'Email', field: row => row.pessoa.email, align: 'left' as const },
  { name: 'telefone', label: 'Telefone', field: row => row.pessoa.telefone, align: 'left' as const },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' as const }
];

async function carregarUsuarios(page: number, rowsPerPage: number, filter = '') {
  loading.value = true;
  try {
    const { data } = await usuarioService.listarUsuarios(page - 1, rowsPerPage, filter);
    usuarios.value = data.content;
    pagination.value.rowsNumber = data.totalElements;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar usuários'
    });
  } finally {
    loading.value = false;
  }
}

async function onRequest(props: any) {
  const { page, rowsPerPage } = props.pagination;
  await carregarUsuarios(page, rowsPerPage, filter.value);
}

function openDialog(usuario?: Usuario) {
  selectedUsuario.value = usuario ? { ...usuario } : undefined;
  showDialog.value = true;
}

function editarUsuario(usuario: Usuario) {
  openDialog(usuario);
}

function confirmarExclusao(usuario: Usuario) {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: `Deseja realmente excluir o usuário ${usuario.pessoa.nome}?`,
    cancel: {
      label: 'Cancelar',
      flat: true,
      color: 'primary'
    },
    ok: {
      label: 'Excluir',
      color: 'negative'
    },
    persistent: true
  }).onOk(async () => {
    try {
      await usuarioService.excluirUsuario(usuario.codigo!);
      await carregarUsuarios(pagination.value.page, pagination.value.rowsPerPage, filter.value);
      $q.notify({
        type: 'positive',
        message: 'Usuário excluído com sucesso'
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Erro ao excluir usuário'
      });
    }
  });
}

async function salvarUsuario(usuario: Usuario) {
  try {
    if (usuario.codigo) {
      await usuarioService.atualizarUsuario(usuario.codigo, usuario);
      $q.notify({
        type: 'positive',
        message: 'Usuário atualizado com sucesso'
      });
    } else {
      await usuarioService.criarUsuario(usuario);
      $q.notify({
        type: 'positive',
        message: 'Usuário criado com sucesso'
      });
    }
    showDialog.value = false;
    await carregarUsuarios(pagination.value.page, pagination.value.rowsPerPage, filter.value);
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: usuario.codigo ? 'Erro ao atualizar usuário' : 'Erro ao criar usuário'
    });
  }
}

onMounted(() => {
  carregarUsuarios(pagination.value.page, pagination.value.rowsPerPage);
});
</script>
