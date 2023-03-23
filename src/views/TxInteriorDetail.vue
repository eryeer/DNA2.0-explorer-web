<template>
  <div class="box">
    <div class="top-d">
      智能合约调用从 <short-hash :hash="fromAddress"></short-hash> 到
      <short-hash :hash="toAddress"></short-hash> 产生 {{ internalTxns.length }} 条内部交易
    </div>
    <div class="bg-white p-20">
      <el-table :data="internalTxns" style="width: 100%">
        <el-table-column label="调用类型" prop="txStatus" width="320">
          <template slot-scope="scope">
            <span class="type-container">
              <img class="left-bottom-icon" src="@/assets/images/left-bottom-icon.svg" alt="" />
              <div v-for="index of scope.row.level" class="text-dec-d">
                <img src="@/assets/images/text-dec-icon.svg" alt="" />
              </div>
              <img v-if="scope.row.error === ''" src="@/assets/images/success-icon.svg" alt="" />
              <el-tooltip
                :content="scope.row.error"
                placement="top"
                v-else="scope.row.error !== ''"
              >
                <img src="@/assets/images/error-icon.svg" alt="" />
              </el-tooltip>
              {{ scope.row.type.toLowerCase() }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="发起地址" width="240">
          <template slot-scope="scope">
            <router-link
              :to="{
                name: 'explorerAddress',
                params: {
                  address: scope.row.fromAddress,
                },
              }"
            >
              <short-hash :hash="scope.row.fromAddress"></short-hash>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="接收地址" width="240">
          <template slot-scope="scope" v-if="scope.row.toAddress">
            <router-link
              :to="{
                name: 'explorerAddress',
                params: {
                  address: scope.row.toAddress,
                },
              }"
            >
              <span
                v-if="
                  scope.row.type.toLowerCase() !== 'create' &&
                  scope.row.type.toLowerCase() !== 'create2'
                "
              >
                <el-tooltip content="合约" placement="top" v-if="scope.row.toAddressType != 0">
                  <img src="@/assets/images/contract.png" height="14" class="contract-icon mr-5" />
                </el-tooltip>
                <short-hash :hash="scope.row.toAddress" />
              </span>
              <span v-else>
                <el-tooltip content="创建合约" placement="top">
                  <img
                    src="@/assets/images/contract-icon.png"
                    alt=""
                    height="16"
                    class="contract-icon"
                  />
                </el-tooltip>
                Contract Creation
              </span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="数量（10⁹Gwei）" width="240">
          <template slot-scope="scope">
            <div>
              {{ gwei2ether(scope.row.value) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="燃料上限" width="200">
          <template slot-scope="scope">
            <div>{{ scope.row.gas | filterCount }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Loading from '@/utils/loading';
import { gwei2ether, getGasAmount } from '@/utils';

export default {
  name: 'Txs',
  props: {
    internalTxns: {
      type: [Object, Array],
      default: () => {},
    },
    fromAddress: String,
    toAddress: String,
  },
  data() {
    return {
      loading: new Loading(),
      params: {
        pageNumber: 1,
        pageSize: 10,
      },
      list: [],
    };
  },
  methods: {
    gwei2ether(val) {
      return gwei2ether(val);
    },
    getGasAmount(gasUsed, gasPrice) {
      return getGasAmount(gasUsed, gasPrice);
    },
  },
};
</script>
<style lang="scss" scoped>
.contract-icon {
  vertical-align: -2px;
}

.type-container {
  display: flex;
  img {
    margin-right: 4px;
    height: 16px;
  }
  .left-bottom-icon {
    width: 8px;
    height: 8px;
    margin-top: 1px;
  }
  .text-dec-d {
    display: flex;
    align-items: center;
    img {
      height: 2px;
    }
  }
  .bottom-space {
    width: 18px;
    margin-right: 6px;
    border-bottom: 1px solid #dbdbdb;
    margin-top: -1px;
    height: 16px;
  }
}

.flex {
  display: flex;
  justify-content: space-between;
}

.top-d {
  margin: 5px 0 20px;
  font-size: 14px;
  font-weight: 400;
  span {
    color: #2ab9a5;
  }
}
</style>
