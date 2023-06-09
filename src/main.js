import 'normalize.css/normalize.css'; // a modern alternative to CSS resets
import Vue from 'vue';
import ElementUi, { Notification, Message } from 'element-ui';
import '@/styles/rules/index.scss';
import components from '@/components';
import errorHandler from '@/utils/errorHandler';

import App from './App.vue';
import router from './router';
import * as filters from './filters';
import store from './store';
import './icons';

// enable debug for development
if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = '*,-sockjs-client:*';
}

Vue.use(ElementUi, {
  size: 'small', // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
});

Vue.use(components);
Vue.use(errorHandler);

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
