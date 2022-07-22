<template>
  <div class="heading2">
    <span @click="goBack" :class="{ 'with-go-back': withGoBack }">
      <svg-icon icon-class="back" class="btn" v-if="withGoBack" />
      <slot></slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Heading2',
  props: {
    withGoBack: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    goBack() {
      if (this.withGoBack) {
        this.$router.back(-1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.heading2 {
  margin-top: 60px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  font-family: 'PingFang SC';
  font-weight: 500;
  font-size: 24px;
}
.btn {
  margin-right: 15px;
  font-weight: 400;
}
.with-go-back {
  cursor: pointer;
  transition: opacity 0.5s;
  &:hover {
    opacity: 0.6;
  }
}
</style>
