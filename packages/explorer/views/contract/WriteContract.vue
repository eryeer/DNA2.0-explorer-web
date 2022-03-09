<template>
  <div class="box">
    <div class="op">
      <el-button @click="connect" v-if="networkStatus === 0" class="w-130">
        <i class="tip vm"></i> 连接到Web3
      </el-button>
      <el-button @click="switchNetwork" v-else-if="networkStatus === 1" type="danger" class="w-130">
        请切换到正确网络
      </el-button>
      <el-button v-else class="w-130">
        <span v-html="jazzicon" class="vm"></span> {{ account | filterAddress }}
      </el-button>
      <span>
        <a href="#" @click.prevent="toggleCollapse()">{{ toggleDisplayText }}</a
        >&nbsp;
        <a href="#" @click.prevent="reset()">[Reset]</a>
      </span>
    </div>
    <el-form label-position="top" size="small">
      <el-collapse accordion v-model="activeNames">
        <el-collapse-item
          v-for="(item, index) in fragments"
          :key="index"
          class="collapse-item"
          :name="index"
        >
          <span slot="title" class="title"> {{ index + 1 }}. {{ item.name }} </span>
          <div class="content">
            <div v-for="(input, index_ii) in item.inputs" :key="'input_' + index_ii">
              <el-form-item
                :label="input.stateMutability === 'payable' ? '' : getInputLabel(input)"
              >
                <el-input
                  v-model.trim="fragments[index].params[index_ii]"
                  :placeholder="getInputLabel(input)"
                />
              </el-form-item>
            </div>
            <div class="mt-10 mb-5">
              <el-button
                size="mini"
                plain
                @click="write(item.name, index)"
                :class="{ disabled: networkStatus !== 2 }"
                v-loading="item.loading"
                :disabled="item.loading"
                >写入</el-button
              >
              <el-button v-if="item.reponse" size="mini" plain @click="goTx(item.reponse)">
                查看交易
              </el-button>
            </div>

            <div class="c-danger" v-if="item.error">
              {{ item.error.message }}
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </div>
</template>

<script>
import { ethers } from 'ethers';
import { getInterface, switchNetwork, getNetworkParams } from './utils';
import Jazzicon from 'jazzicon';

export default {
  name: 'WriteContract',
  data() {
    return {
      fragments: [],
      activeNames: [],
      indexMarker: [],
      networkStatus: 0,
      account: null,
    };
  },
  props: {
    contractInfo: {
      type: Object,
      required: true,
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
  computed: {
    toggleDisplayText() {
      return this.activeNames.length ? '[Collapse All]' : '[Expand All]';
    },
    jazzicon() {
      if (!this.account) return '';
      return Jazzicon(16, parseInt(this.account.slice(2, 10), 16)).outerHTML;
    },
  },
  watch: {
    contractInfo: {
      async handler() {
        this.init();
      },
      immediate: true,
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
      this.account = await signer.getAddress();
      this.provider = provider;

      const networkParams = getNetworkParams();
      const { chainId } = await provider.getNetwork();
      if (chainId !== Number(networkParams.chainId)) {
        this.networkStatus = 1;
      } else {
        this.networkStatus = 2;
      }
    },
    async switchNetwork() {
      await switchNetwork();
      this.networkStatus = 2;
    },
    async write(name, index) {
      if (this.networkStatus !== 2) {
        this.$message({
          message: '请先连接到Web3!',
          type: 'error',
        });
        return;
      }
      const { abi, address } = this.contractInfo;
      const signer = this.provider.getSigner();
      const contract = new ethers.Contract(address, abi, signer);
      this.fragments[index].loading = true;
      try {
        let res;
        if (this.fragments[index].stateMutability === 'payable') {
          const value = this.fragments[index].params[0];
          const params = this.fragments[index].params.slice(1);
          const options = { value: ethers.utils.parseEther(value) };
          res = await contract[name](...params, options);
        } else {
          res = await contract[name](...this.fragments[index].params);
        }
        this.fragments[index].reponse = res;
        this.fragments[index].error = '';
      } catch (error) {
        this.fragments[index].reponse = null;
        this.fragments[index].error = error;
      } finally {
        this.fragments[index].loading = false;
      }
    },
    getInputLabel(input) {
      return `${input.name ? input.name : '<input>'} (${input.type})`;
    },
    getOutputLabel(output) {
      return `${output.name ? output.name + ' ' : ''}`;
    },
    toggleCollapse() {
      if (!this.activeNames.length) {
        this.activeNames = [...Array(this.fragments.length).keys()];
      } else {
        this.activeNames = [];
      }
    },
    goTx({ hash }) {
      window.open(`/tx/${hash}`, '_blank');
    },
    reset() {
      this.activeNames = [];
      this.fragments.forEach((f, i) => {
        f.params = f.params.map(() => '');
        f.error = '';
        if (!this.indexMarker.includes(i)) {
          f.reponse = null;
        }
        f.loading = false;
      });
      this.networkStatus = 0;
    },
    handleChainChanged() {
      if (ethereum && ethereum.on) {
        this.handleChainChanged = (chainId) => {
          const networkParams = getNetworkParams();
          if (this.networkStatus === 2 && chainId !== networkParams.chainId) {
            this.networkStatus = 1;
          }
        };

        this.handleAccountsChanged = (accounts) => {
          if (this.networkStatus !== 0) {
            this.account = accounts[0];
          }
        };
        ethereum.on('chainChanged', this.handleChainChanged);
        ethereum.on('accountsChanged', this.handleAccountsChanged);
      }
    },
    async init() {
      this.getInterface();
    },
    async getInterface() {
      let { abi } = this.contractInfo;
      try {
        const { fragments } = getInterface(abi);
        this.fragments = fragments
          .filter(
            (f) =>
              f.type === 'function' &&
              !f.constant &&
              f.stateMutability !== 'view' &&
              f.stateMutability !== 'pure',
          )
          .map((item) => {
            if (item.stateMutability === 'payable') {
              item.inputs.unshift({
                name: 'payableAmount',
                type: 'ether',
                stateMutability: 'payable',
              });
            }
            return {
              ...item,
              params: Array.from(new Array(item.inputs.length), () => ''),
              reponse: null,
              loading: false,
              error: '',
            };
          });
      } catch (error) {}
    },
  },
  mounted() {
    this.handleChainChanged();
  },
  destroyed() {
    if (ethereum && ethereum.on) {
      if (ethereum.removeListener) {
        ethereum.removeListener('chainChanged', this.handleChainChanged);
        ethereum.removeListener('accountsChanged', this.handleAccountsChanged);
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.box {
  width: 100%;
  padding-left: 10px;
  padding-right: 10px;

  ::v-deep {
    .el-collapse-item__header {
      background-color: #f8f9fa;
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
      border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
      height: 35px;
      line-height: 35px;
      padding-left: 10px;
      padding-right: 10px;
    }
    .el-collapse-item__wrap {
      border-bottom: none;
    }
    .el-collapse-item__content {
      padding-bottom: 0;
    }
    .el-form-item--small.el-form-item {
      margin-bottom: 0;
    }
    .el-collapse {
      border-bottom: none;
    }
    .el-button.el-button + .el-button.el-button {
      margin-left: 10px;
    }
  }
}
.op {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  gap: 10px;
  padding-left: 10px;
  padding-right: 10px;
}
.collapse-item {
  margin-bottom: 15px;
}
.title {
  color: #343a40;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-size: 13px;
}
.content {
  padding: 13px;
}
.type {
  opacity: 0.4;
}
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
.disabled {
  opacity: 0.65;
  cursor: default;
}
</style>
