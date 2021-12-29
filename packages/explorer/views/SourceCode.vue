<template>
  <div class="editor-wrapper" style="width: 100%">
    <div class="info-bar">
      <span class="info-bar__file">
        <img src="@/assets/images/contract.png" height="14" class="contract-icon mr-5" />
        合约ABI</span
      >
      <span class="info-bar__btn">
        <copyable :raw="showCode" :size="22"></copyable>
        <el-tooltip content="格式化ABI" placement="bottom">
          <svg-icon icon-class="formatter" class="f-20 c-p" @click="formatter" />
        </el-tooltip>
        <el-tooltip v-if="canToggleFullscreen" content="切换全屏" placement="bottom">
                    <svg-icon icon-class="toggle" class="f-17 c-p" @click="toggleFullscreen" />

    
        </el-tooltip>
      </span>
    </div>
    <prism-editor
      class="editor"
      v-model="showCode"
      :highlight="highlighter"
      :style="{ height: `${editorHeight}px` }"
      :line-numbers="showAsFormatter"
      readonly
      ref="editor"
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
  data() {
    return {
      editorHeight: DEFAULT_HEIGHT,
      canToggleFullscreen: true,
      showAsFormatter: false,
      showCode: this.code,
    };
  },
  watch: {
    code: {
      handler(val) {
        this.showCode = val;
      },
    },
    showCode: {
      handler() {
        this.$nextTick(this.adjustEditorHeight);
      },
    },
  },
  methods: {
    highlighter(code) {
      return highlight(code, languages[this.lang]);
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
    formatter() {
      if (!this.showAsFormatter) {
        try {
          this.showCode = JSON.stringify(JSON.parse(this.code), null, 2);
        } catch (error) {}
      } else {
        this.showCode = this.code;
      }
      this.showAsFormatter = !this.showAsFormatter;
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
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;

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
  display: flex;
  align-items: center;
  gap: 10px;
}

.contract-icon {
  vertical-align: -2px;
}
</style>
