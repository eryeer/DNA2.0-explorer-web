<template>
  <span>
    <el-tooltip v-if="hash.length > 12" :content="hash" placement="top">
      <span>{{ hash | filterAddress }}</span>
    </el-tooltip>
    <template v-else>
      {{ hash }}
    </template>
  </span>
</template>

<script>
export default {
  name: 'ShortHash',
  props: {
    hash: {
      type: String,
      require: true,
    },
  },
  filters: {
    filterAddress(val) {
      if (val.length <= 12) {
        return val;
      }
      return `${val.substr(0, 6)}...${val.substr(val.length - 6, 6)}`;
    },
  },
};
</script>
