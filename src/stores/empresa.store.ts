import { ref } from 'vue'
import { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import useNotify from 'src/composable/UseNotify'
import { ErrorApi } from 'src/model/error.interface'
import { empresaService } from 'src/services/empresa.service'
import { EmpresaRequest, EmpresaResponse } from 'src/model/empresa.interface'

const notify = useNotify()

export const useEmpresaStore = defineStore('empresa', () => {
    const pagination = ref({
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
    });
    const empresa = ref<EmpresaResponse | null>(null);
    const empresasPaginados = ref<EmpresaResponse[]>([]);
    const loading = ref(false);

    async function getEmpresaPaginado(page: number = 1, rowsPerPage: number = 10, filter = null) {
        try {
        loading.value = true
        const data = await empresaService.list(filter, page - 1 , rowsPerPage);
        empresasPaginados.value = data.content
        pagination.value.rowsNumber = data.totalElements
        } catch (error: unknown) {
        const err = error as AxiosError<ErrorApi>
        notify.notifyErrorResponseAPI(err?.response?.data)
        } finally {
        loading.value = false
        }
    }

    async function criarEmpresa(empresa: EmpresaRequest) {
        try {
        loading.value = true;
        await empresaService.create(empresa);
        await getEmpresaPaginado();
        notify.notifySuccess('Evento criado com sucesso!');
        } catch (error) {
        const err = error as AxiosError<ErrorApi>;
        notify.notifyErrorResponseAPI(err?.response?.data);
        throw error;
        } finally {
        loading.value = false;
        }
    }

    async function atualizarEmpresa(empresa: EmpresaRequest) {
        try {
        loading.value = true;
        if (!empresa.codigo) {
            throw new Error('Código do evento é obrigatório para atualização');
        }
        await empresaService.update(empresa.codigo, empresa);
        await getEmpresaPaginado();
        notify.notifySuccess('Evento atualizado com sucesso!');
        } catch (error) {
        const err = error as AxiosError<ErrorApi>;
        notify.notifyErrorResponseAPI(err?.response?.data);
        throw error;
        } finally {
        loading.value = false;
        }
    }

    async function excluirEmpresa(codigo: number) {
        try {
        loading.value = true;
        if (!codigo) {
            throw new Error('Código do evento é obrigatório para excluir');
        }
        await empresaService.delete(codigo);
        await getEmpresaPaginado();
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
        empresa,
        loading,
        pagination,
        criarEmpresa,
        excluirEmpresa,
        atualizarEmpresa,
        empresasPaginados,
        getEmpresaPaginado
    }
})
