<template>
  <span> {{ balance }} Gwei </span>
</template>

<script>
import { getBalance } from './utils';

export default {
  name: 'Balance',
  data() {
    return {
      balance: '0',
    };
  },
  props: {
    address: {
      type: String,
      required: true,
    },
  },
  watch: {
    address: {
      async handler(value) {
        if (!value) return;
        let result = await getBalance(value);
        this.balance = result * Math.pow(10, 9);
      },
      immediate: true,
    },
  },
};
</script>
<style lang="scss" scoped></style>
