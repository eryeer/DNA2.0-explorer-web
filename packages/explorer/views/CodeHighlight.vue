<template>
    <prism-editor
      class="editor"
      v-model="code"
      :highlight="highlighter"
      :line-numbers="false"
      readonly
    ></prism-editor>
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



export default {
    name: 'CodeHighlight',

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
      default: 'solidity',
    },
  },
  
  methods: {
    highlighter(code) {
      return highlight(code, languages[this.lang]);
    }
  },
};
</script>

<style lang="scss" scoped>
.editor {
  background-color: transparent;
  ::v-deep .prism-editor__textarea:focus {
    outline: none;
  }
}
</style>
