import { ref } from 'vue'
import { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import useNotify from 'src/composable/UseNotify'
import { ErrorApi } from 'src/model/error.interface'
import { EventoResponse } from 'src/model/evento.interface'
import { eventoService } from 'src/services/evento.service'
import { EmpresaResponse } from 'src/model/empresa.interface'
import { empresaService } from 'src/services/empresa.service'
import { VendedorResponse } from 'src/model/vendedor.interface'
import { vendedorService } from 'src/services/vendedor.service'
import { gestaoCartelaService } from 'src/services/gestao-cartela.service'
import { GestaoCartelaRequest, GestaoCartelaResponse } from 'src/model/gestao-cartela.interfave'

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
    const eventos = ref<EventoResponse[]>([]);
    const eventosFiltrados = ref<EventoResponse[]>([]);
    const vendedores = ref<VendedorResponse[]>([]);
    const vendedoresFiltrados = ref<VendedorResponse[]>([]);
    const loading = ref(false);

    async function getGestaoCartelaPaginado(page: number = 1, rowsPerPage: number = 10, filter = null) {
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

    async function criarGestaoCartela(gestaoCartela: GestaoCartelaRequest) {
        try {
        loading.value = true;
        await gestaoCartelaService.create(gestaoCartela);
        await getGestaoCartelaPaginado();
        notify.notifySuccess('Evento criado com sucesso!');
        } catch (error) {
        const err = error as AxiosError<ErrorApi>;
        notify.notifyErrorResponseAPI(err?.response?.data);
        throw error;
        } finally {
        loading.value = false;
        }
    }

    async function atualizarGestaoCartela(gestaoCartela: GestaoCartelaRequest) {
        try {
        loading.value = true;
        if (!gestaoCartela.codigo) {
            throw new Error('Código do evento é obrigatório para atualização');
        }
        await gestaoCartelaService.update(gestaoCartela.codigo, gestaoCartela);
        await getGestaoCartelaPaginado();
        notify.notifySuccess('Evento atualizado com sucesso!');
        } catch (error) {
        const err = error as AxiosError<ErrorApi>;
        notify.notifyErrorResponseAPI(err?.response?.data);
        throw error;
        } finally {
        loading.value = false;
        }
    }

    async function carregarCarteiraPorId() {
        try {
            loading.value = true
            const codigo = gestaoCartela.value?.codigo as string;
            const data = await gestaoCartelaService.findById(codigo);
            gestaoCartela.value = data
        } catch (error: unknown) {
        const err = error as AxiosError<ErrorApi>
        notify.notifyErrorResponseAPI(err?.response?.data)
        } finally {
        loading.value = false
        }
    }

    async function excluirGestaoCartela(codigo: number) {
        try {
        loading.value = true;
        if (!codigo) {
            throw new Error('Código do evento é obrigatório para excluir');
        }
        await gestaoCartelaService.delete(codigo);
        await getGestaoCartelaPaginado();
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
        gestaoCartela,
        carregarEventos,
        carregarVendedor,
        carregarEmpresas,
        eventosFiltrados,
        empresasFiltradas,
        vendedoresFiltrados,
        criarGestaoCartela,
        excluirGestaoCartela,
        carregarCarteiraPorId,
        atualizarGestaoCartela,
        gestaoCartelasPaginados,
        getGestaoCartelaPaginado,
    }
})
