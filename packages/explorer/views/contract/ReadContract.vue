<template>
  <div class="box">
    <div class="op">
      <span><i class="el-icon-document"></i> 读取合约信息</span>
      <span>
        <a href="#" @click.prevent="toggleCollapse()">{{ toggleDisplayText }}</a
        >&nbsp;
        <a href="#" @click.prevent="reset()">[Reset]</a>
      </span>
    </div>
    <el-form label-position="top" size="small">
      <el-collapse accordion v-model="activeNames">
        <el-collapse-item
          v-for="(item, index) in fragments"
          :key="index"
          class="collapse-item"
          :name="index"
        >
          <span slot="title" class="title"> {{ index + 1 }}. {{ item.name }} </span>
          <div class="content">
            <div v-if="!item.inputs.length">
              <div v-if="item.outputs.length === 1">
                <div v-for="(output, index_ii) in item.outputs" :key="index_ii">
                  <router-link
                    v-if="output.type === 'address'"
                    :to="{
                      name: 'explorerAddress',
                      params: {
                        address: fragments[index].reponse[index_ii],
                      },
                    }"
                  >
                    {{ fragments[index].reponse[index_ii] }}
                  </router-link>
                  <span v-else>
                    {{ fragments[index].reponse[index_ii] }}
                  </span>
                  <i class="type">{{ output.type }}</i>
                </div>
              </div>
              <div v-else>
                <div>
                  <img src="@/assets/images/tree.svg" width="8" />&nbsp;
                  <span v-html="getOutputLabel(item.outputs)"></span>
                </div>
                <div v-for="(r, index_ii) in item.reponse" :key="'reponse2_' + index_ii">
                  <div>
                    <i class="el-icon-d-arrow-right c-primary f-b" />
                    <span class="f-b" v-if="item.outputs[index_ii].name"
                      >{{ item.outputs[index_ii].name }} </span
                    ><i>{{ item.outputs[index_ii].type }}</i> : {{ String(r) }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div v-for="(input, index_ii) in item.inputs" :key="'input_' + index_ii">
                <el-form-item :label="getInputLabel(input)">
                  <el-input
                    v-model.trim="fragments[index].params[index_ii]"
                    :placeholder="getInputLabel(input)"
                  />
                </el-form-item>
              </div>
              <div class="mt-10 mb-5">
                <el-button
                  size="mini"
                  plain
                  @click="query(item.name, index)"
                  v-loading="item.loading"
                  :disabled="item.loading"
                  >查询</el-button
                >
              </div>
              <div>
                <img src="@/assets/images/tree.svg" width="8" /> &nbsp;
                <span v-html="getOutputLabel(item.outputs)"></span>
              </div>
              <div class="mt-10" v-if="item.reponse.length">
                [
                <span class="f-b"
                  >{{ item.name }}({{ item.inputs.map((input) => input.type).join(',') }})</span
                >
                method Response ]
              </div>
              <div v-for="(r, index_ii) in item.reponse" :key="'reponse_' + index_ii">
                <div>
                  <i class="el-icon-d-arrow-right c-primary f-b" />
                  <span class="f-b" v-if="item.outputs[index_ii].name"
                    >{{ item.outputs[index_ii].name }} </span
                  ><i>{{ item.outputs[index_ii].type }}</i> : {{ r }}
                </div>
              </div>
              <div class="c-danger" v-if="item.error">
                {{ item.error }}
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </div>
</template>

<script>
import { getInterface, getContract } from './utils';

export default {
  name: 'ReadContract',
  data() {
    return {
      fragments: [],
      activeNames: [],
      indexMarker: [],
      contract: null,
    };
  },
  props: {
    contractInfo: {
      type: Object,
      required: true,
    },
  },
  computed: {
    toggleDisplayText() {
      return this.activeNames.length ? '[Collapse All]' : '[Expand All]';
    },
  },
  watch: {
    contractInfo: {
      async handler() {
        this.init();
      },
      immediate: true,
    },
  },
  methods: {
    async query(name, index) {
      this.fragments[index].loading = true;
      try {
        let params = this.fragments[index].params;
        params = params.map((p) => {
          try {
            return JSON.parse(p);
          } catch (error) {
            return p;
          }
        });
        const res = await this.contract[name](...params);
        this.fragments[index].reponse = [].concat(res);
        this.fragments[index].error = '';
      } catch (error) {
        this.fragments[index].reponse = [];
        this.fragments[index].error = error;
      } finally {
        this.fragments[index].loading = false;
      }
    },
    getInputLabel(input) {
      return `${input.name ? input.name : '<input>'} (${input.type})`;
    },
    getOutputLabel(outputs) {
      return outputs
        .map((output) => {
          return `${output.name ? output.name + ' ' : ''} <i style="opacity: .4">${
            output.type
          }</i>`;
        })
        .join(', ');
    },
    toggleCollapse() {
      if (!this.activeNames.length) {
        this.activeNames = [...Array(this.fragments.length).keys()];
      } else {
        this.activeNames = [];
      }
    },
    reset() {
      this.activeNames = [];
      this.fragments.forEach((f, i) => {
        f.params = f.params.map(() => '');
        f.error = '';
        if (!this.indexMarker.includes(i)) {
          f.reponse = [];
        }
        f.loading = false;
      });
    },
    async init() {
      this.contract = getContract(this.contractInfo);
      this.getInterface();
    },
    async readImmediately() {
      const requestQueue = this.fragments
        .filter((item, index) => {
          let hasInputs = item.inputs.length;
          if (!hasInputs) this.indexMarker.push(index);
          return !hasInputs;
        })
        .map((item) => this.contract[item.name]());
      const res = (await Promise.allSettled(requestQueue)).map((item) => item.value);
      let counter = 0;
      this.indexMarker.forEach((i) => {
        if (Array.isArray(res[counter])) {
          res[counter] = `[${res[counter].toString()}]`;
        }
        this.fragments[i].reponse = [].concat(res[counter]);
        counter++;
      });
    },
    async getInterface() {
      let { abi } = this.contractInfo;
      try {
        const { fragments } = getInterface(abi);
        this.fragments = fragments
          .filter(
            (f) =>
              f.type === 'function' &&
              (f.constant == true || f.stateMutability === 'view' || f.stateMutability === 'pure'),
          )
          .map((item) => {
            return {
              ...item,
              params: Array.from(new Array(item.inputs.length), () => ''),
              reponse: [],
              loading: false,
              error: '',
            };
          });
        this.readImmediately();
      } catch (error) {}
    },
  },
};
</script>
<style lang="scss" scoped>
.box {
  width: 100%;
  padding-left: 10px;
  padding-right: 10px;

  ::v-deep {
    .el-collapse-item__header {
      background-color: #f8f9fa;
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
      border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
      height: 35px;
      line-height: 35px;
      padding-left: 10px;
      padding-right: 10px;
    }
    .el-collapse-item__wrap {
      border-bottom: none;
    }
    .el-collapse-item__content {
      padding-bottom: 0;
    }
    .el-form-item--small.el-form-item {
      margin-bottom: 0;
    }
    .el-collapse {
      border-bottom: none;
    }
  }
}
.op {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  gap: 10px;
  padding-left: 10px;
  padding-right: 10px;
}
.collapse-item {
  margin-bottom: 15px;
}
.title {
  color: #343a40;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-size: 13px;
}
.content {
  padding: 13px;
}
.type {
  opacity: 0.4;
}
</style>
