import explorerRoutes from '@dna2.0/explorer/routes';

export default [
  {
    ...explorerRoutes,
  },
  {
    path: '404',
    name: 'notfound',
    component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
    meta: { title: '404' },
  },
  { path: '*', redirect: { path: '/404' } },
];
