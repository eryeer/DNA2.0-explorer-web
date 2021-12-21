<template>
  <div class="bg-white pt-40 pb-40 pl-20 pr-20" v-loading="loading.value">
    <el-table :data="list" style="width: 100%">
      <el-table-column label="交易哈希">
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
      <el-table-column label="状态" prop="txStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.txStatus === '0x1' ? 'success' : 'danger'" size="mini">
            {{ scope.row.txStatus === '0x1' ? '成功' : '失败' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="方法名" prop="methodName"> </el-table-column>
      <el-table-column label="区块高度">
        <template slot-scope="scope">
          <router-link
            :to="{
              name: 'explorerBlock',
              params: {
                blockHeight: scope.row.blockNumber,
              },
            }"
          >
            {{ scope.row.blockNumber | filterCount }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="发起地址">
        <template slot-scope="scope">
          <router-link
            :to="{
              name: 'explorerAddress',
              params: {
                address: scope.row.fromAddress,
              },
            }"
          >
            <short-hash :hash="scope.row.fromAddress"></short-hash>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="接收地址">
        <template slot-scope="scope">
          <el-tooltip content="合约" placement="top" v-if="true">
            <i class="el-icon-document mr-5"></i>
          </el-tooltip>
          <router-link
            :to="{
              name: 'explorerAddress',
              params: {
                address: scope.row.toAddress,
              },
            }"
          >
            <short-hash :hash="scope.row.toAddress"></short-hash>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="数量（Ether）" prop="gasAmount"> </el-table-column>
      <el-table-column label="消耗燃料（Wei）">
        <template slot-scope="scope">
          <div>
            {{ scope.row.gasUsed | filterCount }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="生成时间">
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
import { getTransactionList, getTransactionListByAddress } from '../../api';

export default {
  name: 'Txs',
  props: {
    blockNumber: {
      type: Number,
      default: -1,
    },
    address: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: new Loading(),
      params: {
        pageNumber: 1,
        pageSize: 10,
      },
      total: 0,
      list: [],
    };
  },
  methods: {
    async query() {
      const res = await this.loading.run(async () => {
        const params = this.params;
        if (this.address) {
          params.address = this.address;
          return getTransactionListByAddress(params);
        } else {
          if (this.blockNumber !== -1) {
            params.blockNumber = this.blockNumber;
          }
          return getTransactionList(params);
        }
      });
      this.list = res.list || [];
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
  created() {
    this.query();
  },
};
</script>
<style lang="scss" scoped></style>
