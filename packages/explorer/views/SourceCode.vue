<template>
  <div class="editor-wrapper" style="width: 100%">
    <div class="info-bar">
      <span class="info-bar__file">
        <img src="@/assets/images/contract.png" height="14" class="contract-icon mr-5" />
        合约ABI</span
      >
      <span class="info-bar__btn">
        <el-tooltip content="将源代码复制到剪贴板" placement="bottom">
          <img
            src="@/assets/images/copy.svg"
            width="14"
            height="14"
            @click="copy"
            class="copy-btn"
          />
        </el-tooltip>
        <el-tooltip v-if="canToggleFullscreen" content="切换全屏" placement="bottom">
          <img
            src="@/assets/images/expand_arrows.svg"
            width="13"
            height="14"
            @click="toggleFullscreen"
          />
        </el-tooltip>
      </span>
    </div>
    <prism-editor
      class="editor"
      v-model="code"
      :highlight="highlighter"
      :style="{ height: `${editorHeight}px` }"
      :line-numbers="showLineNumber"
      readonly
    ></prism-editor>
  </div>
</template>

<script>
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-solidity';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-coy.css'; // import syntax highlighting styles

import Clipboard from 'clipboard';

const DEFAULT_HEIGHT = 400;

export default {
  name: 'SourceCode',
  components: {
    PrismEditor,
  },
  props: {
    code: {
      type: String,
      default: '',
    },
    lang: {
      type: String,
      default: 'json',
    },
    showLineNumber: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    editorHeight: DEFAULT_HEIGHT,
    canToggleFullscreen: true,
  }),
  watch: {
    code: {
      handler() {
        setTimeout(this.adjustEditorHeight.bind(this));
      },
      immediate: true,
    },
  },
  methods: {
    highlighter(code) {
      return highlight(code, languages[this.lang]);
    },
    copy() {
      const self = this;

      const clipboard = new Clipboard('.copy-btn', {
        target: function () {
          return self.$editor;
        },
      });

      clipboard.on('success', function (e) {
        e.clearSelection();
      });
      this.$notify({
        message: '复制成功',
        type: 'success',
      });
    },
    toggleFullscreen() {
      this.editorHeight = this.editorHeight === DEFAULT_HEIGHT ? this.scrollHeight : DEFAULT_HEIGHT;
    },
    adjustEditorHeight() {
      this.$editor = this.$el.querySelector('.prism-editor__textarea');
      this.scrollHeight = this.$editor.scrollHeight + 40;
      this.canToggleFullscreen = this.scrollHeight > this.editorHeight;
      if (!this.canToggleFullscreen) {
        this.toggleFullscreen();
      } else {
        this.editorHeight = DEFAULT_HEIGHT;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.editor {
  background-color: #fafafa;
  font-size: 14px;
  line-height: 20px;
  padding: 20px;

  ::v-deep .prism-editor__textarea::selection {
    background: #e6e6e6;
  }
  ::v-deep .prism-editor__textarea:focus {
    outline: none;
  }
}

.copy-wrapper {
  display: flex;
  align-items: center;
}

.info-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.info-bar__file {
  font-size: 14px;
  opacity: 0.6;
}

.info-bar__btn {
  > img {
    margin-left: 10px;
    width: 14px;
    transform: translateY(2px);
    cursor: pointer;
    transition: all ease 0.3s;
  }
  > img:hover {
    opacity: 0.5;
    transition: all ease 0.3s;
  }
}

.contract-icon {
  vertical-align: -2px;
}
</style>
