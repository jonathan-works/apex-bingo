<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="window-height window-width row justify-center items-center">
        <div class="column q-pa-lg">
          <div class="row">
            <q-card square bordered class="q-pa-lg shadow-1">
              <q-card-section>
                <q-form class="q-gutter-md" @submit="login">
                  <div class="flex justify-center">
                    <Logo :size="3"/>
                  </div>
                  <template v-if="!storedClienteConfigGestor">
                    <q-input
                      v-model="codigoCliente"
                      label="Código do cliente"
                      outlined
                      :dense="true"
                    >
                      <template v-slot:prepend>
                        <q-icon name="business" />
                      </template>
                    </q-input>
                  </template>
                  <template v-else>
                    <div class="text-subtitle2 text-center q-pb-md">
                      {{ storedClienteConfigGestor.nome }}
                    </div>
                  </template>

                  <q-input
                    v-model="user"
                    label="Nome do usuário"
                    outlined
                    :dense="true"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" />
                    </template>
                  </q-input>

                  <q-input
                    v-model="password"
                    label="Senha"
                    :type="isPwd ? 'password' : 'text'"
                    outlined
                    :dense="true"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>

                  <div>
                    <q-btn
                      type="submit"
                      color="accent"
                      class="full-width"
                      label="Entrar"
                      :loading="loading"
                    >
                      <template v-slot:loading>
                        <q-spinner-facebook />
                      </template>
                    </q-btn>
                  </div>
                  <div v-if="storedClienteConfigGestor" class="text-center">
                      <a href="#" @click="changeClientConfig">Escolher outra empresa</a>
                    </div>
                </q-form>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { Notify } from 'quasar'
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Logo from 'src/components/Logo.vue';
import { useAuthStore } from 'stores/auth.store';

const authStore = useAuthStore();
const router = useRouter();
const codigoCliente = ref('');
const user = ref('');
const password = ref('');
const isPwd = ref(true);
const loading = ref(false);

const storedClienteConfigGestor = computed(() => authStore.storedClienteConfigGestor);

async function login() {
  loading.value = true;
  try {
    await authStore.login(
      user.value,
      password.value,
      storedClienteConfigGestor.value?.codigo || codigoCliente.value
    );
    router.push('/');
  }
  catch {
    Notify.create({
      type: 'negative',
      message: 'Usuário ou senha inválidos'
    });
  }
  finally {
    loading.value = false;
  }
}

function changeClientConfig() {
  authStore.changeClientConfig()
}
</script>

<style lang="scss" scoped>
.q-card {
  width: 360px;
  @media (max-width: 400px) {
    width: 100%;
  }
}
</style>
