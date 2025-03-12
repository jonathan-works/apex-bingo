import { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from 'src/stores/auth.store';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { name: 'home', path: '', redirect: 'gestao-cartelas' },

      // 1. Cadastro de Pessoas
      // 2. Cadastro e Gestão de Permissões de Usuários
      // 3. Cadastro e Gestão de Eventos
      // 4. Cadastro e Gestão de Cartelas e Rifas

      // { name: 'pessoas', path: 'pessoas', component: () => import('pages/pessoa/Pessoas.vue') },
      { name: 'eventos', path: 'eventos', component: () => import('pages/evento/Eventos.vue') },
      { name: 'clientes', path: 'clientes', component: () => import('pages/cliente/Clientes.vue') },
      { name: 'usuarios', path: 'usuarios', component: () => import('pages/usuario/Usuarios.vue') },
      { name: 'gestao-cartelas', path: 'gestao-cartelas', component: () => import('pages/gestao-cartela/GestaoCartelas.vue') },
      // { name: 'permissoes', path: 'permissoes', component: () => import('pages/permissoes/Permissoes.vue') },
      // { name: 'cartelas-rifas', path: 'cartelas-rifas', component: () => import('pages/cartela/CartelasRifas.vue') },
    ]
  },
  {
    path: '/login',
    component: () => import('pages/Login.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
