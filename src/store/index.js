import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import { networkStatus } from '@/utils/values';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  state: {
    account: null,
    networkStatus: networkStatus.UNCONNECTED,
    provider: null,
  },
  getters: {
    isLogin: (state) => {
      return !!state.account;
    },
  },
  mutations: {
    setAccount(state, payload) {
      state.account = payload;
    },
    setProvider(state, payload) {
      state.provider = payload;
    },
    setNetworkStatus(state, payload) {
      state.networkStatus = payload;
    },
    reset(state) {
      state.account = null;
      state.networkStatus = networkStatus.UNCONNECTED;
    },
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
