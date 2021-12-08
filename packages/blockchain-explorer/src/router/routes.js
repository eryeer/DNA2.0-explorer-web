import Layout from '@/views/Layout';
import explorerRoutes from '@dna2.0/explorer/routes';

export default [
  {
    path: '/',
    component: Layout,
    redirect: '/explorer',
    children: [
      {
        ...explorerRoutes,
      },
    ],
  },
  { path: '*', redirect: { path: '/404' } },
];
