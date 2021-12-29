<template>
  <section>
    <el-tabs :value="activeName" @tab-click="tabChange">
      <el-tab-pane label="区块列表" name="Blocks"> </el-tab-pane>
      <el-tab-pane label="交易列表" name="Txs"> </el-tab-pane>
      <el-tab-pane label="地址列表" name="Addresses"> </el-tab-pane>
    </el-tabs>
    <component :is="activeName"></component>
  </section>
</template>

<script>
import Blocks from './Block';
import Txs from './Tx';
import Addresses from './Address';

export default {
  name: 'explorerDashboard',
  components: {
    Blocks,
    Txs,
    Addresses,
  },
  data() {
    return {};
  },
  computed: {
    activeName() {
      let { type } = this.$route.params;
      if (!['blocks', 'txs', 'addresses'].includes(type)) {
        this.$router.push({
          name: 'notfound',
        });
      }
      return type.charAt(0).toUpperCase() + type.slice(1);
    },
  },
  methods: {
    tabChange({ name }) {
      this.$router.push({
        name: 'explorerDashboard',
        params: {
          type: name.toLowerCase(),
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
