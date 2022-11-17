<template>
  <div class="box">
    <div class="op">
      <wallet></wallet>
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
                :class="{ disabled: connect_no_normal }"
                v-loading="item.loading"
                :disabled="item.loading"
                >写入</el-button
              >
              <el-button v-if="item.reponse" size="mini" plain @click="goTx(item.reponse)">
                查看交易
              </el-button>
            </div>

            <div class="c-danger" v-if="item.error">
              {{ item.error.message }} {{ item.error.data && item.error.data.message }}
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </div>
</template>

<script>
import { ethers } from 'ethers';
import { getInterface } from './utils';
import Wallet from './Wallet';
import { networkStatus } from '@/utils/values';

export default {
  name: 'WriteContract',
  components: {
    Wallet,
  },
  data() {
    return {
      fragments: [],
      activeNames: [],
      indexMarker: [],
    };
  },
  props: {
    contractInfo: {
      type: Object,
      required: true,
    },
  },
  computed: {
    unconnected() {
      return this.$store.state.networkStatus === networkStatus.UNCONNECTED;
    },
    connect_no_normal() {
      return this.$store.state.networkStatus !== networkStatus.CONNECT_NORMAL;
    },
    toggleDisplayText() {
      return this.activeNames.length ? '[Collapse All]' : '[Expand All]';
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
    async write(name, index) {
      if (this.unconnected) {
        this.$message({
          message: '请先连接到Web3!',
          type: 'error',
        });
        return;
      }
      const { abi, address } = this.contractInfo;
      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      const signer = provider.getSigner();

      const contract = new ethers.Contract(address, abi, signer);
      this.fragments[index].loading = true;
      try {
        let res;
        let params = this.fragments[index].params;
        params = params.map((p) => {
          try {
            p = p.replace(/'/g, '"');
            return JSON.parse(p);
          } catch (error) {
            return p;
          }
        });
        if (this.fragments[index].stateMutability === 'payable') {
          const value = params[0];
          const options = { value: ethers.utils.parseEther(value) };
          res = await contract[name](...params.slice(1), options);
        } else {
          res = await contract[name](...params);
        }
        if (Array.isArray(res)) {
          res = `[${res.toString()}]`;
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
      this.$store.commit('reset');
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

.disabled {
  opacity: 0.65;
  cursor: default;
}
</style>
