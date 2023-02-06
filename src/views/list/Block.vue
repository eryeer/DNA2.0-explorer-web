<template>
  <div class="box">
    <heading-2 v-if="$route.name === 'blocks'" class="mt-60">区块列表</heading-2>
    <div class="bg-white p-20" v-loading="loading.value">
      <el-table :data="list" style="width: 100%">
        <el-table-column label="区块高度">
          <template slot-scope="scope">
            <div class="white tb-link">
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
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="txCount" label="交易数量">
          <template slot-scope="scope">
            <div>
              {{ scope.row.txCount | filterCount }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="blockSize" label="区块大小">
          <template slot-scope="scope">
            <div>
              {{ scope.row.blockSize | filterByteSize }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="miner" label="记账地址" width="400"> </el-table-column>
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
import { getBlockList } from '@/api/explorer';
import { serialize, deserialize } from '@/utils/convertors';

export default {
  name: 'Blocks',
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
  },
  watch: {
    serializedParams(value) {
      this.$router.replace({ query: { ...this.$route.query, q: value } });
    },
  },
  methods: {
    async query() {
      const res = await this.loading.run(async () => {
        return getBlockList(this.params);
      });
      this.list = res.list || [];
      this.total = res.total;
    },
    handleCurrentChange(pageNumber) {
      this.params.pageNumber = pageNumber;
    },
    handlePageSizeChange(pageSize) {
      this.params.pageNumber = 1;
      this.params.pageSize = pageSize;
    },
  },
  created() {
    this.query();
  },
};
</script>
<style lang="scss" scoped>
.mt-60 {
  margin-top: 60 !important;
}
</style>
