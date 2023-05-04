<template>
  <div class="box">
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
    <div class="bg-white p-40 mb-10">
      <ol class="list">
        <li>
          <span>地址类型:</span>
          <span> {{ getType(info.type) }} </span>
        </li>
        <li v-if="info.type !== 2">
          <span>生成时间:</span>
          <span>{{ info.blockTime | filterDate }}</span>
        </li>
        <li v-if="isContract">
          <span>合约创建者:</span>
          <span>
            <router-link
              :to="{
                name: 'explorerAddress',
                params: {
                  address: info.creator,
                },
              }"
            >
              <short-hash :hash="info.creator"></short-hash>
            </router-link>
            <span class="ml-10 mr-10">于交易</span>
            <router-link
              :to="{
                name: 'explorerTx',
                params: {
                  txHash: info.createTxHash,
                },
              }"
            >
              <short-hash :hash="info.createTxHash"></short-hash>
            </router-link>
            <span class="ml-10">中创建</span>
          </span>
        </li>
        <li>
          <span>交易数量:</span>
          <span>{{ info.txCount | filterCount }}</span>
        </li>
        <li>
          <span>余额:</span>
          <span><balance :address="address"></balance></span>
        </li>
        <li v-if="isERC721">
          <span>数字藏品标识:</span>
          <span> {{ getTokenIdentifier(info.contractInfo) }} </span>
        </li>
        <li v-if="isERC721">
          <span>持有者数量:</span>
          <span> {{ info.tokenHolderSum | filterCount }} </span>
        </li>
      </ol>
    </div>
    <el-tabs v-model="params.activeName">
      <el-tab-pane label="最新交易" name="txs" lazy>
        <txs :address="address" :show-export="true"></txs>
      </el-tab-pane>
      <el-tab-pane label="内部交易" name="addressInteriorDetail" lazy>
        <AddressInteriorDetail :address="address" :show-export="true"></AddressInteriorDetail>
      </el-tab-pane>
      <el-tab-pane label="数字藏品交易" name="nft" lazy>
        <nft-txs :address="address"></nft-txs>
      </el-tab-pane>
      <el-tab-pane label="合约" v-if="isContract" name="contract" lazy>
        <div class="un-upload bg-white p-30">
          <template v-if="!abiHasUpload">
            <div class="mt-100">
              <img src="@/assets/images/abi_upload.png" width="64" />
            </div>
            <div class="mt-20 mb-20">该合约还未上传ABI文件，点击上传ABI文件</div>
            <div class="mb-100">
              <el-button
                type="primary"
                @click="createContract.dialogVisible = true"
                class="medium-btn w-100 f-14"
                >上传</el-button
              >
            </div>
          </template>
          <template v-else>
            <el-tabs
              :lazy="true"
              style="width: 100%"
              v-model="activeTabName"
              type="card"
              class="tabs"
            >
              <el-tab-pane label="ABI" name="abi">
                <div class="contract-card">
                  <source-code :code="sourceCode" />
                  <div class="mt-40">
                    <el-button
                      type="primary"
                      class="medium-btn w-140 f-14"
                      @click="createContract.dialogVisible = true"
                      >重新上传
                    </el-button>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="读合约" name="read">
                <div class="contract-card" v-if="activeTabName === 'read'">
                  <read-contract :contract-info="info.contractInfo" />
                </div>
              </el-tab-pane>
              <el-tab-pane label="写合约" name="write">
                <div class="contract-card">
                  <write-contract :contract-info="info.contractInfo" /></div
              ></el-tab-pane>
            </el-tabs>
          </template>
        </div>
      </el-tab-pane>
      <el-tab-pane label="持有者" v-if="isERC721" name="holders" lazy>
        <nft-holders :address="address"></nft-holders>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="createContract.dialogVisible" width="720px">
      <div slot="title">上传ABI</div>
      <div class="dialog-bd">
        <div class="app-form" @dragover.prevent @drop.prevent>
          <div class="op mt-20">
            <wallet></wallet>
            <a href="#" @click.prevent="reset()">[Reset]</a>
          </div>
          <el-form :model="createContract.params" :rules="rules" ref="form">
            <div class="f-14 mt-40 mb-15 c-grey">ABI对应的合约地址:</div>
            <div>{{ address }}</div>
            <div class="f-14 mt-40 mb-15 c-grey">合约创建者地址:</div>
            <div>{{ creator }}</div>
            <div class="f-14 mt-30 mb-10 c-grey">ABI文件内容:</div>
            <el-form-item prop="abi">
              <div @drop="drop">
                <el-input
                  v-model.trim="createContract.params.abi"
                  type="textarea"
                  :rows="10"
                  size="medium"
                  autocomplete="off"
                  class="create-btn"
                  placeholder="可粘贴ABI文件内容或拖拽ABI文件到此输入框"
                ></el-input>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer mb-20 mt-40 t-c">
        <el-button
          type="primary"
          @click="sign"
          style="width: 120px"
          class="common-btn"
          icon="el-icon-edit"
          :loading="signing"
          >签名</el-button
        >
        <el-button
          type="primary"
          @click="createNewContract"
          style="width: 120px"
          class="common-btn"
          icon="el-icon-upload"
          :loading="uploading"
          :disabled="!createContract.params.signature"
          >上传</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Loading from '@/utils/loading';
import Txs from './list/Tx';
import AddressInteriorDetail from './AddressInteriorDetail';
import NftTxs from './NftTx';
import NftHolders from './NftHolders';
import { getAddress, uploadAbi } from '@/api/explorer';
import SourceCode from './SourceCode.vue';
import { isValidAbi } from '@/utils';
import Balance from './contract/Balance';
import ReadContract from './contract/ReadContract';
import WriteContract from './contract/WriteContract';
import { ethers } from 'ethers';
// import { keccak256, hashTypedData } from './contract/utils';
import Wallet from './contract/Wallet';
import { networkStatus } from '@/utils/values';

export default {
  name: 'AddressDetail',
  components: {
    Txs,
    AddressInteriorDetail,
    NftTxs,
    NftHolders,
    SourceCode,
    Balance,
    ReadContract,
    WriteContract,
    Wallet,
  },
  data() {
    return {
      loading: new Loading(),
      info: {},
      list: [],
      sourceCode: '',
      uploading: false,
      signing: false,
      createContract: {
        dialogVisible: false,
        params: {
          abi: '',
          address: '',
          signature: '',
        },
      },
      rules: {
        abi: [
          {
            required: true,
            message: '请输入ABI',
            trigger: 'blur',
          },
          {
            validator: (rule, val, cb) => (isValidAbi(val) ? cb() : cb(new Error('ABI格式错误'))),
            trigger: 'blur',
          },
        ],
      },
      activeTabName: 'abi',
      params: {
        activeName: 'txs',
      },
    };
  },
  computed: {
    address() {
      return this.$route.params.address;
    },
    isContract() {
      return this.info.type == 1;
    },
    isERC721() {
      return !!this.info.contractInfo && this.info.contractInfo.contractType === 'ERC721';
    },
    abiHasUpload() {
      return !!this.info.contractInfo;
    },
    creator() {
      return this.info.creator;
    },
    account() {
      return this.$store.state.account;
    },
    unconnected() {
      return this.$store.state.networkStatus === networkStatus.UNCONNECTED;
    },
    connect_no_normal() {
      return this.$store.state.networkStatus !== networkStatus.CONNECT_NORMAL;
    },
  },
  methods: {
    getType(type) {
      const map = ['用户', '合约', '原生合约'];
      return map[type];
    },
    async query() {
      const res = await this.loading.run(async () => {
        return await getAddress({
          address: this.address,
        });
      });
      this.info = res;
      if (this.info.contractInfo) {
        this.createContract.params.address = this.info.contractInfo.address;
        this.createContract.params.abi = this.info.contractInfo.abi;
        this.sourceCode = this.info.contractInfo.abi;
      }
    },
    drop(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      const fr = new FileReader();
      fr.onload = () => {
        this.createContract.params.abi = fr.result;
      };
      fr.readAsText(files[0]);
    },
    reset() {
      this.$store.commit('reset');
    },
    async sign() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (this.unconnected) {
            this.$message({
              message: '请先连接到Web3!',
              type: 'error',
            });
            return;
          }

          if (this.account.toLowerCase() !== this.creator.toLowerCase()) {
            this.$message({
              message: '请切换到合约创建者地址！',
              type: 'error',
            });
            return;
          }

          try {
            const { keccak256, toUtf8Bytes, arrayify } = ethers.utils;
            this.signing = true;
            const digest = keccak256(toUtf8Bytes(this.createContract.params.abi));
            const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
            const signer = provider.getSigner();
            this.createContract.params.signature = await signer.signMessage(arrayify(digest));
          } finally {
            this.signing = false;
          }
        }
      });
    },
    createNewContract() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          try {
            this.uploading = true;
            await uploadAbi({
              ...this.createContract.params,
              address: this.address,
            });
            this.$notify({
              message: '上传成功',
              type: 'success',
            });
            this.createContract.dialogVisible = false;
            this.uploading = false;
            this.createContract.params.signature = '';
            this.query();
          } catch (error) {
            this.uploading = false;
            this.$message({
              message: error,
              type: 'error',
            });
          }
        }
      });
    },
    getTokenIdentifier(info) {
      if (!info.tokenName) {
        return '--';
      }
      return `${info.tokenName} (${info.tokenSymbol})`;
    },
  },
  created() {
    this.query();
  },
};
</script>
<style lang="scss" scoped>
.info-bar {
  display: flex;
  height: 40px;
  line-height: 40px;
  background-color: #5e72e4;
  color: #fff;
  > span {
    opacity: 0.6;
  }
  .copy-wrapper {
    color: #fff;
  }
}

.list {
  display: grid;
  grid-template-columns: 50% 50%;
  row-gap: 30px;
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
      height: 60px;
      line-height: 60px;
      background: rgba(238, 238, 238, 0.2);
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 2px;
      font-size: 14px;

      &:focus {
        border-color: var(--color-primary);
        box-shadow: rgb(230 240 255) 0px 0px 0px 4px;
      }
    }
    .el-textarea__inner {
      background: rgba(238, 238, 238, 0.2);
      border: 1px solid rgba(0, 0, 0, 0.2);
      font-size: 14px;
      border-radius: 2px;

      &:focus {
        border-color: var(--color-primary);
        box-shadow: rgb(230 240 255) 0px 0px 0px 4px;
      }
    }
  }
}

.app-form {
  border-top: 1px solid #eeeeee;
  margin-top: -20px;
}

.contract-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

.tabs {
  ::v-deep {
    .el-tabs__header {
      padding-left: 30px;
    }
  }
}

.op {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.tag {
  font-size: 11px;
  font-weight: 600;
  transform: scale(0.866666);
  text-align: center;
}
</style>
