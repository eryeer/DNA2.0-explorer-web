<template>
  <div class="box">
    <heading-2 v-if="ifTopLevel">交易列表</heading-2>
    <div class="bg-white p-20" v-loading="loading.value">
      <el-table :data="list" style="width: 100%">
        <el-table-column label="交易哈希" width="150">
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
        <el-table-column label="状态" prop="txStatus" width="60">
          <template slot-scope="scope">
            <span :class="{ 'c-danger': scope.row.txStatus !== '0x1' }">
              {{ scope.row.txStatus === '0x1' ? '成功' : '失败' }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="方法名" prop="method"></el-table-column>
        <el-table-column label="区块高度" width="100">
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
        <el-table-column label="发起地址" width="150">
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
        <el-table-column label="接收地址" width="150">
          <template slot-scope="scope" v-if="scope.row.toAddress">
            <el-tooltip content="合约" placement="top" v-if="scope.row.toAddressType != 0">
              <img src="@/assets/images/contract.png" height="14" class="contract-icon mr-5" />
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
        <el-table-column label="数量（10⁹Gwei）" width="120">
          <template slot-scope="scope">
            <div>
              {{ gwei2ether(scope.row.txValue) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="交易费（Gwei）" width="120">
          <template slot-scope="scope">
            <div>
              {{ getGasAmount(scope.row.gasUsed, scope.row.gasPrice) }}
            </div>
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
      <div class="t-r mt-30" :class="{ flex: showExport }">
        <el-button type="primary" size="mini" @click="openExportDialog" v-if="showExport"
          >下载csv</el-button
        >
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handlePageSizeChange"
          :current-page="params.pageNumber"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50]"
          :page-size="params.pageSize"
        >
        </el-pagination>
      </div>
    </div>
    <export-dialog ref="dialog" />
  </div>
</template>

<script>
import Loading from '@/utils/loading';
import { getTransactionList, getTransactionListByAddress } from '@/api/explorer';
import { gwei2ether, getGasAmount } from '@/utils';
import { serialize, deserialize } from '@/utils/convertors';
import ExportDialog from '../ExportDialog';

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
    showExport: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ExportDialog,
  },
  data() {
    return {
      loading: new Loading(),
      params: {
        pageNumber: 1,
        pageSize: 10,
        ...deserialize(this.$route.query.q, null),
      },
      total: 0,
      list: [],
    };
  },
  computed: {
    serializedParams() {
      return serialize({ ...this.params });
    },
    ifTopLevel() {
      return this.$route.name === 'txs';
    },
  },
  watch: {
    serializedParams(value) {
      if (!this.ifTopLevel) return;
      this.$router.replace({ query: { ...this.$route.query, q: value } });
    },
    // params: {
    //   handler() {
    //     if (this.ifTopLevel) return;
    //     this.query();
    //   },
    //   immediate: true,
    //   deep: true,
    // },
  },
  methods: {
    openExportDialog() {
      this.$refs.dialog.open();
    },
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
      this.total = res.total > 500000 ? 500000 : res.total;
    },
    handleCurrentChange(pageNumber) {
      this.params.pageNumber = pageNumber;
      if (this.ifTopLevel) return;
      this.query();
    },
    handlePageSizeChange(pageSize) {
      this.params.pageNumber = 1;
      this.params.pageSize = pageSize;
      if (this.ifTopLevel) return;
      this.query();
    },
    gwei2ether(val) {
      return gwei2ether(val);
    },
    getGasAmount(gasUsed, gasPrice) {
      return getGasAmount(gasUsed, gasPrice);
    },
  },
  created() {
    this.query();
  },
};
</script>
<style lang="scss" scoped>
.contract-icon {
  vertical-align: -2px;
}

.flex {
  display: flex;
  justify-content: space-between;
}
</style>
