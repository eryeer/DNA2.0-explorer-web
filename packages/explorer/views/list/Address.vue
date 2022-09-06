<template>
  <div class="box">
    <heading-2 v-if="$route.name === 'addresses'" >地址列表</heading-2>
    <div class="bg-white p-20"  v-loading="loading.value">
      <el-table :data="list" style="width: 100%">
        <el-table-column label="地址" width="400">
          <template slot-scope="scope">
            <div class="white tb-link">
              <router-link
                :to="{
                  name: 'explorerAddress',
                  params: {
                    address: scope.row.address,
                  },
                }"
              >
                {{ scope.row.address }}
              </router-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="地址类型">
          <template slot-scope="scope">
            {{ scope.row.type === 0 ? '用户' : '合约' }}
          </template>
        </el-table-column>
        <el-table-column prop="txCount" label="交易数量">
          <template slot-scope="scope">
            <div>
              {{ scope.row.txCount | filterCount }}
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
import Loading from '@dna2.0/utils/loading';
import { getAddressList } from '../../api';
import { serialize, deserialize } from '@dna2.0/utils/convertors';

export default {
  name: 'Addresses',
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
    params: {
      handler() {
        this.query();
      },
      immediate: true,
      deep: true,
    },
    serializedParams(value) {
      this.$router.replace({ query: { ...this.$route.query, q: value } });
    },
  },
  methods: {
    async query() {
      const res = await this.loading.run(async () => {
        return getAddressList(this.params);
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
};
</script>
<style lang="scss" scoped></style>
