import { ref } from 'vue'
import { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import useNotify from 'src/composable/UseNotify'
import { ErrorApi } from 'src/model/error.interface'
import { empresaService } from 'src/services/empresa.service'
import { EmpresaResponse } from 'src/model/empresa.interface'
import { GestaoCartelaResponse } from 'src/model/gestao-cartela.interfave'
import { gestaoCartelaService } from 'src/services/gestao-cartela.service'

const notify = useNotify()

export const useGestaoCartelaStore = defineStore('gestao-cartela', () => {
    const pagination = ref({
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
    });
    const gestaoCartela = ref<GestaoCartelaResponse | null>(null);
    const gestaoCartelasPaginados = ref<GestaoCartelaResponse[]>([]);
    const empresas = ref<EmpresaResponse[]>([]);
    const empresasFiltradas = ref<EmpresaResponse[]>([]);
    const loading = ref(false);

    async function getGestaoCarteiraPaginado(page: number = 1, rowsPerPage: number = 10, filter = null) {
        try {
        loading.value = true
        const data = await gestaoCartelaService.list(filter, page - 1 , rowsPerPage);
        gestaoCartelasPaginados.value = data.content
        pagination.value.rowsNumber = data.totalElements
        } catch (error: unknown) {
        const err = error as AxiosError<ErrorApi>
        notify.notifyErrorResponseAPI(err?.response?.data)
        } finally {
        loading.value = false
        }
    }
    async function carregarEmpresas() {
        try {
        loading.value = true
        const { data } = await empresaService.listarEmpresas();
        empresas.value = data.content
        } catch (error: unknown) {
        const err = error as AxiosError<ErrorApi>
        notify.notifyErrorResponseAPI(err?.response?.data)
        } finally {
        loading.value = false
        }
    }

    async function criarGestaoCarteira(gestaoCartela: GestaoCartelaResponse) {
        try {
        loading.value = true;
        await gestaoCartelaService.create(gestaoCartela);
        await getGestaoCarteiraPaginado();
        notify.notifySuccess('Evento criado com sucesso!');
        } catch (error) {
        const err = error as AxiosError<ErrorApi>;
        notify.notifyErrorResponseAPI(err?.response?.data);
        throw error;
        } finally {
        loading.value = false;
        }
    }

    async function atualizarGestaoCarteira(gestaoCartela: GestaoCartelaResponse) {
        try {
        loading.value = true;
        if (!gestaoCartela.codigo) {
            throw new Error('Código do evento é obrigatório para atualização');
        }
        await gestaoCartelaService.update(gestaoCartela.codigo, gestaoCartela);
        await getGestaoCarteiraPaginado();
        notify.notifySuccess('Evento atualizado com sucesso!');
        } catch (error) {
        const err = error as AxiosError<ErrorApi>;
        notify.notifyErrorResponseAPI(err?.response?.data);
        throw error;
        } finally {
        loading.value = false;
        }
    }

    async function excluirGestaoCarteira(codigo: number) {
        try {
        loading.value = true;
        if (!codigo) {
            throw new Error('Código do evento é obrigatório para excluir');
        }
        await gestaoCartelaService.delete(codigo);
        await getGestaoCarteiraPaginado();
        notify.notifySuccess('Evento excluído com sucesso!');
        } catch (error) {
        const err = error as AxiosError<ErrorApi>;
        notify.notifyErrorResponseAPI(err?.response?.data);
        throw error;
        } finally {
        loading.value = false;
        }
    }

    return {
        loading,
        empresas,
        pagination,
        gestaoCartela,
        carregarEmpresas,
        empresasFiltradas,
        criarGestaoCarteira,
        excluirGestaoCarteira,
        atualizarGestaoCarteira,
        gestaoCartelasPaginados,
        getGestaoCarteiraPaginado,
    }
})
