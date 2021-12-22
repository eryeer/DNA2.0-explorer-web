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
        <div class="bg-white p-40">
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
              <span>
                <el-tag :type="info.txStatus === '0x1' ? 'success' : 'danger'" size="mini">
                  {{ info.txStatus === '0x1' ? '成功' : '失败' }}
                </el-tag></span
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
                  <i class="el-icon-document"></i>
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
            <li>
              <span>Token转账:</span>
              <span>
                <div class="mb-10">
                  <span class="mr-10">从</span>
                  <router-link
                    :to="{
                      name: 'explorerAddress',
                      params: {
                        address: '0xba2ad566f880a1796bdedc256dc8da25bb484baf',
                      },
                    }"
                  >
                    <short-hash :hash="'0xba2ad566f880a1796bdedc256dc8da25bb484baf'"></short-hash>
                  </router-link>
                  <span class="ml-10 mr-10">到</span>
                  <router-link
                    :to="{
                      name: 'explorerAddress',
                      params: {
                        address: '0xba2ad566f880a1796bdedc256dc8da25bb484baf',
                      },
                    }"
                  >
                    <short-hash :hash="'0xba2ad566f880a1796bdedc256dc8da25bb484baf'"></short-hash>
                  </router-link>
                  <span class="ml-10 mr-10">转 <span class="f-b">22.2221</span> Token</span>
                  <router-link
                    :to="{
                      name: 'explorerTx',
                      params: {
                        txHash: '0xba2ad566f880a1796bdedc256dc8da25bb484baf',
                      },
                    }"
                  >
                    <short-hash :hash="'0xba2ad566f880a1796bdedc256dc8da25bb484baf'"></short-hash>
                  </router-link>
                </div>
                <div>
                  <span class="mr-10">从</span>
                  <router-link
                    :to="{
                      name: 'explorerAddress',
                      params: {
                        address: '0xba2ad566f880a1796bdedc256dc8da25bb484baf',
                      },
                    }"
                  >
                    <short-hash :hash="'0xba2ad566f880a1796bdedc256dc8da25bb484baf'"></short-hash>
                  </router-link>
                  <span class="ml-10 mr-10">到</span>
                  <router-link
                    :to="{
                      name: 'explorerAddress',
                      params: {
                        address: '0xba2ad566f880a1796bdedc256dc8da25bb484baf',
                      },
                    }"
                  >
                    <short-hash :hash="'0xba2ad566f880a1796bdedc256dc8da25bb484baf'"></short-hash>
                  </router-link>
                  <span class="ml-10 mr-10">转 <span class="f-b">22.2221</span> Token</span>
                  <router-link
                    :to="{
                      name: 'explorerTx',
                      params: {
                        txHash: '0xba2ad566f880a1796bdedc256dc8da25bb484baf',
                      },
                    }"
                  >
                    <short-hash :hash="'0xba2ad566f880a1796bdedc256dc8da25bb484baf'"></short-hash>
                  </router-link>
                </div>
              </span>
            </li>
            <li><divider /></li>
            <li>
              <span>NFT Token转账:</span>
              <span>
                <div>
                  <span class="mr-10">从</span>
                  <router-link
                    :to="{
                      name: 'explorerAddress',
                      params: {
                        address: '0xba2ad566f880a1796bdedc256dc8da25bb484baf',
                      },
                    }"
                  >
                    <short-hash :hash="'0xba2ad566f880a1796bdedc256dc8da25bb484baf'"></short-hash>
                  </router-link>
                  <span class="ml-10 mr-10">到</span>
                  <router-link
                    :to="{
                      name: 'explorerAddress',
                      params: {
                        address: '0xba2ad566f880a1796bdedc256dc8da25bb484baf',
                      },
                    }"
                  >
                    <short-hash :hash="'0xba2ad566f880a1796bdedc256dc8da25bb484baf'"></short-hash>
                  </router-link>
                  <span class="ml-10 mr-10">转 <span class="f-b">ERC-721 TokenID [6]</span></span>
                  <router-link
                    :to="{
                      name: 'explorerTx',
                      params: {
                        txHash: '0xba2ad566f880a1796bdedc256dc8da25bb484baf',
                      },
                    }"
                  >
                    <short-hash :hash="'0xba2ad566f880a1796bdedc256dc8da25bb484baf'"></short-hash>
                  </router-link></div
              ></span>
            </li>
            <li><divider /></li>
            <li>
              <span>数量:</span>
              <span>1 Ether</span>
            </li>
            <li>
              <span>交易费:</span>
              <span>10,051 Wei</span>
            </li>
            <li>
              <span>燃料价格:</span>
              <span>1 Wei</span>
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
              <span>20.25%</span>
            </li>
            <li><divider /></li>
            <li>
              <span>Nonce:</span>
              <span>123</span>
            </li>
            <li>
              <span>输入数据:</span>
              <span>
                <el-input
                  type="textarea"
                  :rows="5"
                  value="010101141497bd436691c00e9cf776b415029ac95488ce44f853c106757365724f70671724b474aa9328b28d3b60fd8b345e5a2615e2ca"
                  size="medium"
                  autocomplete="off"
                  readonly
                ></el-input
              ></span>
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
            <li>
              <span>名称：</span>
              <span>
                <code-highlight
                  code="Transfer (index_topic_1 address from, index_topic_2 address to, uint256 value)"
              /></span>
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
import Loading from '@dna2.0/utils/loading';
import { getTransaction, getAddress } from '../api';
import Divider from './Divider';
import CodeHighlight from './CodeHighlight';

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
      },
      loading: new Loading(),
    };
  },
  computed: {
    txHash() {
      return this.$route.params.txHash;
    },
  },
  watch: {
    txHash() {
      this.query();
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

      const addrInfo = await this.loading.run(async () => {
        return await getAddress({
          address: info.toAddress,
        });
      });

      const toAddressType = addrInfo ? addrInfo.type : 0;

      this.info = {
        ...info,
        toAddressType,
      };
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
</style>
