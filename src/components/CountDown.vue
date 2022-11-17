<template>
  <el-button v-bind="$attrs" v-on="listeners" :disabled="this.remaining !== 0" :loading="loading">
    {{ text }}
  </el-button>
</template>

<script>
export default {
  name: 'CountDown',
  inheritAttrs: false,
  props: {
    tip: {
      type: String,
    },
  },
  computed: {
    text() {
      return this.remaining !== 0 ? `${this.remaining}s` : this.tip;
    },
    listeners() {
      return {
        click: async () => {
          this.loading = true;
          try {
            await this.$listeners.click();
            this.remaining = 60;
          } finally {
            this.loading = false;
          }
        },
      };
    },
  },
  data() {
    return {
      remaining: 0,
      loading: false,
    };
  },
  watch: {
    remaining: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.remaining--;
          }, 1000);
        }
      },
      immediate: true,
    },
  },
};
</script>
