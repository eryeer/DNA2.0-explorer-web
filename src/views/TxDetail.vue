<template>
  <div class="box">
    <heading-2 with-go-back>交易详情</heading-2>
    <div class="info-bar f-16 pl-30 mb-20">
      <span class="mr-10">交易</span>
      <router-link
        :to="{
          name: 'explorerTx',
          params: {
            txHash: txHash,
          },
        }"
      >
        <copyable>{{ txHash }}</copyable>
      </router-link>
    </div>
    <el-tabs>
      <el-tab-pane label="总览">
        <div class="bg-white p-40" v-if="info.txHash">
          <ol class="list">
            <li>
              <span>生成时间:</span>
              <span>{{ info.blockTime | filterDate }}</span>
            </li>
            <li>
              <span>交易哈希:</span>
              <span>{{ info.txHash }}</span>
            </li>
            <li>
              <span>类型:</span>
              <span> {{ info.txType === 1 ? '合约部署' : '普通' }}</span>
            </li>
            <li>
              <span>状态:</span>
              <span :class="{ 'c-danger': info.txStatus !== '0x1' }">
                {{ info.txStatus === '0x1' ? '成功' : '失败' }}</span
              >
            </li>
            <li>
              <span>区块高度:</span>
              <span>
                <router-link
                  :to="{
                    name: 'explorerBlock',
                    params: {
                      blockHeight: info.blockNumber,
                    },
                  }"
                >
                  {{ info.blockNumber | filterCount }}
                </router-link></span
              >
            </li>
            <li><divider /></li>
            <li>
              <span>发起地址:</span>
              <span>
                <router-link
                  :to="{
                    name: 'explorerAddress',
                    params: {
                      address: info.fromAddress,
                    },
                  }"
                >
                  {{ info.fromAddress }}
                </router-link></span
              >
            </li>
            <!-- <li>
              <span>接收地址:</span>
              <span v-if="info.toAddress">
                <el-tooltip content="合约" placement="top" v-if="info.toAddressType === 1">
                  <img src="@/assets/images/contract.png" height="14" class="contract-icon mr-5" />
                </el-tooltip>
                <router-link
                  :to="{
                    name: 'explorerAddress',
                    params: {
                      address: info.toAddress,
                    },
                  }"
                >
                  {{ info.toAddress }}
                </router-link></span
              >
              <span v-else>
                [Contract
                <router-link
                  :to="{
                    name: 'explorerAddress',
                    params: {
                      address: info.contractAddress,
                    },
                  }"
                >
                  {{ info.contractAddress }}
                </router-link>
                Created]

                <el-tooltip content="ABI已上传" placement="top" v-if="abiHasUpload">
                  <i class="el-icon-success f-18 c-succ" style="vertical-align: -2px"></i>
                </el-tooltip>
              </span>
            </li> -->
            <li class="tree-container" v-if="internalTxns.length > 0">
              <span class="tree-left">接收地址:</span>
              <span>
                <el-tree
                  :data="internalTxns"
                  :props="defaultProps"
                  class="tree-line"
                  icon-class="el-icon-circle-plus-outline"
                  :default-expand-all="true"
                >
                  <span slot-scope="{ node, data }">
                    <span v-if="node.level === 1">
                      <span v-if="info.toAddress">
                        <el-tooltip content="合约" placement="top" v-if="info.toAddressType === 1">
                          <img
                            src="@/assets/images/contract.png"
                            height="14"
                            class="contract-icon mr-5"
                          />
                        </el-tooltip>
                        <router-link
                          :to="{
                            name: 'explorerAddress',
                            params: {
                              address: info.toAddress,
                            },
                          }"
                        >
                          {{ info.toAddress }}
                        </router-link></span
                      >
                      <span v-else class="default-t">
                        [Contract
                        <router-link
                          :to="{
                            name: 'explorerAddress',
                            params: {
                              address: info.contractAddress,
                            },
                          }"
                        >
                          {{ info.contractAddress }}
                        </router-link>
                        Created]

                        <el-tooltip content="ABI已上传" placement="top" v-if="abiHasUpload">
                          <i class="el-icon-success f-18 c-succ" style="vertical-align: -2px"></i>
                        </el-tooltip>
                      </span>
                    </span>
                    <span v-else>
                      <span>从 </span>
                      <el-tooltip placement="top" :content="data.fromAddress">
                        <router-link
                          :to="{
                            name: 'explorerAddress',
                            params: {
                              address: data.fromAddress,
                            },
                          }"
                        >
                          <short-hash :hash="data.fromAddress"></short-hash>
                        </router-link>
                      </el-tooltip>
                      <span> 到 </span>
                      <el-tooltip placement="top" :content="data.toAddress">
                        <router-link
                          :to="{
                            name: 'explorerAddress',
                            params: {
                              address: data.toAddress,
                            },
                          }"
                        >
                          <short-hash :hash="data.toAddress"></short-hash>
                        </router-link>
                      </el-tooltip>
                      <span> 转账 {{ data.value }} GWEI</span>
                    </span>
                  </span>
                </el-tree>
              </span>
            </li>
            <li><divider /></li>
            <!-- <template v-if="ERC20Transfers.length">
              <li>
                <span>数字藏品转账:</span>
                <span>
                  <div class="mb-10" v-for="(transfer, index) in ERC20Transfers" :key="index">
                    <span class="c-grey">从 </span>
                    <router-link
                      :to="{
                        name: 'explorerAddress',
                        params: {
                          address: transfer.fromAddress,
                        },
                      }"
                    >
                      <short-hash :hash="transfer.fromAddress"></short-hash>
                    </router-link>
                    <span class="c-grey"> 到 </span>
                    <router-link
                      :to="{
                        name: 'explorerAddress',
                        params: {
                          address: transfer.toAddress,
                        },
                      }"
                    >
                      <short-hash :hash="transfer.toAddress"></short-hash>
                    </router-link>
                    <span class="c-grey"> 转 </span><span class="f-b">{{ transfer.amount }}</span>
                    <span v-if="transfer.tokenName">
                      {{ transfer.tokenName }}({{ transfer.tokenName }})
                    </span>
                    <template v-else>
                      数字藏品标识
                      <router-link
                        :to="{
                          name: 'explorerAddress',
                          params: {
                            address: transfer.address,
                          },
                        }"
                      >
                        <short-hash :hash="transfer.address"></short-hash>
                      </router-link>
                    </template>
                  </div>
                </span>
              </li>
              <li><divider /></li>
            </template> -->
            <li v-for="(transfer, index) in ERC721Transfers" :key="index">
              <span>数字藏品转账:</span>
              <span>
                <div class="mb-10">
                  <span class="c-grey">从 </span>
                  <router-link
                    :to="{
                      name: 'explorerAddress',
                      params: {
                        address: transfer.fromAddress,
                      },
                    }"
                  >
                    <short-hash :hash="transfer.fromAddress"></short-hash>
                  </router-link>
                  <span class="c-grey"> 到 </span>
                  <router-link
                    :to="{
                      name: 'explorerAddress',
                      params: {
                        address: transfer.toAddress,
                      },
                    }"
                  >
                    <short-hash :hash="transfer.toAddress"></short-hash>
                  </router-link>
                  <span class="c-grey"> 转 </span
                  ><span class="f-b">数字藏品ID [{{ transfer.tokenId }}] </span>
                  <span v-if="transfer.tokenName">
                    {{ transfer.tokenName }}({{ transfer.tokenName }})
                  </span>
                  <template v-else>
                    <router-link
                      :to="{
                        name: 'explorerAddress',
                        params: {
                          address: transfer.address,
                        },
                      }"
                    >
                      <short-hash :hash="transfer.address"></short-hash>
                    </router-link>
                  </template>
                </div>
              </span>
            </li>
            <li v-if="ERC721Transfers.length"><divider /></li>
            <li>
              <span>数量:</span>
              <span> {{ gwei2ether(info.txValue * Math.pow(10, 9)) }} Gwei</span>
            </li>
            <li>
              <span>交易费:</span>
              <span>{{ getGasAmount(info.gasUsed, info.gasPrice) }} Gwei</span>
            </li>
            <li>
              <span>燃料价格:</span>
              <span>{{ gwei2ether(info.gasPrice) }} Gwei</span>
            </li>
            <li>
              <span>消耗燃料:</span>
              <span>{{ info.gasUsed | filterCount }}</span>
            </li>
            <li>
              <span>燃料上限:</span>
              <span>{{ info.gasLimit | filterCount }}</span>
            </li>
            <li>
              <span>燃料使用率:</span>
              <span>{{ (info.gasUsed / info.gasLimit) | filterPercentage }}</span>
            </li>
            <li><divider /></li>
            <li>
              <span>Nonce:</span>
              <span>{{ info.nonce }}</span>
            </li>
            <li>
              <span>输入数据:</span>
              <span>
                <div class="mb-15">
                  <el-input
                    class="inputData"
                    type="textarea"
                    :rows="6"
                    :value="showInputData"
                    size="medium"
                    autocomplete="off"
                    readonly
                  ></el-input>
                </div>
                <div class="t-r">
                  <el-button
                    type="info"
                    size="mini"
                    plain
                    @click="showAsOriginal = !showAsOriginal"
                    :disabled="info.txType === 1"
                  >
                    <svg-icon icon-class="back2" class="s-n" />
                    {{ !showAsOriginal ? '展示原始数据' : '展示默认视图' }}</el-button
                  >
                </div>
              </span>
            </li>
          </ol>
        </div>
      </el-tab-pane>
      <el-tab-pane label="内部交易">
        <div class="bg-white p-40" v-if="!flattenInternalTxns.length">
          <el-empty description="没有交易"></el-empty>
        </div>
        <div v-else>
          <TxInteriorDetail
            :internalTxns="flattenInternalTxns"
            :fromAddress="info.fromAddress"
            :toAddress="info.toAddress"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="日志">
        <div class="bg-white p-40" v-if="!info.logList.length">
          <el-empty description="没有日志"></el-empty>
        </div>
        <div
          class="bg-white p-40 log"
          :class="{ 'mb-20': index !== info.logList.length - 1 }"
          v-for="(log, index) in info.logList"
          :key="index"
        >
          <span class="f-16 f-b mr-40"> {{ String(index + 1).padStart(2, '0') }}</span>
          <ol class="list">
            <li>
              <span>合约地址:</span>
              <span>
                <router-link
                  :to="{
                    name: 'explorerAddress',
                    params: {
                      address: log.address,
                    },
                  }"
                >
                  {{ log.address }}
                </router-link>
              </span>
            </li>
            <li v-if="log.eventName">
              <span>名称：</span>
              <span> <code-highlight :code="log.eventName" /></span>
            </li>
            <li>
              <span>主题:</span>
              <span>
                <div
                  v-for="(topic, index) in JSON.parse(log.topics)"
                  :key="index"
                  :class="{ 'mb-20': index !== JSON.parse(log.topics).length - 1 }"
                >
                  {{ index }} {{ topic }}
                </div>
              </span>
            </li>
            <li>
              <span>数据：</span>
              <span> {{ log.data }}</span>
            </li>
          </ol>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from 'axios';
import Loading from '@/utils/loading';
import { getTransaction, getAddress } from '@/api/explorer';
// import abiDecoder from 'abi-decoder';
import { ethers } from 'ethers';
import Divider from './Divider';
import TxInteriorDetail from './TxInteriorDetail';
import ShortHash from '../components/ShortHash.vue';
import CodeHighlight from './CodeHighlight';
import { gwei2ether, getGasAmount } from '@/utils';

export default {
  name: 'TxDetail',
  components: {
    Divider,
    TxInteriorDetail,
    ShortHash,
    CodeHighlight,
  },
  data() {
    return {
      info: {
        logList: [],
        ercTransferLog: [],
        toAddress: '',
        toAddressType: '',
      },
      contractAddressInfo: {},
      loading: new Loading(),
      inputData: '0x',
      showAsOriginal: false,
      abiHasUpload: false,
      internalTxns: [
        {
          fromAddress: '',
          toAddress: '',
          calls: [],
        },
      ],
      flattenInternalTxns: [],
      level: 0,
      defaultProps: {
        children: 'calls',
        label: '',
      },
    };
  },
  computed: {
    txHash() {
      return this.$route.params.txHash;
    },
    ERC20Transfers() {
      if (!this.info.ercTransferLog.length) {
        return [];
      }
      return this.info.ercTransferLog.filter((item) => item.contractType === 'ERC20');
    },
    ERC721Transfers() {
      if (!this.info.ercTransferLog.length) {
        return [];
      }
      return this.info.ercTransferLog.filter((item) => item.contractType === 'ERC721');
    },
    showInputData() {
      return this.showAsOriginal ? this.info.data : this.inputData;
    },
  },
  watch: {
    txHash() {
      this.query();
    },
  },
  methods: {
    query() {
      this.getTransaction();
    },
    async getTransaction() {
      const info = await this.loading.run(async () => {
        return await getTransaction({
          txHash: this.txHash,
        });
      });
      if (info.txValue == 0) {
        this.internalTxns = [
          {
            toAddress: info.toAddress,
            toAddressType: 0,
          },
        ];
      } else {
        this.internalTxns = [
          {
            parents: info.fromAddress,
            toAddress: info.toAddress,
            calls: info.internalTxns,
            toAddressType: 0,
          },
        ];
      }
      this.flatten(info.internalTxns, this.level);
      let toAddressType = 0;
      if (info.txType === 1) {
        this.showAsOriginal = true;
      }
      try {
        const addrInfo = await this.loading.run(async () => {
          return await getAddress({
            address: info.toAddress,
          });
        });
        toAddressType = addrInfo ? addrInfo.type : 0;
        this.contractAddressInfo = addrInfo?.contractInfo || {};
        this.genInputData(info.data, addrInfo?.contractInfo);
      } catch (error) {}

      if (info.contractAddress) {
        try {
          const contractAddressInfo = await this.loading.run(async () => {
            return await getAddress({
              address: info.contractAddress,
            });
          });
          if (!!contractAddressInfo.contractInfo) {
            this.abiHasUpload = true;
          }
        } catch (error) {}
      }

      this.info = {
        ...info,
        toAddressType,
      };
      this.internalTxns[0].toAddressType = toAddressType;
    },
    gwei2ether(val) {
      return gwei2ether(val);
    },
    getGasAmount(gasUsed, gasPrice) {
      return getGasAmount(gasUsed, gasPrice);
    },
    async genInputData(infoData, contractInfo) {
      if (!infoData || infoData === '0x' || infoData.slice(0, 2) !== '0x') {
        this.inputData = infoData;
      } else if (contractInfo && !!contractInfo.abi) {
        const { Interface, FormatTypes } = ethers.utils;
        try {
          const iface = new Interface(contractInfo.abi);
          const functionFragment = iface.getFunction(infoData.slice(0, 10));
          let str = `Function: ${functionFragment.format(FormatTypes.sighash)} 

MethodID: ${infoData.slice(0, 10)}`;

          let i = 0;

          while (i < Math.floor(infoData.length / 64)) {
            str += `\n[${i}]:  ${infoData.slice(i * 64 + 10, (i + 1) * 64 + 10)}`;

            i++;
          }
          // abiDecoder.addABI(JSON.parse(contractInfo.abi));
          // const decodedData = abiDecoder.decodeMethod(infoData) || [];
          // str += `\n${JSON.stringify(decodedData?.params)}`;
          this.inputData = str;
          return;
        } catch (error) {
          let str = `MethodID: ${infoData.slice(0, 10)}`;

          let i = 0;

          while (i < Math.floor(infoData.length / 64)) {
            str += `\n[${i}]:  ${infoData.slice(i * 64 + 10, (i + 1) * 64 + 10)}`;

            i++;
          }
          this.inputData = str;
        }
      } else {
        try {
          const signHash = infoData.slice(2, 10);
          const signatures = await axios({
            url: `https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/${signHash}`,
            method: 'get',
          });
          let fin = signatures.data;
          let str = `Function: ${fin}

MethodID: ${infoData.slice(0, 10)}`;

          let i = 0;

          while (i < Math.floor(infoData.length / 64)) {
            str += `\n[${i}]:  ${infoData.slice(i * 64 + 10, (i + 1) * 64 + 10)}`;

            i++;
          }

          this.inputData = str;
        } catch (error) {
          let str = `MethodID: ${infoData.slice(0, 10)}`;

          let i = 0;

          while (i < Math.floor(infoData.length / 64)) {
            str += `\n[${i}]:  ${infoData.slice(i * 64 + 10, (i + 1) * 64 + 10)}`;

            i++;
          }
          this.inputData = str;
        }
      }
    },
    flatten(arr, level) {
      this.level = level;
      for (let i = 0, length = arr.length; i < length; i++) {
        let str = {
          blockNumber: arr[i].blockNumber,
          blockTime: arr[i].blockTime,
          error: arr[i].error,
          fromAddress: arr[i].fromAddress,
          gas: arr[i].gas,
          gasUsed: arr[i].gasUsed,
          id: arr[i].id,
          input: arr[i].input,
          output: arr[i].output,
          parentId: arr[i].parentId,
          toAddress: arr[i].toAddress,
          txHash: arr[i].txHash,
          type: arr[i].type,
          value: arr[i].value,
          level,
        };
        this.flattenInternalTxns.push(str);
        if (Array.isArray(arr[i].calls)) {
          this.flatten(arr[i].calls, this.level + 1);
        }
      }
    },
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
  background-color: #0078fa;
  color: #fff;
  > span {
    opacity: 0.6;
  }
  .copy-wrapper {
    color: #fff;
  }
}

.log {
  display: flex;
}

.list {
  > li {
    display: flex;
    > span:first-child {
      opacity: 0.6;
      min-width: 100px;
      margin-right: 50px;
    }
    .tree-left {
      margin-top: 5px;
      margin-right: 26px !important;
    }
    > span:last-child {
      word-break: break-all;
      padding-right: 20px;
      flex: 1;
    }
    &:not(:last-child) {
      margin-bottom: 30px;
    }
  }
  .tree-container {
    max-height: 260px;
    margin-top: -5px;
    overflow: scroll;
    .default-t {
      color: #000;
    }
  }
  ::-webkit-scrollbar {
    display: none;
  }
}

.contract-icon {
  vertical-align: -2px;
}

.s-n {
  stroke: none;
}

.inputData {
  ::v-deep {
    .el-textarea__inner {
      padding: 20px;
      color: rgb(119, 131, 143);
      font-family: SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
    }
  }
}
</style>

<style lang="scss">
.tree-line {
  .el-tree-node {
    position: relative;
    // padding-left: 24px; // 缩进量
    .el-tree-node__content {
      padding-left: 24px !important; // 缩进量
    }
    .el-tree-node__content:hover {
      background-color: #fff;
    }
    .el-tree-node:focus > .el-tree-node__content {
      background-color: #fff;
    }
  }
  .el-tree-node:focus > .el-tree-node__content {
    background-color: #fff;
  }
  .el-tree-node__children {
    padding-left: 32px; // 缩进量
  }

  // 竖线
  .el-tree-node::before {
    content: '';
    height: 100%;
    width: 1px;
    position: absolute;
    left: -3px;
    top: -26px;
    border-width: 1px;
    border-left: 1px solid rgba(0, 0, 0, 0.29);
  }
  // 当前层最后一个节点的竖线高度固定
  .el-tree-node:last-child::before {
    height: 38px; // 可以自己调节到合适数值
  }

  // 横线
  .el-tree-node::after {
    content: '';
    width: 24px;
    // height: 16px;
    position: absolute;
    left: -3px;
    top: 12px;
    border-width: 1px;
    border-top: 1px solid rgba(0, 0, 0, 0.29);
  }

  // 去掉最顶层的虚线，放最下面样式才不会被上面的覆盖了
  & > .el-tree-node::after {
    border-top: none;
  }
  & > .el-tree-node::before {
    border-left: none;
  }

  // 展开关闭的icon
  .el-tree-node__expand-icon {
    font-size: 16px;
    display: none;
    // 叶子节点（无子节点）
    &.is-leaf {
      color: transparent;
      display: none; // 也可以去掉
      font-size: 0;
    }
  }
}
</style>
