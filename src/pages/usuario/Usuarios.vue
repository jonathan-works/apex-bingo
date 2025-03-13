<template>
    <q-page padding>
        <div class="q-pa-md">
            <q-table
                title="Usuarios"
                :rows="usuarioStore.usuariosPaginados"
                :columns="columns"
                row-key="codigo"
                :loading="usuarioStore.loading"
                v-model:pagination="usuarioStore.pagination"
                @request="onRequest"
                :grid="$q.screen.lt.md || isGridView"
            >
                <template v-slot:top-right>
                  <div class="row items-center">
                      <ButtonToggleView
                      v-if="!$q.screen.lt.md"
                      v-model:isGrid="isGridView"
                      />
                      <q-btn color="primary" label="Novo usuario" @click="openDialog()" class="q-ml-sm" />
                  </div>
                </template>
  
                <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4" v-if="$q.screen.lt.md || isGridView">
                    <q-card>
                    <q-card-section>
                        <div class="text-h6">{{ props.row.pessoa?.nome }}</div>
                        <div class="text-subtitle2">{{ formatarDocumento(props.row.pessoa?.documento) }}</div>
                        <div class="text-subtitle2">{{ props.row.pessoa?.email }}</div>
                        <div class="text-subtitle2">{{ formatarTelefone(props.row.pessoa?.telefone) }}</div>
                        <div class="text-subtitle2">{{ props.row?.empresa?.pessoa?.nome }}</div>
                    </q-card-section>
                    <q-separator />
                    <q-card-actions align="center">
                        <q-btn
                          flat
                          round
                          color="primary"
                          icon="edit"
                          @click="editar(props.row)"
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
                    @click="editar(props.row)"
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
            :usuario="usuarioStore.usuario as UsuarioResponse"
        />
    </q-page>
  </template>
  
<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import UsuarioDialog from './UsuarioDialog.vue';
import { useUsuarioStore } from 'src/stores/usuario.store';
import { UsuarioResponse } from 'src/model/usuario.interface';
import { formatarDocumento, formatarTelefone } from 'src/utils/format';
import ButtonToggleView from 'src/components/button/ButtonToggleView.vue';
  
  const $q = useQuasar();
  const usuarioStore = useUsuarioStore();
  usuarioStore.getUsuariosPaginado();
  
  const isGridView = ref(false);
  const showDialog = ref(false);
  const filter = ref(null);
  
  const columns = [
      {
        name: 'codigo',
        field: 'codigo',
        label: 'Código',
        align: 'left',
        sortable: true
      },
      {
        name: 'nome',
        field: (row : UsuarioResponse) => row.pessoa.nome,
        label: 'Nome',
        align: 'left',
        sortable: true
      },
      {
        name: 'documento',
        field: (row : UsuarioResponse) => formatarDocumento(row.pessoa.documento),
        label: 'Documento',
        align: 'left'
      },
      {
        name: 'email',
        field: (row : UsuarioResponse) => row.pessoa.email,
        label: 'Email',
        align: 'left'
      },
      {
        name: 'telefone',
        field: (row : UsuarioResponse) => formatarTelefone(row.pessoa.telefone),
        label: 'Telefone',
        align: 'left'
      },
      {
        name: 'actions',
        label: 'Ações',
        field: 'actions',
        align: 'center'
      }
    ]
  
  async function onRequest(props: any) {
    usuarioStore.pagination = props.pagination;
    await usuarioStore.getUsuariosPaginado();
  }
  
  function openDialog(usuario?: UsuarioResponse) {
    usuarioStore.usuario = usuario ? { ...usuario } : null;
    showDialog.value = true;
  }
  
  function editar(usuario: UsuarioResponse) {
    openDialog(usuario);
  }
  
  function confirmarExclusao(usuario: UsuarioResponse) {
    $q.dialog({
      title: 'Confirmar exclusão',
      message: `Deseja realmente excluir o usuario ${usuario?.pessoa?.nome}?`,
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
        await usuarioStore.excluirUsuario(usuario.codigo);
        await usuarioStore.getUsuariosPaginado(usuarioStore.pagination.page, usuarioStore.pagination.rowsPerPage, filter.value);
      } catch (error) {
      }
    });
  }
  </script>
    