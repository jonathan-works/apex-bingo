<template>
  <q-layout view="hHr lpR fFf">
    <q-header elevated>
      <q-toolbar class="items-center">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
          <Logo/>
        </q-toolbar-title>
        <!-- <q-toolbar-title>
          {{authStore.tipoUser === 'CAIXA' ? 'Caixa' : 'BARBEIRO'}}
        </q-toolbar-title> -->

        <div>
          <q-btn
            flat
            dense
            round
            :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
            aria-label="Tela Cheia"
            @click="$q.fullscreen.toggle()"
            class="q-mr-sm"
          />
          <q-btn
            flat
            dense
            round
            icon="logout"
            aria-label="Logout"
            @click="handleLogout"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      :mini="miniState"
      @mouseenter="miniState = false"
      @mouseleave="miniState = true"
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    >
      <q-list>
        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'stores/auth.store';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';
import Logo from 'src/components/Logo.vue';

const $q = useQuasar();

const router = useRouter();
const authStore = useAuthStore();
const leftDrawerOpen = ref(false);
const miniState = ref(true);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function handleLogout() {
  $q.dialog({
    title: 'Confirmar saída',
    message: 'Deseja realmente sair do sistema?',
    cancel: {
      label: 'Cancelar',
      flat: true,
      color: 'primary'
    },
    ok: {
      label: 'Sair',
      color: 'negative'
    },
    persistent: true
  }).onOk(() => {
    authStore.logout();
    router.push('/login');
  });
}

const linksList: EssentialLinkProps[] = [
  {
    title: 'Gestão de Cartelas',
    icon: 'dataset',
    to: '/gestao-cartelas'
  },
  {
    title: 'Gestão de Rifa',
    icon: 'app_registration',
    to: '/gestao-rifas'
  },
  {
    title: 'Clientes',
    icon: 'diversity_1',
    to: '/clientes'
  },
  {
    title: 'Vendedores',
    icon: 'support_agent',
    to: '/vendedores'
  },
  {
    title: 'Usuarios',
    icon: 'group',
    to: '/usuarios'
  },

  {
    title: 'Eventos',
    icon: 'event',
    to: '/eventos'
  },
];
</script>
