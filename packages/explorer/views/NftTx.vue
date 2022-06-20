<template>
  <div class="bg-white p-20" v-loading="loading.value">
    <el-tag type="danger" effect="dark" size="mini"> OUT </el-tag>
    <el-tag type="success" effect="dark"  size="mini"> IN </el-tag>
  </div>
</template>

<script>
import Loading from '@dna2.0/utils/loading';

export default {
  name: 'NftTxs',
  props: {},
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
    async query() {},
  },
};
</script>
<style lang="scss" scoped>

</style>
