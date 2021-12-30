<template>
  <section class="box">
    <el-tabs :value="activeName" @tab-click="tabChange">
      <el-tab-pane label="区块列表" name="Blocks"> </el-tab-pane>
      <el-tab-pane label="交易列表" name="Txs"> </el-tab-pane>
      <el-tab-pane label="地址列表" name="Addresses"> </el-tab-pane>
    </el-tabs>
    <i class="el-icon-refresh f-22 c-grey" title="刷新列表" @click="refreshList"></i>
    <component :is="activeName"></component>
  </section>
</template>

<script>
import { eventBus } from '@dna2.0/utils';
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
    refreshList() {
      eventBus.$emit('refreshList', this.activeName);
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  position: relative;
}

.el-icon-refresh {
  position: absolute;
  right: 15px;
  top: 10px;
  cursor: pointer;
  transition: 0.3s transform;

  &:hover {
    transform: rotate(90deg);
  }
}
</style>
