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

        <div v-if="true" class="flex justify-center items-center q-gutter-sm q-mx-sm">
          <q-avatar color="positive" size="1.1em" /> 
          <div>
            ONLINE
          </div>
        </div>
        <div v-else class="flex justify-center items-center q-gutter-sm q-mx-sm">
          <q-avatar color="negative" size="1.1em" /> 
          <div>
            OFFLINE
          </div>
        </div>

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

    <DrawerCaixa v-model="showDrawerCaixa"></DrawerCaixa>

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
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="point_of_sale" color="accent" @click="toggleCaixa" >
          <q-tooltip>Caixa</q-tooltip>
        </q-btn>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import Logo from 'src/components/Logo.vue';
import { useAuthStore } from 'stores/auth.store';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';
import DrawerCaixa from 'src/components/drawer/DrawerCaixa.vue'

const $q = useQuasar();

const router = useRouter();
const authStore = useAuthStore();
const leftDrawerOpen = ref(false);
const miniState = ref(true);
const showDrawerCaixa = ref(false);

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
    icon: 'app_registration',
    to: '/gestao-cartelas'
  },
  {
    title: 'Cartelas',
    icon: 'dataset',
    to: '/cartelas'
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
  {
    title: 'Empresas',
    icon: 'apartment',
    to: '/empresas'
  },
];
function toggleCaixa(){
  showDrawerCaixa.value = !showDrawerCaixa.value;
}
</script>
