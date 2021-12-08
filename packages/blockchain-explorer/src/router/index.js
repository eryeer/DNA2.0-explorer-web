import Vue from 'vue';
import VueRouter from 'vue-router';
import { setDocumentTitle } from '@dna2.0/utils/dom';
import routes from './routes';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes,
  // eslint-disable-next-line no-unused-vars
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
});

const whiteList = ['login', 'reg', 'notfound'];

router.beforeEach((to, from, next) => {
  // 设置title
  if (to.meta && to.meta.title) {
    setDocumentTitle(to.meta.title);
  } else {
    setDocumentTitle(process.env.VUE_APP_TITLE);
  }
  next();

});

router.afterEach(() => {});

const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((error) => error);
};

export default router;
