import { ref } from 'vue'
import { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import useNotify from 'src/composable/UseNotify'
import { ErrorApi } from 'src/model/error.interface'
import { empresaService } from 'src/services/empresa.service'
import { EmpresaResponse } from 'src/model/empresa.interface'
import { EventoResponse } from 'src/model/evento.interface'
import { eventoService } from 'src/services/evento.service'
import { VendedorResponse } from 'src/model/vendedor.interface'
import { vendedorService } from 'src/services/vendedor.service'
import { gestaoRifaService } from 'src/services/getao-rifa.service'
import { GestaoRifaRequest, GestaoRifaResponse } from 'src/model/cartela-rifa.interface'

const notify = useNotify()

export const useGestaoRifaStore = defineStore('gestao-rifa', () => {
    const pagination = ref({
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
    });
    const gestaoRifa = ref<GestaoRifaResponse | null>(null);
    const gestaoRifasPaginados = ref<GestaoRifaResponse[]>([]);

    const empresas = ref<EmpresaResponse[]>([]);
    const empresasFiltradas = ref<EmpresaResponse[]>([]);
    const eventos = ref<EventoResponse[]>([]);
    const eventosFiltrados = ref<EventoResponse[]>([]);
    const vendedores = ref<VendedorResponse[]>([]);
    const vendedoresFiltrados = ref<VendedorResponse[]>([]);
    const loading = ref(false);

    async function getGestaoRifaPaginado(page: number = 1, rowsPerPage: number = 10, filter = null) {
        try {
        loading.value = true
        const data = await gestaoRifaService.list(filter, page - 1 , rowsPerPage);
        gestaoRifasPaginados.value = data.content
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
        const data = await empresaService.listAll();
        empresas.value = data
        } catch (error: unknown) {
        const err = error as AxiosError<ErrorApi>
        notify.notifyErrorResponseAPI(err?.response?.data)
        } finally {
        loading.value = false
        }
    }

    async function carregarEventos() {
        try {
            loading.value = true
            const data = await eventoService.listAll();
            eventos.value = data
        } catch (error: unknown) {
        const err = error as AxiosError<ErrorApi>
        notify.notifyErrorResponseAPI(err?.response?.data)
        } finally {
        loading.value = false
        }
    }

    async function carregarVendedor() {
        try {
            loading.value = true
            const data = await vendedorService.listAll();
            vendedores.value = data
        } catch (error: unknown) {
        const err = error as AxiosError<ErrorApi>
        notify.notifyErrorResponseAPI(err?.response?.data)
        } finally {
        loading.value = false
        }
    }

    async function criarGestaoRifa(gestaoRifa: GestaoRifaRequest) {
        try {
        loading.value = true;
        await gestaoRifaService.create(gestaoRifa);
        await getGestaoRifaPaginado();
        notify.notifySuccess('Evento criado com sucesso!');
        } catch (error) {
        const err = error as AxiosError<ErrorApi>;
        notify.notifyErrorResponseAPI(err?.response?.data);
        throw error;
        } finally {
        loading.value = false;
        }
    }

    async function atualizarGestaoRifa(gestaoRifa: GestaoRifaRequest) {
        try {
        loading.value = true;
        if (!gestaoRifa.codigo) {
            throw new Error('Código do evento é obrigatório para atualização');
        }
        await gestaoRifaService.update(gestaoRifa.codigo, gestaoRifa);
        await getGestaoRifaPaginado();
        notify.notifySuccess('Evento atualizado com sucesso!');
        } catch (error) {
        const err = error as AxiosError<ErrorApi>;
        notify.notifyErrorResponseAPI(err?.response?.data);
        throw error;
        } finally {
        loading.value = false;
        }
    }

    async function excluirGestaoRifa(codigo: number) {
        try {
        loading.value = true;
        if (!codigo) {
            throw new Error('Código do evento é obrigatório para excluir');
        }
        await gestaoRifaService.delete(codigo);
        await getGestaoRifaPaginado();
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
        eventos,
        loading,
        empresas,
        pagination,
        vendedores,
        gestaoRifa,
        criarGestaoRifa,
        carregarEventos,
        carregarEmpresas,
        carregarVendedor,
        eventosFiltrados,
        empresasFiltradas,
        excluirGestaoRifa,
        atualizarGestaoRifa,
        vendedoresFiltrados,
        gestaoRifasPaginados,
        getGestaoRifaPaginado,
    }
})
