import { ref } from 'vue'
import { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import useNotify from 'src/composable/UseNotify'
import { ErrorApi } from 'src/model/error.interface'
import { eventoService } from 'src/services/evento.service'
import { EventoResponse } from 'src/model/evento.interface'
import { EmpresaResponse } from 'src/model/empresa.interface'
import { empresaService } from 'src/services/empresa.service'

const notify = useNotify()

export const useEventoStore = defineStore('evento', () => {
    const pagination = ref({
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
    });
    const evento = ref<EventoResponse | null>(null);
    const eventosPaginados = ref<EventoResponse[]>([]);
    const empresas = ref<EmpresaResponse[]>([]);
    const empresasFiltradas = ref<EmpresaResponse[]>([]);
    const loading = ref(false);

    async function getEventosPaginado(page: number = 1, rowsPerPage: number = 10, filter = null) {
        try {
        loading.value = true
        const data = await eventoService.list(filter, page - 1 , rowsPerPage);
        eventosPaginados.value = data.content
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

    async function criarEvento(evento: EventoResponse) {
        try {
        loading.value = true;
        await eventoService.create(evento);
        await getEventosPaginado();
        notify.notifySuccess('Evento criado com sucesso!');
        } catch (error) {
        const err = error as AxiosError<ErrorApi>;
        notify.notifyErrorResponseAPI(err?.response?.data);
        throw error;
        } finally {
        loading.value = false;
        }
    }

    async function atualizarEvento(evento: EventoResponse) {
        try {
        loading.value = true;
        if (!evento.codigo) {
            throw new Error('Código do evento é obrigatório para atualização');
        }
        await eventoService.update(evento.codigo, evento);
        await getEventosPaginado();
        notify.notifySuccess('Evento atualizado com sucesso!');
        } catch (error) {
        const err = error as AxiosError<ErrorApi>;
        notify.notifyErrorResponseAPI(err?.response?.data);
        throw error;
        } finally {
        loading.value = false;
        }
    }

    async function excluirEvento(codigo: number) {
        try {
        loading.value = true;
        if (!codigo) {
            throw new Error('Código do evento é obrigatório para excluir');
        }
        await eventoService.delete(codigo);
        await getEventosPaginado();
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
        evento,
        loading,
        empresas,
        pagination,
        criarEvento,
        excluirEvento,
        atualizarEvento,
        eventosPaginados,
        carregarEmpresas,
        empresasFiltradas,
        getEventosPaginado,
    }
})
