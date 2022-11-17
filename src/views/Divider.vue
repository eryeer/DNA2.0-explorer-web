<template>
  <div class="divider" />
</template>

<script>
export default {
  name: 'Divider',
  props: {
    theme: {
      type: String,
      default: 'regular',
      validator(value) {
        return ['regular', 'light'].includes(value);
      },
    },
    direction: {
      type: String,
      default: 'horizontal',
      validator(value) {
        return ['horizontal', 'vertical'].includes(value);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.divider {
  background-color: #eeeeee;
  width: 100%;
  height: 1px;
  margin-left: -10px;
  margin-right: -10px;
}
</style>
