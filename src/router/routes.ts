import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { name: 'home', path: '', redirect: 'gestao-cartelas' },
      { name: 'eventos', path: 'eventos', component: () => import('pages/evento/Eventos.vue') },
      { name: 'clientes', path: 'clientes', component: () => import('pages/cliente/Clientes.vue') },
      { name: 'usuarios', path: 'usuarios', component: () => import('pages/usuario/Usuarios.vue') },
      { name: 'cartelas', path: 'cartelas', component: () => import('pages/cartela/Cartelas.vue') },
      { name: 'vendedores', path: 'vendedores', component: () => import('pages/vendedor/Vendedores.vue') },
      { name: 'gestao-cartelas', path: 'gestao-cartelas', component: () => import('pages/gestao-cartela/GestaoCartelas.vue') },
    ]
  },
  {
    path: '/login',
    component: () => import('pages/login.vue')
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
