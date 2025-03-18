import { ref } from 'vue'
import { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import useNotify from 'src/composable/UseNotify'
import { ErrorApi } from 'src/model/error.interface'
import { CaixaFilter, DadosCaixaResponse, LancamentoCaixaRequest } from 'src/model/caixa.interface'
import { caixaService } from 'src/services/caixar.service'

const notify = useNotify()

export const useCaixaStore = defineStore('caixa', () => {
    const filter = ref<CaixaFilter | null>(null);
    const loading = ref(false);
    const caixa = ref<DadosCaixaResponse | null>(null);

    async function getCaixa(dataInicio: string, dataFinal: string) {
        try {
            loading.value = true
            const data = await caixaService.list({ dataInicio, dataFinal} as CaixaFilter);
            caixa.value = data
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
        filter,
        loading,
        getCaixa,
        criarLancamentoCaixa,
    }
})
