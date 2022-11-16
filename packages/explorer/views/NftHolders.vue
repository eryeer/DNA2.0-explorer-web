<template>
  <div class="bg-white p-20" v-loading="loading.value">
    <el-table :data="list" style="width: 100%">
      <el-table-column label="排名" prop="rank" width="60"></el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">
          <router-link
            :to="{
              name: 'explorerAddress',
              params: {
                address: scope.row.accountAddress,
              },
            }"
          >
            {{ scope.row.accountAddress }}
          </router-link>
        </template>
      </el-table-column>
      >
      <el-table-column label="持有数量" width="120">
        <template slot-scope="scope">
          {{ scope.row.count | filterCount }}
        </template>
      </el-table-column>
      <el-table-column label="持有占比" width="140">
        <template slot-scope="scope">
          <div class="mb-5">
            {{ scope.row.percentage | filterPercentage }}
          </div>
          <el-progress :percentage="getPercentage(scope.row.percentage)" :show-text="false"></el-progress>
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
</template>

<script>
import Loading from '@dna2.0/utils/loading';
import { getTokenHolder } from '../api';
import { serialize, deserialize } from '@dna2.0/utils/convertors';

export default {
  name: 'NftTxs',
  components: {},
  data() {
    return {
      loading: new Loading(),
      params: {
        pageNumber: 1,
        pageSize: 10,
        contractAddress: this.$route.params.address,
      },
      total: 0,
      list: [],
    };
  },
  watch: {
    params: {
      handler() {
        this.query();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    async query() {
      const { responseAccountNFTHolderPageInfo: res } = await this.loading.run(async () => {
        return await getTokenHolder(this.params);
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
    getPercentage(val) {
      if(!val) return 0
      return val * 100
    }
  },
};
</script>
<style lang="scss" scoped>
.tag {
  font-size: 11px;
  font-weight: 600;
  transform: scale(0.866666);
  width: 36px;
  text-align: center;
  position: relative;
  right: -15px;
}

.flex {
  display: flex;
  justify-content: space-between;
}
</style>
