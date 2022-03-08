<template>
  <span> {{ balance }} Ether </span>
</template>

<script>
import { getBalance } from './utils';

export default {
  name: 'Balance',
  data() {
    return {
      balance: '0'
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
        this.balance =  await getBalance(value);
      },
      immediate: true,
    },
  },
};
</script>
<style lang="scss" scoped></style>
