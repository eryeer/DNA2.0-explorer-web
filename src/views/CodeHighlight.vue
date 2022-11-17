<template>
  <div v-html="showCode" class="box"></div>
</template>

<script>
export default {
  name: 'CodeHighlight',

  props: {
    code: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showCode: '',
    };
  },
  watch: {
    code: {
      handler(val) {
        this.genShowCode(val);
      },
      immediate: true,
    },
  },
  methods: {
    genShowCode(code) {
      if (!code) return;
      const left_paren_pos = code.indexOf('(');
      const right_paren_pos = code.indexOf(')');
      const fun_body = code.slice(left_paren_pos + 1, right_paren_pos);
      const params = fun_body.split(',').map((item) => item.trim());

      const paramsHighlight = [];
      for (let i = 0; i < params.length; i++) {
        const p = params[i].split(/\s+/);
        const tmp = [];
        tmp.push(`<span style="color:#00c9a7" >${p[p.length - 2]}</span>
`);

        tmp.push(`<span style="color:#de4437" >${p[p.length - 1]}</span>
`);
        if (p.length > 2) {
          tmp.unshift(`<span>${p[0]}</span>
`);
        }
        paramsHighlight.push(tmp.join(' ').trimRight());
      }
      const res = [
        `<span style="color:#0078fa" >${code.slice(0, left_paren_pos)}</span>
`,
        '(',
        paramsHighlight.join(', '),
        ')',
      ];

      this.showCode = res.join('');
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
}
</style>
