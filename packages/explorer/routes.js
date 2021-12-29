export default {
  path: '/',
  name: 'explorer',
  component: () => import(/* webpackChunkName: "explorer" */ './views'),
  redirect: 'blocks',
  meta: { title: '区块链浏览器', showInMenu: true, icon: 'explorer' },
  children: [
    {
      path: ':type',
      name: 'explorerDashboard',
      component: () => import(/* webpackChunkName: "explorer" */ './views/dashboard'),
    },
    {
      path: 'block/:blockHeight',
      name: 'explorerBlock',
      component: () => import(/* webpackChunkName: "explorer" */ './views/BlockDetail'),
    },
    {
      path: 'tx/:txHash',
      name: 'explorerTx',
      component: () => import(/* webpackChunkName: "explorer" */ './views/TxDetail'),
    },
    {
      path: 'address/:address',
      name: 'explorerAddress',
      component: () => import(/* webpackChunkName: "explorer" */ './views/AddressDetail'),
    },
  ],
};
