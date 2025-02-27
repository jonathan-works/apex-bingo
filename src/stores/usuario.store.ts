import { defineStore } from 'pinia'
import { usuarioService } from 'src/service/usuario.service'
import { ref } from 'vue'
import { Usuario } from 'src/model/usuario.interface'
import { AxiosError } from 'axios'
import useNotify from 'src/composable/UseNotify'
import { ErrorApi } from 'src/model/error.interface'

const notify = useNotify()

export const useUsuarioStore = defineStore('usuario', () => {
  const usuarios = ref<Usuario[]>([])
  const loading = ref(false)

  async function buscarUsuarios() {
    try {
      loading.value = true
      const { data } = await usuarioService.listarUsuarios()
      usuarios.value = data.content
    } finally {
      loading.value = false
    }
  }

  async function salvarUsuario(usuario: Usuario) {
    try {
      loading.value = true
      if (usuario.codigo) {
        await usuarioService.atualizarUsuario(Number(usuario.codigo), usuario)
      } else {
        await usuarioService.criarUsuario(usuario)
      }
      await buscarUsuarios()
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorApi>
      notify.notifyErrorResponseAPI(err?.response?.data)
    } finally {
      loading.value = false
    }
  }

  async function excluirUsuario(id: string) {
    try {
      loading.value = true
      await usuarioService.excluirUsuario(Number(id))
      await buscarUsuarios()
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorApi>
      notify.notifyErrorResponseAPI(err?.response?.data)
    } finally {
      loading.value = false
    }
  }

  return {
    usuarios,
    loading,
    buscarUsuarios,
    salvarUsuario,
    excluirUsuario
  }
})
