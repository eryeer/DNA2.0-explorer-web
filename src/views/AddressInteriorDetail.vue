<template>
  <div class="box">
    <div class="bg-white p-20" v-loading="loading.value">
      <el-table :data="list" style="width: 100%">
        <el-table-column label="父交易哈希" width="200">
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
        <el-table-column label="状态" prop="txStatus" width="80">
          <template slot-scope="scope">
            <span :class="{ 'c-danger': scope.row.error !== '' }">
              {{ scope.row.error === '' ? '成功' : '失败' }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="区块高度" width="120">
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
        <el-table-column label="发起地址" width="240">
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
        <el-table-column label="接收地址" width="240">
          <template slot-scope="scope" v-if="scope.row.toAddress">
            <router-link
              :to="{
                name: 'explorerAddress',
                params: {
                  address: scope.row.toAddress,
                },
              }"
            >
              <span
                v-if="
                  scope.row.type.toLowerCase() !== 'create' &&
                  scope.row.type.toLowerCase() !== 'create2'
                "
              >
                <short-hash :hash="scope.row.toAddress" />
              </span>
              <span v-else>
                <el-tooltip content="创建合约" placement="top">
                  <img
                    src="@/assets/images/contract-icon.png"
                    alt=""
                    height="16"
                    class="contract-icon"
                  />
                </el-tooltip>
                Contract Creation
              </span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="数量（10⁹Gwei）" width="120">
          <template slot-scope="scope">
            <div>
              {{ gwei2ether(scope.row.value) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="生成时间" width="240">
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
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50]"
          :page-size="params.pageSize"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from '@/utils/loading';
import { getInternalTxListByAddress } from '@/api/explorer';
import { gwei2ether, getGasAmount } from '@/utils';

export default {
  name: 'AddressInteriorDetail',
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
        const params = this.params;
        return getInternalTxListByAddress(params);
      });
      this.list = res.list || [];
      this.total = res.total > 500000 ? 500000 : res.total;
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
