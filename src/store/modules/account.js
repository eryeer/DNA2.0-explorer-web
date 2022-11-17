import { networkStatus } from '@/utils/values';

export default {
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
  actions: {},
};
