<template>
  <div class="bg-white p-20" v-loading="loading.value">
    <el-table :data="list" style="width: 100%">
      <el-table-column label="交易哈希" width="160">
        <template slot-scope="scope">
          <router-link
            :to="{
              name: 'explorerTx',
              params: {
                txHash: scope.row.txHash,
              },
            }"
          >
            <short-hash :hash="scope.row.txHash"></short-hash>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="从" width="160">
        <template slot-scope="scope">
          <el-tooltip content="合约" placement="top" v-if="scope.row.fromType == 1">
            <img src="@/assets/images/contract.png" height="14" class="contract-icon mr-5" />
          </el-tooltip>
          <router-link
            :to="{
              name: 'explorerAddress',
              params: {
                address: scope.row.transferFrom,
              },
            }"
          >
            <short-hash :hash="scope.row.transferFrom"></short-hash>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="" width="60">
        <template slot-scope="scope">
          <el-tag
            type="success"
            effect="dark"
            size="mini"
            class="tag"
            v-if="$route.params.address === scope.row.toAddress"
          >
            IN
          </el-tag>
          <el-tag type="danger" effect="dark" size="mini" class="tag" v-else> OUT </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="转账到" width="160">
        <template slot-scope="scope">
          <el-tooltip content="合约" placement="top" v-if="scope.row.toType == 1">
            <img src="@/assets/images/contract.png" height="14" class="contract-icon mr-5" />
          </el-tooltip>
          <router-link
            :to="{
              name: 'explorerAddress',
              params: {
                address: scope.row.transferTo,
              },
            }"
          >
            <short-hash :hash="scope.row.transferTo"></short-hash>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="Token ID" prop="tokenId"></el-table-column>
      <el-table-column label="Token">
        <template slot-scope="scope">
          <router-link
            :to="{
              name: 'explorerAddress',
              params: {
                address: scope.row.contractAddress,
              },
            }"
          >
            <span v-if="scope.row.tokenName">
              {{ scope.row.tokenName }}(scope.row.tokenSymbol)
            </span>
            <short-hash :hash="scope.row.contractAddress" v-else></short-hash>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="生成时间" width="180">
        <template slot-scope="scope">
          <div>
            {{ scope.row.blockTime | filterDate }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="t-r mt-30">
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handlePageSizeChange"
        :current-page="params.pageNumber"
        :total="total"
        layout="total, sizes, prev, pager, next"
        :page-sizes="[10, 20, 50]"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Loading from '@dna2.0/utils/loading';
import { getTransferListByAddress } from '../api';

export default {
  name: 'NftTxs',
  props: {},
  data() {
    return {
      loading: new Loading(),
      params: {
        pageNumber: 1,
        pageSize: 10,
        address: this.$route.params.address,
      },
      total: 0,
      list: [],
    };
  },
  methods: {
    async query() {
      const res = await this.loading.run(async () => {
        return await getTransferListByAddress(this.params);
      });
      this.list = res.list;
      this.total = res.total;
    },
    handleCurrentChange(pageNumber) {
      this.params.pageNumber = pageNumber;
      this.query();
    },
    handlePageSizeChange(pageSize) {
      this.params.pageNumber = 1;
      this.params.pageSize = pageSize;
      this.query();
    },
  },
  mounted() {
    this.query();
  },
};
</script>
<style lang="scss" scoped>
.tag {
  font-size: 11px;
  font-weight: 600;
  transform: scale(.866666);
}
</style>
