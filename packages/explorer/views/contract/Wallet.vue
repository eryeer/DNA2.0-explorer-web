<template>
  <span class="wallet">
    <el-button @click="connect" v-if="unconnected" class="w-130 medium-btn">
      <i class="tip vm"></i> 连接到Web3
    </el-button>
    <el-button @click="switchNetwork" v-else-if="connect_error" type="danger" class="w-130 medium-btn">
      请切换到正确网络
    </el-button>
    <el-button v-else class="w-130 medium-btn">
      <span v-html="jazzicon" class="vm"></span> {{ account | filterAddress }}
    </el-button>
  </span>
</template>

<script>
import { ethers } from 'ethers';
import Jazzicon from 'jazzicon';
import { networkStatus } from '@dna2.0/utils/values';
import { switchNetwork, getNetworkParams } from './utils';

export default {
  name: 'Wallet',
  computed: {
    account() {
      return this.$store.state.account;
    },
    jazzicon() {
      if (!this.account) return '';
      return Jazzicon(16, parseInt(this.account.slice(2, 10), 16)).outerHTML;
    },
    unconnected() {
      return this.$store.state.networkStatus === networkStatus.UNCONNECTED;
    },
    connect_error() {
      return this.$store.state.networkStatus === networkStatus.CONNECT_ERROR;
    },
  },
  filters: {
    filterAddress(val) {
      if (val.length <= 12) {
        return val;
      }
      return `${val.substr(0, 6)}...${val.substr(val.length - 4, 4)}`;
    },
  },
  methods: {
    async connect() {
      if (typeof window.ethereum === 'undefined') {
        window.open('https://metamask.io/', '_blank', 'noopener');
        return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      this.$store.commit('setAccount', await signer.getAddress());
      const networkParams = getNetworkParams();
      const { chainId } = await provider.getNetwork();
      if (chainId !== Number(networkParams.chainId)) {
        this.$store.commit('setNetworkStatus', networkStatus.CONNECT_ERROR);
      } else {
        this.$store.commit('setNetworkStatus', networkStatus.CONNECT_NORMAL);
      }
    },
    async switchNetwork() {
      await switchNetwork();
      this.$store.commit('setNetworkStatus', networkStatus.CONNECT_NORMAL);
    },
    listen() {
      if (!ethereum || !ethereum.on) return;

      this.handleChainChanged = (chainId) => {
        const networkParams = getNetworkParams();
        if (chainId !== networkParams.chainId) {
          this.$store.commit('setNetworkStatus', networkStatus.CONNECT_ERROR);
        }
      };

      this.handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          this.$store.commit('reset');
        } else if (accounts[0] !== this.account) {
          this.$store.commit('setAccount', accounts[0]);
        }
      };
      ethereum.on('chainChanged', this.handleChainChanged);
      ethereum.on('accountsChanged', this.handleAccountsChanged);
    },
  },
  mounted() {
    this.listen();
  },
  destroyed() {
    if (ethereum && ethereum.on) {
      ethereum.removeListener('chainChanged', this.handleChainChanged);
      ethereum.removeListener('accountsChanged', this.handleAccountsChanged);
    }
  },
};
</script>
<style lang="scss" scoped>
.tip {
  display: inline-block;
  height: 14px;
  width: 14px;
  border-radius: 50%;
  background-color: #dc3545;
}
.vm {
  vertical-align: -3px;
}
.w-130 {
  width: 130px;
}
</style>
