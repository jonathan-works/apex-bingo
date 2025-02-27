import { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from 'src/stores/auth.store';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { name: 'home', path: '', redirect: 'pedidos' },
      { name: 'usuarios', path: 'usuarios', component: () => import('pages/usuario/Usuarios.vue') },
      { name: 'servicos', path: 'servicos', component: () => import('pages/servico/Servicos.vue') },
      { name: 'produtos', path: 'produtos', component: () => import('pages/produto/Produtos.vue') },
      { name: 'condicoes-pagamento', path: 'condicoes-pagamento', component: () => import('pages/condicao-pagamento/CondicoesPagamento.vue') },
      { name: 'clientes', path: 'clientes', component: () => import('pages/cliente/Clientes.vue') },
      { name: 'empresas', path: 'empresas', component: () => import('pages/empresa/Empresas.vue') },
      { name: 'colaboradores', path: 'colaboradores', component: () => import('pages/colaborador/Colaboradores.vue') },
      { name: 'pedidos', path: 'pedidos', component: () => import('pages/pedido/Pedidos.vue') },
      { name: 'pedido', path: 'pedido', component: () => import('pages/pedido/Pedido.vue') },
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
