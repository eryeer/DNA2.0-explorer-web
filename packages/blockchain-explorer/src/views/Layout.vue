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
}
</style>
