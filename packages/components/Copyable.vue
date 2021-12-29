<template>
  <span class="copy-wrapper">
    <span><slot></slot></span>
    <template v-if="raw"
      ><span style="position: absolute; left: -99999px; top: -99999px">{{ raw }}</span></template
    >
    <span class="copy-btn" @click="copy()" @mouseenter="enter" @mouseleave="leave">
      <el-tooltip :content="tip" placement="top" manual v-model="visibility">
        <svg-icon icon-class="copy" :class="{ [`f-${size}`]: true }" />
      </el-tooltip>
    </span>
  </span>
</template>

<script>
import Clipboard from 'clipboard';

export default {
  name: 'Copyable',
  props: {
    raw: {
      type: [Number, String],
    },
    size: {
      type: Number,
      default: 18,
    },
  },
  data() {
    return {
      tip: '复制',
      visibility: false,
    };
  },
  methods: {
    enter() {
      if (this.copying) return;
      this.tip = '复制';
      this.visibility = true;
    },
    leave() {
      if (this.copying) return;
      this.visibility = false;
    },
    copy() {
      this.copying = true;
      const clipboard = new Clipboard('.copy-btn', {
        target: function (trigger) {
          return trigger.previousElementSibling;
        },
      });

      clipboard.on('success', function (e) {
        e.clearSelection();
      });
      this.tip = '复制成功';
      this.visibility = true;
      setTimeout(() => {
        this.visibility = false;
        this.copying = false;
      }, 2000);
    },
  },
};
</script>

<style lang="scss" scoped>
.copy-wrapper {
  display: flex;
  align-items: center;
}

.copy-btn {
  margin-left: 5px;
  cursor: pointer;
  img {
    width: 14px;
    transform: translateY(2px);
    cursor: pointer;
    transition: all ease 0.3s;
  }
  img:hover {
    opacity: 0.5;
    transition: all ease 0.3s;
  }
}
</style>
