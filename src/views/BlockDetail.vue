<template>
  <div class="box">
    <heading-2 with-go-back>区块详情</heading-2>
    <div class="info-bar f-16 pl-30 mb-20">
      <span class="mr-10">区块</span>
      <router-link
        :to="{
          name: 'explorerBlock',
          params: {
            blockHeight: info.blockNumber,
          },
        }"
      >
        <copyable :raw="info.blockNumber">{{ info.blockNumber | filterCount }}</copyable>
      </router-link>
    </div>
    <div class="bg-white p-40 col-2">
      <ol class="list">
        <li>
          <span>生成时间:</span>
          <span>{{ info.blockTime | filterDate }}</span>
        </li>
        <li>
          <span>区块高度:</span>
          <span>{{ info.blockNumber | filterCount }}</span>
        </li>
        <li>
          <span>当前区块哈希:</span>
          <span>{{ info.blockHash }}</span>
        </li>
        <li>
          <span>区块大小：</span>
          <span>{{ info.blockSize | filterByteSize }}</span>
        </li>
        <li>
          <span>状态根：</span>
          <span>{{ info.stateRoot }}</span>
        </li>
      </ol>
      <ol class="list">
        <li>
          <span>Nonce随机数:</span>
          <span>{{ info.nonce }}</span>
        </li>
        <li>
          <span>总消耗燃料:</span>
          <span>{{ info.gasUsed | filterCount }}</span>
        </li>
        <li>
          <span>总燃料上限：</span>
          <span>{{ info.gasLimit | filterCount }}</span>
        </li>
        <li>
          <span>记账人地址：</span>
          <span>{{ info.miner }}</span>
        </li>
        <li>
          <span>交易数量：</span>
          <span>{{ info.txCount | filterCount }}</span>
        </li>
      </ol>
    </div>
    <heading-2>区块内交易</heading-2>
    <txs :blockNumber="blockHeight"></txs>
  </div>
</template>
<script>
import Loading from '@/utils/loading';
import Txs from './list/Tx';
import { getBlock } from '@/api/explorer';

export default {
  name: 'explorerBlock',
  components: {
    Txs,
  },
  data() {
    return {
      loading: new Loading(),
      info: {},
    };
  },
  computed: {
    blockHeight() {
      return parseInt(this.$route.params.blockHeight);
    },
  },
  watch: {
    blockHeight() {
      this.query();
    },
  },
  methods: {
    async query() {
      const res = await this.loading.run(async () => {
        return await getBlock({
          blockNumber: this.blockHeight,
        });
      });
      this.info = res;
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
  background-color: #0078fa;
  color: #fff;
  > span {
    opacity: 0.6;
  }
  .copy-wrapper {
    color: #fff;
  }
}
.col-2 {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.list {
  width: 45%;
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
