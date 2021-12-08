<template>
  <div class="box">
    <div class="title">{{ title }}</div>
    <div class="content"><slot></slot></div>
  </div>
</template>

<script>
export default {
  name: 'DetailPage',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  .title {
    font-size: 18px;
    font-weight: 500;
    color: var(--color-primary);
    line-height: 25px;
    margin-bottom: 20px;
  }

  .content {
    padding: 40px;
    background-color: #fff;
  }
}
</style>
