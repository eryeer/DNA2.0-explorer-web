<template>
  <div class="heading1">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Heading1',
};
</script>

<style lang="scss" scoped>
.heading1 {
  font-size: 18px;
  font-weight: 500;
  color: var(--color-primary);
  line-height: 25px;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
