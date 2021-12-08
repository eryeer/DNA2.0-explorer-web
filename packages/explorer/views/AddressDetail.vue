<template>
  <div class="box" v-loading="loading.value">
    <heading-2 with-go-back>地址详情</heading-2>
    <div class="info-bar f-16 pl-30 mb-20">
      <span class="mr-10">地址</span>
      <router-link
        :to="{
          name: 'explorerAddress',
          params: {
            address: address,
          },
        }"
      >
        <copyable>{{ address }}</copyable>
      </router-link>
    </div>
    <div class="bg-white p-40 col-2">
      <ol class="list">
        <li>
          <span>生成时间:</span>
          <span>{{ info.blockTime | filterDate }}</span>
        </li>
        <li>
          <span>地址类型:</span>
          <span> {{ info.type === 0 ? '用户' : '合约' }} </span>
        </li>
        <li>
          <span>交易数量:</span>
          <span>{{ info.txCount | filterCount }}</span>
        </li>
      </ol>
    </div>
    <heading-2>最新交易</heading-2>
    <txs :address="address"></txs>
  </div>
</template>
<script>
import Loading from '@dna2.0/utils/loading';
import Txs from './dashboard/Tx';
import { getAddress } from '../api';

export default {
  name: 'AddressDetail',
  components: {
    Txs,
  },
  data() {
    return {
      loading: new Loading(),
      info: {},
      list: [],
    };
  },
  computed: {
    address() {
      return this.$route.params.address;
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
        return await getAddress({
          address: this.address,
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
  background-color: rgba($color: #0078fa, $alpha: 0.04);
}

.list {
  > li {
    display: flex;
    > span:first-child {
      opacity: 0.6;
      min-width: 60px;
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
