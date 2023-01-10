<template>
  <section class="box">
    <div class="search bg-white">
      <svg-icon icon-class="search" class="search-icon f-20 mr-5" />
      <el-input
        class="search-input"
        placeholder="输入地址/交易哈希/区块高度"
        @keyup.enter.native="toSearch"
        v-model="searchContent"
        clearable
      ></el-input>
      <el-button type="primary" @click="toSearch">搜索</el-button>
    </div>
    <div class="info-bar mt-60 mb-60">
      <ul class="info-list">
        <li class="bg-white">
          <img src="@/assets/images/block.png" width="60" height="60" />
          <div>
            <div class="info-title">区块高度</div>
            <div class="info-val">
              <count-to
                :start-val="parseInt(preInfo.blockNumber)"
                :end-val="parseInt(info.blockNumber)"
                :duration="2600"
              />
            </div>
          </div>
        </li>
        <li class="bg-white">
          <img src="@/assets/images/tx.png" width="60" height="60" />
          <div>
            <div class="info-title">交易总数</div>
            <div class="info-val">
              <count-to
                :start-val="parseInt(preInfo.txCount)"
                :end-val="parseInt(info.txCount)"
                :duration="2600"
              />
            </div>
          </div>
        </li>
        <li class="bg-white">
          <img src="@/assets/images/address.png" width="60" height="60" />
          <div>
            <div class="info-title">地址总数</div>
            <div class="info-val">
              <count-to
                :start-val="parseInt(preInfo.addressCount)"
                :end-val="parseInt(info.addressCount)"
                :duration="2600"
              />
            </div>
          </div>
        </li>
        <li class="bg-white">
          <img src="@/assets/images/net.png" width="60" height="60" />
          <div>
            <div class="info-title">正常/节点数</div>
            <div class="info-val">
              {{ info.activeCount }}/{{ info.nodeCount }}
              <span
                class="net-status"
                :class="{
                  'net-status--normal': info.netStatus,
                  'net-status--abnormal': !info.netStatus,
                }"
                >（网络状态：{{ info.netStatus ? '正常' : '异常' }}）</span
              >
            </div>
          </div>
        </li>
      </ul>
      <div class="chart bg-white">
        <div class="chart-item chart-item-line">
          <div class="chart-label">
            <div class="chart-tabs">
              <span
                class="btn"
                :class="{ 'btn-actived': txCountType === 1 }"
                @click="toggleTxCount(1)"
                >日交易量</span
              >
              <span
                class="btn"
                :class="{ 'btn-actived': txCountType === 0 }"
                @click="toggleTxCount(0)"
                >月交易量</span
              >
            </div>
          </div>
          <line-chart :label="txCountLabel" :data-source="txCountData"></line-chart>
        </div>
      </div>
    </div>
    <div class="main-content">
      <div class="bg-white blocks">
        <div class="main-content-hd">
          <span class="f-18">最新区块 <loader v-if="loading.value" /></span>
          <span class="more">
            <router-link
              class="f-12"
              :to="{
                name: 'blocks',
              }"
            >
              更多
              <svg-icon icon-class="arrow" class="arrow" />
            </router-link>
          </span>
        </div>
        <div class="main-content-bd">
          <ul>
            <li v-for="item in blocks" :key="item.blockNumber">
              <span class="main-content-flag">Bk</span>
              <router-link
                :to="{
                  name: 'explorerBlock',
                  params: {
                    blockHeight: item.blockNumber,
                  },
                }"
              >
                {{ item.blockNumber | filterCount }}
              </router-link>
              <span>
                由
                <router-link
                  :to="{
                    name: 'explorerAddress',
                    params: {
                      address: item.miner,
                    },
                  }"
                >
                  <short-hash :hash="item.miner"></short-hash>
                </router-link>
                记账{{ item.txCount }}笔交易
              </span>
              <span class="time">
                {{ item.blockTime | filterDate }}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="bg-white txs">
        <div class="main-content-hd">
          <span class="f-18">最新交易 <loader v-if="loading.value" /></span>
          <span class="more">
            <router-link
              class="f-12"
              :to="{
                name: 'txs',
              }"
            >
              更多
              <svg-icon icon-class="arrow" class="arrow" />
            </router-link>
          </span>
        </div>
        <div class="main-content-bd">
          <ul>
            <li v-for="item in txs" :key="item.txHash">
              <span class="main-content-flag">Tx</span>
              <router-link
                :to="{
                  name: 'explorerTx',
                  params: {
                    txHash: item.txHash,
                  },
                }"
              >
                <short-hash :hash="item.txHash"></short-hash>
              </router-link>
              <span>
                {{ item.toAddress ? '从' : '由' }}
                <router-link
                  :to="{
                    name: 'explorerAddress',
                    params: {
                      address: item.fromAddress,
                    },
                  }"
                >
                  <short-hash :hash="item.fromAddress"></short-hash>
                </router-link>
                <br />
                <template v-if="item.toAddress">
                  到
                  <router-link
                    :to="{
                      name: 'explorerAddress',
                      params: {
                        address: item.toAddress,
                      },
                    }"
                  >
                    <short-hash :hash="item.toAddress"></short-hash> </router-link
                ></template>
                <template v-else>
                  创建合约
                  <router-link
                    :to="{
                      name: 'explorerAddress',
                      params: {
                        address: item.contractAddress,
                      },
                    }"
                  >
                    <short-hash :hash="item.contractAddress"></short-hash>
                  </router-link>
                </template>
              </span>
              <span class="time">
                {{ item.blockTime | filterDate }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import CountTo from 'vue-count-to';
import Loading from '@/utils/loading';
import { isHexString } from '@/utils';
import { getTotalSummary, getTransactionSummary } from '@/api/summary';
import {
  getBlock,
  getAddress,
  getTransaction,
  getBlockList,
  getTransactionList,
} from '@/api/explorer';
import LineChart from '../charts/LineChart';

export default {
  name: 'home',
  components: {
    CountTo,
    LineChart,
  },
  data() {
    return {
      loading: new Loading(),
      info: {
        blockNumber: 0,
        txCount: 0,
        nodeCount: 0,
        activeCount: 0,
        addressCount: 0,
        netStatus: true,
      },
      preInfo: {
        blockNumber: 0,
        txCount: 0,
        nodeCount: 0,
        activeCount: 0,
        addressCount: 0,
        netStatus: true,
      },
      txs: [],
      blocks: [],
      txCountByMonth: [],
      txCountByDay: [],
      txCountType: 1,
      searchContent: '',
    };
  },
  computed: {
    txCountData() {
      return this.txCountType === 0 ? this.txCountByMonth : this.txCountByDay;
    },
    txCountLabel() {
      return this.txCountType === 0 ? '月交易量' : '日交易量';
    },
  },
  methods: {
    async toSearch() {
      const content = this.searchContent.trim();
      const len = content.length;

      if (len === 0) {
        return;
      }

      /* block height */
      if (len <= 11 && /^\d+$/.test(content)) {
        const res = await getBlock({
          blockNumber: content,
        });
        if (res) {
          this.$router.push({
            name: 'explorerBlock',
            params: { blockHeight: content },
          });
          return;
        }
      }
      if (isHexString(content)) {
        /* address */
        if (len === 42) {
          const res = await getAddress({
            address: content,
          });
          if (res) {
            this.$router.push({
              name: 'explorerAddress',
              params: { address: content },
            });
            return;
          }
        }

        /* txhash */
        if (len === 66) {
          try {
            const res = await getTransaction({
              txHash: content,
            });
            if (res) {
              this.$router.push({
                name: 'explorerTx',
                params: { txHash: content },
              });
              return;
            }
          } catch (error) {
            this.$message.error('对不起，您的搜索不匹配任何记录');
            return;
          }
        }
      }
      this.$message.error('对不起，您的搜索不匹配任何记录');
    },
    async getData() {
      this.loading.run(async () => {
        try {
          this.preInfo = this.info;
          const [info, txs, blocks] = await Promise.all([
            getTotalSummary(),
            getTransactionList({
              pageNumber: 1,
              pageSize: 10,
            }),
            getBlockList({
              pageNumber: 1,
              pageSize: 10,
            }),
          ]);
          this.info = info;
          this.txs = txs.list;
          this.blocks = blocks.list;
        } finally {
          await new Promise((r) => setTimeout(r, 500));
          this.timer = setTimeout(this.getData.bind(this), 30 * 1000);
        }
      });
    },
    toggleTxCount(type) {
      if (this.txCountType !== type) {
        this.txCountType = type;
      }
    },
    async getTxCount() {
      const txCount = await getTransactionSummary({ limit: 30 });

      this.txCountByMonth = txCount.monthlySummary
        .reverse()
        .slice(0, 12)
        .map((item) => {
          return {
            value: item.summaryCount,
            time: item.summaryTime,
          };
        });
      this.txCountByDay = txCount.dailySummary.reverse().map((item) => {
        return {
          value: item.summaryCount,
          time: item.summaryTime,
        };
      });
    },
  },
  created() {
    this.timer = null;
    this.getData();
    this.getTxCount();
    this.$once('hook:beforeDestroy', () => {
      if (this.timer !== null) {
        clearTimeout(this.timer);
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.search {
  height: 80px;
  background-color: white;
  display: flex;
  align-items: center;
  padding: 16px 20px;
  margin-bottom: 60px;

  ::v-deep {
    .el-input__inner {
      background-color: white;
      border: none;
      color: rgba(0, 0, 0, 0.6);
      font-size: 16px;
    }
    .el-input__icon {
      font-size: 16px;
    }
    .el-button {
      width: 148px;
      height: 48px;
      font-size: 18px;
      line-height: 48px;
      color: #ffffff;
      text-align: center;
      border-radius: 4px;
      padding: 0;
    }
  }
}

.info-bar {
  display: flex;
  column-gap: 40px;
  margin-block: 60px;

  .info-list,
  .chart {
    width: 50%;
    height: 220px;
  }

  .info-list {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-direction: row;
    flex-wrap: wrap;

    > Li {
      display: flex;
      align-items: center;
      column-gap: 20px;
      padding: 20px;
      width: 300px;
    }
  }

  .info-title {
    opacity: 0.6;
    margin-bottom: 4px;
  }
  .info-val {
    font-family: 'DINPro-Medium';
    font-size: 28px;
    line-height: 36px;
  }
}

.main-content {
  display: flex;
  column-gap: 40px;

  .blocks,
  .txs {
    width: 50%;
    padding: 30px 30px 0;
    min-height: 300px;
  }

  .main-content-flag {
    width: 40px;
    height: 40px;
    background: #f2f2f2;
    border-radius: 20px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .main-content-hd {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .arrow {
      width: 10px;
      height: 10px;
      vertical-align: 0;
      transition: all 0.3s;
    }
    .more:hover .arrow {
      transform: translateX(5px);
    }
  }

  .blocks {
    .main-content-flag {
      border-radius: 8px;
    }
    .main-content-bd li {
      :nth-child(2) {
        width: 100px;
      }
    }
  }

  .main-content-bd li {
    &:not(:last-child) {
      border-bottom: 1px solid #f2f2f2;
    }
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 5px;
    padding-right: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: 20px;
    color: rgba(3, 3, 3, 0.6);

    &:hover {
      background-color: #f5f7fa;
    }

    :nth-child(1) {
      width: 40px;
    }
    :nth-child(2) {
      width: 120px;
    }

    :nth-child(3) {
      flex: 1;
      line-height: 18px;
    }

    .time {
      color: rgba(0, 0, 0, 0.3);
      font-size: 12px;
    }
  }
}

.chart {
  overflow: hidden;

  &-item {
    background: #ffffff;
    box-shadow: 0px 10px 20px 0px rgba(137, 152, 172, 0.06);
    border-radius: 8px;
    padding: 30px;
    &-line {
      height: 258px;
    }
    &-bar {
      height: 536px;
    }
  }

  &-label {
    font-weight: 500;
    font-size: 16px;
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: -12px;
  }

  .btn {
    width: 80px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    background-color: rgba($color: #000000, $alpha: 0.05);
    border-radius: 15px;
    margin-left: 10px;
    font-size: 12px;
    font-weight: 400;
    color: #3b4859;
    display: inline-block;
    cursor: pointer;

    &-actived {
      background-color: var(--color-primary);
      color: #fff;
      cursor: default;
    }
  }
}

.net-status {
  font-weight: 400;
  font-size: 12px;
  opacity: 0.6;

  &--normal {
    color: #2ab9a5;
  }

  &--abnormal {
    color: #ff0000;
  }
}
</style>
