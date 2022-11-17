export default [
  {
    path: '',
    name: 'explorer',
    component: () => import(/* webpackChunkName: "explorer" */ '@/views'),
    redirect: '/',
    meta: { title: '灵境元宇宙区块链浏览器', showInMenu: true, icon: 'explorer' },
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName: "explorer" */ '@/views/list/index'),
      },
      {
        path: '/blocks',
        name: 'blocks',
        component: () => import(/* webpackChunkName: "explorer" */ '@/views/list/Block'),
      },
      {
        path: '/txs',
        name: 'txs',
        component: () => import(/* webpackChunkName: "explorer" */ '@/views/list/Tx'),
      },
      {
        path: '/addresses',
        name: 'addresses',
        component: () => import(/* webpackChunkName: "explorer" */ '@/views/list/Address'),
      },
      {
        path: '/block/:blockHeight',
        name: 'explorerBlock',
        component: () => import(/* webpackChunkName: "explorer" */ '@/views/BlockDetail'),
      },
      {
        path: '/tx/:txHash',
        name: 'explorerTx',
        component: () => import(/* webpackChunkName: "explorer" */ '@/views/TxDetail'),
      },
      {
        path: '/address/:address',
        name: 'explorerAddress',
        component: () => import(/* webpackChunkName: "explorer" */ '@/views/AddressDetail'),
      },
    ],
  },
  {
    path: '404',
    name: 'notfound',
    component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
    meta: { title: '404' },
  },
  { path: '*', redirect: { path: '/404' } },
];
