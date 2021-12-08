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
              <span>状态：</span>
              <span>
                <el-tag :type="info.txStatus === '0x1' ? 'success' : 'danger'" size="mini">
                  {{ info.txStatus === '0x1' ? '成功' : '失败' }}
                </el-tag></span
              >
            </li>
            <li>
              <span>区块高度：</span>
              <span>{{ info.blockNumber | filterCount }}</span>
            </li>
            <li>
              <span>发起地址：</span>
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
              <span>接收地址：</span>
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
            <li>
              <span>消耗燃料：</span>
              <span>{{ info.gasUsed | filterCount }}</span>
            </li>
            <li>
              <span>燃料上限：</span>
              <span>{{ info.gasLimit | filterCount }}</span>
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

export default {
  name: 'TxDetail',
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

      const toAddressType = addrInfo ? addrInfo.type: 0;

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
      min-width: 90px;
      margin-right: 60px;
    }
    > span:last-child {
      word-break: break-all;
      padding-right: 20px;
    }
    &:not(:last-child) {
      margin-bottom: 30px;
    }
  }
}
</style>
