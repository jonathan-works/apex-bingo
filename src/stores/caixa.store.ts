import { computed, ref } from 'vue'
import { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import useNotify from 'src/composable/UseNotify'
import { ErrorApi } from 'src/model/error.interface'
import { CaixaFilter, DadosCaixaResponse, LancamentoCaixaRequest } from 'src/model/caixa.interface'
import { caixaService } from 'src/services/caixa.service'
import { eventoService } from 'src/services/evento.service'
import { EventoResponse } from 'src/model/evento.interface'

const notify = useNotify()

export const useCaixaStore = defineStore('caixa', () => {
    const filter = ref<CaixaFilter | null>(null);
    const loading = ref(false);
    const caixa = ref<DadosCaixaResponse | null>(null);
    const eventos = ref<EventoResponse[]>([]);
    const eventosFiltrados = ref<EventoResponse[]>([]);

    const date = new Date();
    date.setDate(date.getDate() - 30);
    const dtI = ref<string>(date.toISOString().split('T')[0] as string);
    const dtF = ref<string>(new Date().toISOString().split('T')[0] as string);

    const dataInicio = computed({
    get: () => dtI.value.split('-').reverse().join('/'),
    set: (value) => dtI.value = value.split('/').reverse().join('-'),
    });

    const dataFinal = computed({
    get: () => dtF.value.split('-').reverse().join('/'),
    set: (value) => dtF.value = value.split('/').reverse().join('-'),
    });

    async function getCaixa() {
        try {
            loading.value = true
            const data = await caixaService.list({ dataInicio: dataInicio.value, dataFinal: dataFinal.value} as CaixaFilter);
            caixa.value = data
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

    async function criarLancamentoCaixa(request: LancamentoCaixaRequest) {
        try {
            loading.value = true;
            await caixaService.create(request);
        notify.notifySuccess('Lançamento no caixa criado com sucesso!');
        } catch (error) {
            const err = error as AxiosError<ErrorApi>;
            notify.notifyErrorResponseAPI(err?.response?.data);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    return {
        caixa,
        filter,
        eventos,
        loading,
        dtI,
        dtF,
        dataInicio,
        dataFinal,
        getCaixa,
        carregarEventos,
        eventosFiltrados,
        criarLancamentoCaixa,
    }
})
