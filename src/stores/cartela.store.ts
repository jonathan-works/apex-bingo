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
import { cartelaService } from 'src/services/cartela.service'
import { CartelaFilter, CartelaRequest, CartelaResponse } from 'src/model/cartela.interface'
import { UploadRequest } from 'src/model/upload.interface'

const notify = useNotify()

export const useCartelaStore = defineStore('cartela', () => {
    const pagination = ref({
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
    });
    const filter = ref<CartelaFilter | null>(null);
    const cartela = ref<CartelaResponse | null>(null);
    const cartelasPaginadas = ref<CartelaResponse[]>([]);

    const empresas = ref<EmpresaResponse[]>([]);
    const empresasFiltradas = ref<EmpresaResponse[]>([]);
    const eventos = ref<EventoResponse[]>([]);
    const eventosFiltrados = ref<EventoResponse[]>([]);
    const vendedores = ref<VendedorResponse[]>([]);
    const vendedoresFiltrados = ref<VendedorResponse[]>([]);
    const loading = ref(false);

    async function getCartelaPaginado() {
        try {
        loading.value = true
        const data = await cartelaService.list(filter.value, pagination.value.page - 1 , pagination.value.rowsPerPage);
        cartelasPaginadas.value = data.content
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

    async function carregarCarteiraPorId() {
        try {
            loading.value = true
            const codigo = cartela.value?.codigo as string;
            const data = await cartelaService.findById(codigo);
            cartela.value = data
        } catch (error: unknown) {
        const err = error as AxiosError<ErrorApi>
        notify.notifyErrorResponseAPI(err?.response?.data)
        } finally {
        loading.value = false
        }
    }

    async function criarCartela(gestaoRifa: CartelaRequest) {
        try {
        loading.value = true;
        await cartelaService.create(gestaoRifa);
        await getCartelaPaginado();
        notify.notifySuccess('Cartela criada com sucesso!');
        } catch (error) {
        const err = error as AxiosError<ErrorApi>;
        notify.notifyErrorResponseAPI(err?.response?.data);
        throw error;
        } finally {
        loading.value = false;
        }
    }

    async function atualizarCartela(cartela: CartelaRequest) {
        try {
        loading.value = true;
        if (!cartela.codigo) {
            throw new Error('Código do evento é obrigatório para atualização');
        }
        await cartelaService.update(cartela.codigo, cartela);
        await getCartelaPaginado();
        notify.notifySuccess('Carteira atualizada com sucesso!');
        } catch (error) {
        const err = error as AxiosError<ErrorApi>;
        notify.notifyErrorResponseAPI(err?.response?.data);
        throw error;
        } finally {
        loading.value = false;
        }
    }

    async function excluirCartela(codigo: number) {
        try {
        loading.value = true;
        if (!codigo) {
            throw new Error('Código do evento é obrigatório para excluir');
        }
        await cartelaService.delete(codigo);
        await getCartelaPaginado();
        notify.notifySuccess('Carteira excluído com sucesso!');
        } catch (error) {
        const err = error as AxiosError<ErrorApi>;
        notify.notifyErrorResponseAPI(err?.response?.data);
        throw error;
        } finally {
        loading.value = false;
        }
    }

    async function uploadCartela(uploadRequest: UploadRequest) {
        try {
        loading.value = true;
        await cartelaService.uploadCartela(uploadRequest);
        await getCartelaPaginado();
        notify.notifySuccess('Upload realizado com sucesso!');
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
        cartela,
        empresas,
        pagination,
        vendedores,
        criarCartela,
        uploadCartela,
        excluirCartela,
        carregarEventos,
        atualizarCartela,
        carregarEmpresas,
        carregarVendedor,
        eventosFiltrados,
        empresasFiltradas,
        cartelasPaginadas,
        getCartelaPaginado,
        vendedoresFiltrados,
        carregarCarteiraPorId,

    }
})
