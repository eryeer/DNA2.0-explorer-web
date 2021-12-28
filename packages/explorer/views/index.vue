<template>
  <section>
    <div class="search-bar-wrapper">
      <div class="search-bar m-u">
        <router-link to="/" class="h2" tag="h2"> 区块链浏览器 </router-link>
        <div>
          <el-input
            class="search-input mr-10"
            placeholder="输入地址/交易哈希/区块高度"
            prefix-icon="el-icon-search"
            @keyup.enter.native="toSearch"
            v-model="searchContent"
            style="width: 550px"
            clearable
          ></el-input>
          <el-button type="primary" @click="toSearch">搜索</el-button>
        </div>
      </div>
    </div>
    <ul class="info-list bg-white p-40 mb-20 m-u" v-loading="loading.value">
      <li>
        <span>区块高度</span>
        <span> {{ info.blockNumber | filterCount }} </span>
      </li>
      <li>
        <span>交易总数</span>
        <span> {{ info.txCount | filterCount }} </span>
      </li>
      <li>
        <span>正常/节点数</span>
        <span> {{ info.activeCount }}/{{ info.nodeCount }} </span>
      </li>
      <li>
        <span>网络状态</span>
        <span> {{ info.netStatus ? '正常' : '异常' }} </span>
      </li>
    </ul>
    <div class="m-u">
      <router-view :key="$route.fullPath" />
    </div>
  </section>
</template>

<script>
import { isHexString } from '@dna2.0/utils';
import { getBlock, getAddress, getTransaction } from '../api';
import { getTotalSummary } from '@/api/summary';
import Loading from '@dna2.0/utils/loading';

export default {
  name: 'explorer',
  data() {
    return {
      searchContent: '',
      loading: new Loading(),
      info: {},
    };
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
    async getTotalSummary() {
      try {
        this.info = await getTotalSummary();
      } finally {
        this.timer = setTimeout(this.getTotalSummary.bind(this), 10 * 1000);
      }
    },
  },
  mounted() {
    this.timer = null;
    this.loading.run(async () => {
      await this.getTotalSummary();
    });
    this.$once('hook:beforeDestroy', () => {
      if (this.timer !== null) {
        clearTimeout(this.timer);
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.search-bar-wrapper {
  box-shadow: 0px 1px 10px rgba(6, 8, 69, 0.06);
  background-color: #fff;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  height: 100px;

  .h2 {
    font-family: PingFang SC;
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 34px;
    cursor: pointer;
  }

  ::v-deep {
    .el-input__inner {
      height: 40px;
      line-height: 40px;
      border-color: #999999;
      background-color: white;

      &:focus {
        border-color: var(--color-primary);
        box-shadow: rgb(230 240 255) 0px 0px 0px 4px;
      }
    }
    .el-input__icon {
      font-size: 16px;
    }
    .el-button {
      padding-top: 11px;
      padding-bottom: 11px;
      width: 80px;
      font-size: 16px;
    }
  }
}

.info-list {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  height: 125px;

  > li {
    width: 25%;
    display: flex;
    flex-direction: column;

    > span:first-child {
      font-size: 12px;
      opacity: 0.6;
      margin-bottom: 10px;
    }
    > span:last-child {
      font-size: 20px;
      font-family: DINPro-Medium, DINPro;
    }
  }
}

.m-u {
  width: 1280px;
  margin-left: auto;
  margin-right: auto;
}
</style>
