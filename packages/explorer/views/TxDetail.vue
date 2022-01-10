<template>
  <div class="box" v-loading="loading.value">
    <heading-2 with-go-back>交易详情</heading-2>
    <div class="info-bar f-16 pl-30 mb-20">
      <span class="mr-10">交易</span>
      <router-link
        :to="{
          name: 'explorerTx',
          params: {
            txHash: txHash,
          },
        }"
      >
        <copyable>{{ txHash }}</copyable>
      </router-link>
    </div>
    <el-tabs>
      <el-tab-pane label="总览">
        <div class="bg-white p-40" v-if="info.txHash">
          <ol class="list">
            <li>
              <span>生成时间:</span>
              <span>{{ info.blockTime | filterDate }}</span>
            </li>
            <li>
              <span>交易哈希:</span>
              <span>{{ info.txHash }}</span>
            </li>
            <li>
              <span>类型:</span>
              <span> {{ info.txType === 1 ? '合约部署' : '普通' }}</span>
            </li>
            <li>
              <span>状态:</span>
              <span :class="{ 'c-danger': info.txStatus !== '0x1' }">
                {{ info.txStatus === '0x1' ? '成功' : '失败' }}</span
              >
            </li>
            <li>
              <span>区块高度:</span>
              <span>{{ info.blockNumber | filterCount }}</span>
            </li>
            <li><divider /></li>
            <li>
              <span>发起地址:</span>
              <span>
                <router-link
                  :to="{
                    name: 'explorerAddress',
                    params: {
                      address: info.fromAddress,
                    },
                  }"
                >
                  {{ info.fromAddress }}
                </router-link></span
              >
            </li>
            <li>
              <span>接收地址:</span>
              <span>
                <el-tooltip content="合约" placement="top" v-if="info.toAddressType === 1">
                  <img src="@/assets/images/contract.png" height="14" class="contract-icon mr-5" />
                </el-tooltip>
                <router-link
                  :to="{
                    name: 'explorerAddress',
                    params: {
                      address: info.toAddress,
                    },
                  }"
                >
                  {{ info.toAddress }}
                </router-link></span
              >
            </li>
            <li><divider /></li>
            <template v-if="ERC20Transfers.length">
              <li>
                <span>Token转账:</span>
                <span>
                  <div class="mb-10" v-for="(transfer, index) in ERC20Transfers" :key="index">
                    <span class="c-grey">从 </span>
                    <router-link
                      :to="{
                        name: 'explorerAddress',
                        params: {
                          address: transfer.fromAddress,
                        },
                      }"
                    >
                      <short-hash :hash="transfer.fromAddress"></short-hash>
                    </router-link>
                    <span class="c-grey"> 到 </span>
                    <router-link
                      :to="{
                        name: 'explorerAddress',
                        params: {
                          address: transfer.toAddress,
                        },
                      }"
                    >
                      <short-hash :hash="transfer.toAddress"></short-hash>
                    </router-link>
                    <span class="c-grey"> 转 </span><span class="f-b">{{ transfer.amount }}</span>
                    <span v-if="transfer.tokenName">
                      {{ transfer.tokenName }}({{ transfer.tokenName }})
                    </span>
                    <template v-else>
                      Token
                      <router-link
                        :to="{
                          name: 'explorerAddress',
                          params: {
                            address: transfer.address,
                          },
                        }"
                      >
                        <short-hash :hash="transfer.address"></short-hash>
                      </router-link>
                    </template>
                  </div>
                </span>
              </li>
              <li><divider /></li>
            </template>
            <li v-for="(transfer, index) in ERC721Transfers" :key="index">
              <span>NFT Token转账:</span>
              <span>
                <div class="mb-10">
                  <span class="c-grey">从 </span>
                  <router-link
                    :to="{
                      name: 'explorerAddress',
                      params: {
                        address: transfer.fromAddress,
                      },
                    }"
                  >
                    <short-hash :hash="transfer.fromAddress"></short-hash>
                  </router-link>
                  <span class="c-grey"> 到 </span>
                  <router-link
                    :to="{
                      name: 'explorerAddress',
                      params: {
                        address: transfer.toAddress,
                      },
                    }"
                  >
                    <short-hash :hash="transfer.toAddress"></short-hash>
                  </router-link>
                  <span class="c-grey"> 转 </span
                  ><span class="f-b">ERC-721 TokenID [{{ transfer.tokenId }}] </span>
                  <span v-if="transfer.tokenName">
                    {{ transfer.tokenName }}({{ transfer.tokenName }})
                  </span>
                  <template v-else>
                    <router-link
                      :to="{
                        name: 'explorerAddress',
                        params: {
                          address: transfer.address,
                        },
                      }"
                    >
                      <short-hash :hash="transfer.address"></short-hash>
                    </router-link>
                  </template>
                </div>
              </span>
            </li>
            <li v-if="ERC721Transfers.length"><divider /></li>
            <li>
              <span>数量:</span>
              <span> {{ gwei2ether(info.txValue) }} Ether</span>
            </li>
            <li>
              <span>交易费:</span>
              <span>{{ getGasAmount(info.gasUsed, info.gasPrice) }} Gwei</span>
            </li>
            <li>
              <span>燃料价格:</span>
              <span>{{ gwei2ether(info.gasPrice) }} Gwei</span>
            </li>
            <li>
              <span>消耗燃料:</span>
              <span>{{ info.gasUsed | filterCount }}</span>
            </li>
            <li>
              <span>燃料上限:</span>
              <span>{{ info.gasLimit | filterCount }}</span>
            </li>
            <li>
              <span>燃料使用率:</span>
              <span>{{ (info.gasUsed / info.gasLimit) | filterPercentage }}</span>
            </li>
            <li><divider /></li>
            <li>
              <span>Nonce:</span>
              <span>{{ info.nonce }}</span>
            </li>
            <li>
              <span>输入数据:</span>
              <span>
                <div class="mb-15">
                  <el-input
                    class="inputData"
                    type="textarea"
                    :rows="6"
                    :value="showInputData"
                    size="medium"
                    autocomplete="off"
                    readonly
                  ></el-input>
                </div>
                <div class="t-r">
                  <el-button
                    type="info"
                    size="mini"
                    plain
                    @click="showAsOriginal = !showAsOriginal"
                  >
                    <svg-icon icon-class="back2" class="s-n" />
                    {{ !showAsOriginal ? '展示原始数据' : '展示默认视图' }}</el-button
                  >
                </div>
              </span>
            </li>
          </ol>
        </div>
      </el-tab-pane>
      <el-tab-pane label="日志">
        <div class="bg-white p-40" v-if="!info.logList.length">
          <el-empty description="没有日志"></el-empty>
        </div>
        <div
          class="bg-white p-40 log"
          :class="{ 'mb-20': index !== info.logList.length - 1 }"
          v-for="(log, index) in info.logList"
          :key="index"
        >
          <span class="f-16 f-b mr-40"> {{ String(index + 1).padStart(2, '0') }}</span>
          <ol class="list">
            <li>
              <span>合约地址:</span>
              <span>
                <router-link
                  :to="{
                    name: 'explorerAddress',
                    params: {
                      address: log.address,
                    },
                  }"
                >
                  {{ log.address }}
                </router-link>
              </span>
            </li>
            <li v-if="log.eventName">
              <span>名称：</span>
              <span> <code-highlight :code="log.eventName" /></span>
            </li>
            <li>
              <span>主题:</span>
              <span>
                <div
                  v-for="(topic, index) in JSON.parse(log.topics)"
                  :key="index"
                  :class="{ 'mb-20': index !== JSON.parse(log.topics).length - 1 }"
                >
                  {{ index }} {{ topic }}
                </div>
              </span>
            </li>
            <li>
              <span>数据：</span>
              <span> {{ log.data }}</span>
            </li>
          </ol>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from 'axios';
import Loading from '@dna2.0/utils/loading';
import { getTransaction, getAddress } from '../api';
import Divider from './Divider';
import CodeHighlight from './CodeHighlight';
import { gwei2ether, getGasAmount } from '@dna2.0/utils';

export default {
  name: 'TxDetail',
  components: {
    Divider,
    CodeHighlight,
  },
  data() {
    return {
      info: {
        logList: [],
        ercTransferLog: [],
      },
      loading: new Loading(),
      inputData: '0x',
      showAsOriginal: false,
    };
  },
  computed: {
    txHash() {
      return this.$route.params.txHash;
    },
    ERC20Transfers() {
      if (!this.info.ercTransferLog.length) {
        return [];
      }
      return this.info.ercTransferLog.filter((item) => item.contractType === 'ERC20');
    },
    ERC721Transfers() {
      if (!this.info.ercTransferLog.length) {
        return [];
      }
      return this.info.ercTransferLog.filter((item) => item.contractType === 'ERC721');
    },
    showInputData() {
      return this.showAsOriginal ? this.info.data : this.inputData;
    },
  },
  watch: {
    txHash() {
      this.query();
    },
    'info.data'(val) {
      this.genInputData(val);
    },
  },
  methods: {
    query() {
      this.getTransaction();
    },
    async getTransaction() {
      const info = await this.loading.run(async () => {
        return await getTransaction({
          txHash: this.txHash,
        });
      });

      let toAddressType = 0;

      try {
        const addrInfo = await this.loading.run(async () => {
          return await getAddress({
            address: info.toAddress,
          });
        });
        toAddressType = addrInfo ? addrInfo.type : 0;
      } catch (error) {}
      this.info = {
        ...info,
        toAddressType,
      };
    },
    gwei2ether(val) {
      return gwei2ether(val);
    },
    getGasAmount(gasUsed, gasPrice) {
      return getGasAmount(gasUsed, gasPrice);
    },
    async genInputData(result) {
      if (!result || result === '0x' || result.slice(0, 2) !== '0x') {
        this.inputData = result;
      } else {
        const signHash = result.slice(2, 10);

        const signatures = await axios({
          url: `https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/${signHash}`,
          method: 'get',
        });

        let str = `Function: ${signatures.data} ***

MethodID: ${result.slice(0, 10)}`;

        let i = 0;

        while (i < Math.floor(result.length / 64)) {
          str += `\n[${i}]:  ${result.slice(i * 64 + 10, (i + 1) * 64 + 10)}`;

          i++;
        }

        this.inputData = str;
      }
    },
  },
  mounted() {
    this.query();
  },
};
</script>

<style lang="scss" scoped>
.info-bar {
  display: flex;
  height: 40px;
  line-height: 40px;
  background-color: rgba($color: #0078fa, $alpha: 0.04);
}

.log {
  display: flex;
}

.list {
  > li {
    display: flex;
    > span:first-child {
      opacity: 0.6;
      min-width: 100px;
      margin-right: 50px;
    }
    > span:last-child {
      word-break: break-all;
      padding-right: 20px;
      flex: 1;
    }
    &:not(:last-child) {
      margin-bottom: 30px;
    }
  }
}

.contract-icon {
  vertical-align: -2px;
}

.s-n {
  stroke: none;
}

.inputData {
  ::v-deep {
    .el-textarea__inner {
      padding: 20px;
      color: rgb(119, 131, 143);
      font-family: SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
    }
  }
}
</style>
