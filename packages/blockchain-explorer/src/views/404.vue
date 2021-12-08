<template>
  <section class="box">
    <img src="@/assets/images/404.png" width="324" class="not-found" />
  </section>
</template>

<script>
export default {
  name: 'NotFound',
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;

  .not-found {
    margin: auto;
  }
}
</style>
