<template>
  <div class="box">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'Layout',
};
</script>

<style lang="scss" scoped>
.box {
  padding: 30px;
  min-width: 1024px;
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
}
</style>
