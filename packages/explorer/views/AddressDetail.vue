<template>
  <div class="box" v-loading="loading.value">
    <heading-2 with-go-back>地址详情</heading-2>
    <div class="info-bar f-16 pl-30 mb-20">
      <span class="mr-10">地址</span>
      <router-link
        :to="{
          name: 'explorerAddress',
          params: {
            address: address,
          },
        }"
      >
        <copyable>{{ address }}</copyable>
      </router-link>
    </div>
    <div class="bg-white p-40 col-2 mb-10">
      <ol class="list">
        <li>
          <span>生成时间:</span>
          <span>{{ info.blockTime | filterDate }}</span>
        </li>
        <li>
          <span>地址类型:</span>
          <span> {{ isContract ? '合约' : '用户' }} </span>
        </li>
        <li>
          <span>交易数量:</span>
          <span>{{ info.txCount | filterCount }}</span>
        </li>
      </ol>
      <ol class="list" v-if="isContract">
        <li>
          <span>合约创建者:</span>
          <span>
            <router-link
              :to="{
                name: 'explorerAddress',
                params: {
                  address: '0xba2ad566f880a1796bdedc256dc8da25bb484baf',
                },
              }"
            >
              <short-hash :hash="'0xba2ad566f880a1796bdedc256dc8da25bb484baf'"></short-hash>
            </router-link>
            <span class="ml-10 mr-10">于交易</span>
            <router-link
              :to="{
                name: 'explorerTx',
                params: {
                  txHash: '0xba2ad566f880a1796bdedc256dc8da25bb484baf',
                },
              }"
            >
              <short-hash :hash="'0xba2ad566f880a1796bdedc256dc8da25bb484baf'"></short-hash>
            </router-link>
            <span class="ml-10">中创建</span>
          </span>
        </li>
        <li>
          <span>Token标识:</span>
          <span>
            Binance-Peg BUSD Token (BUSD)
            <el-tag size="mini" effect="dark" class="ml-10">ERC-20</el-tag>
          </span>
        </li>
      </ol>
    </div>
    <el-tabs @tab-click="tabHandler">
      <el-tab-pane label="最新交易">
        <txs :address="address"></txs>
      </el-tab-pane>
      <el-tab-pane label="合约" v-if="isContract">
        <div class="un-upload bg-white p-30">
          <div class="mt-60 mt-60">该合约还未上传ABI文件，点击上传ABI文件</div>
          <div class="mt-30 mt-30">
            <el-button
              type="primary"
              @click="createContract.dialogVisible = true"
              class="common-btn"
              >上传</el-button
            >
          </div>
        </div>
        <div class="uploaded bg-white p-30">
          <source-code :code="sourceCode" />
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="createContract.dialogVisible" width="860px">
      <div slot="title">上传ABI文件</div>
      <div class="dialog-bd">
        <div class="app-form">
          <div class="f-12 mt-15 mb-15">请输入ABI对应的合约地址</div>
          <el-input
            v-model.trim="createContract.params.addr"
            type="text"
            size="medium"
            autocomplete="off"
            clearable
            class="create-btn"
            style="width: 400px"
          ></el-input>
          <div class="f-12 mt-15 mb-15">在下面粘贴ABI文件内容</div>
          <el-input
            v-model.trim="createContract.params.abi"
            type="textarea"
            :rows="20"
            placeholder="请ABI文件内容"
            size="medium"
            autocomplete="off"
            clearable
            class="create-btn"
          ></el-input>
          <div class="f-12 mt-15 mb-15">请输入上传口令</div>
          <el-input
            v-model.trim="createContract.params.pass"
            type="password"
            size="medium"
            autocomplete="off"
            clearable
            show-password
            class="create-btn"
            style="width: 400px"
          ></el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer mb-20 mt-40 t-c">
        <el-button
          type="primary"
          @click="createNewContract"
          class="common-btn"
          :disabled="createNewContractDisabled"
          >上传</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Loading from '@dna2.0/utils/loading';
import Txs from './dashboard/Tx';
import { getAddress } from '../api';
import SourceCode from './SourceCode.vue';

const mock = `[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdrawEther","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"unfreeze","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"freezeOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"freeze","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"decimalUnits","type":"uint8"},{"name":"tokenSymbol","type":"string"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Freeze","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Unfreeze","type":"event"}]
`;

export default {
  name: 'AddressDetail',
  components: {
    Txs,
    SourceCode,
  },
  data() {
    return {
      loading: new Loading(),
      info: {},
      list: [],
      sourceCode: '',
      createContract: {
        dialogVisible: false,
        params: {
          name: '',
          abi: '',
          pass: '',
        },
      },
    };
  },
  computed: {
    address() {
      return this.$route.params.address;
    },
    isContract() {
      return this.info.type === 1;
    },
      createNewContractDisabled() {
        const p = this.createContract.params
        return Object.keys(p).some((key) => !p[key]);
      },
  },
  watch: {
    blockHeight() {
      this.query();
    },
  },
  methods: {
    async query() {
      const res = await this.loading.run(async () => {
        return await getAddress({
          address: this.address,
        });
      });
      this.info = res;
    },
    tabHandler(tab) {
      this.sourceCode = tab.index === '1' ? mock : '';
    },
    createNewContract() {
      
    }
  },
  mounted() {
    this.query();
  },
};
</script>
<style lang="scss" scoped>
.info-bar {
  display: flex;
  height: 40px;
  line-height: 40px;
  background-color: rgba($color: #0078fa, $alpha: 0.04);
}

.col-2 {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.list {
  width: 45%;
  > li {
    display: flex;
    > span:first-child {
      opacity: 0.6;
      min-width: 90px;
      margin-right: 60px;
    }
    > span:last-child {
      word-break: break-all;
      padding-right: 20px;
    }
    &:not(:last-child) {
      margin-bottom: 30px;
    }
  }
}

.un-upload {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.create-btn {
  ::v-deep {
    .el-input__inner {
      height: 40px;
      line-height: 40px;
      border-color: rgba(0, 0, 0, 0.19);
      background-color: white;
      border-radius: 2px;

      &:focus {
        border-color: var(--color-primary);
        box-shadow: rgb(230 240 255) 0px 0px 0px 4px;
      }
    }
  }
}
</style>
