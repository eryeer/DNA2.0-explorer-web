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

const mock = `/**
 *Submitted for verification at Etherscan.io on 2017-07-06
*/

pragma solidity ^0.4.8;

/**
 * Math operations with safety checks
 */
contract SafeMath {
  function safeMul(uint256 a, uint256 b) internal returns (uint256) {
    uint256 c = a * b;
    assert(a == 0 || c / a == b);
    return c;
  }

  function safeDiv(uint256 a, uint256 b) internal returns (uint256) {
    assert(b > 0);
    uint256 c = a / b;
    assert(a == b * c + a % b);
    return c;
  }

  function safeSub(uint256 a, uint256 b) internal returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function safeAdd(uint256 a, uint256 b) internal returns (uint256) {
    uint256 c = a + b;
    assert(c>=a && c>=b);
    return c;
  }

  function assert(bool assertion) internal {
    if (!assertion) {
      throw;
    }
  }
}
contract BNB is SafeMath{
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
	address public owner;

    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;
	mapping (address => uint256) public freezeOf;
    mapping (address => mapping (address => uint256)) public allowance;

    /* This generates a public event on the blockchain that will notify clients */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /* This notifies clients about the amount burnt */
    event Burn(address indexed from, uint256 value);
	
	/* This notifies clients about the amount frozen */
    event Freeze(address indexed from, uint256 value);
	
	/* This notifies clients about the amount unfrozen */
    event Unfreeze(address indexed from, uint256 value);

    /* Initializes contract with initial supply tokens to the creator of the contract */
    function BNB(
        uint256 initialSupply,
        string tokenName,
        uint8 decimalUnits,
        string tokenSymbol
        ) {
        balanceOf[msg.sender] = initialSupply;              // Give the creator all initial tokens
        totalSupply = initialSupply;                        // Update total supply
        name = tokenName;                                   // Set the name for display purposes
        symbol = tokenSymbol;                               // Set the symbol for display purposes
        decimals = decimalUnits;                            // Amount of decimals for display purposes
		owner = msg.sender;
    }

    /* Send coins */
    function transfer(address _to, uint256 _value) {
        if (_to == 0x0) throw;                               // Prevent transfer to 0x0 address. Use burn() instead
		if (_value <= 0) throw; 
        if (balanceOf[msg.sender] < _value) throw;           // Check if the sender has enough
        if (balanceOf[_to] + _value < balanceOf[_to]) throw; // Check for overflows
        balanceOf[msg.sender] = SafeMath.safeSub(balanceOf[msg.sender], _value);                     // Subtract from the sender
        balanceOf[_to] = SafeMath.safeAdd(balanceOf[_to], _value);                            // Add the same to the recipient
        Transfer(msg.sender, _to, _value);                   // Notify anyone listening that this transfer took place
    }

    /* Allow another contract to spend some tokens in your behalf */
    function approve(address _spender, uint256 _value)
        returns (bool success) {
		if (_value <= 0) throw; 
        allowance[msg.sender][_spender] = _value;
        return true;
    }
       

    /* A contract attempts to get the coins */
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        if (_to == 0x0) throw;                                // Prevent transfer to 0x0 address. Use burn() instead
		if (_value <= 0) throw; 
        if (balanceOf[_from] < _value) throw;                 // Check if the sender has enough
        if (balanceOf[_to] + _value < balanceOf[_to]) throw;  // Check for overflows
        if (_value > allowance[_from][msg.sender]) throw;     // Check allowance
        balanceOf[_from] = SafeMath.safeSub(balanceOf[_from], _value);                           // Subtract from the sender
        balanceOf[_to] = SafeMath.safeAdd(balanceOf[_to], _value);                             // Add the same to the recipient
        allowance[_from][msg.sender] = SafeMath.safeSub(allowance[_from][msg.sender], _value);
        Transfer(_from, _to, _value);
        return true;
    }

    function burn(uint256 _value) returns (bool success) {
        if (balanceOf[msg.sender] < _value) throw;            // Check if the sender has enough
		if (_value <= 0) throw; 
        balanceOf[msg.sender] = SafeMath.safeSub(balanceOf[msg.sender], _value);                      // Subtract from the sender
        totalSupply = SafeMath.safeSub(totalSupply,_value);                                // Updates totalSupply
        Burn(msg.sender, _value);
        return true;
    }
	
	function freeze(uint256 _value) returns (bool success) {
        if (balanceOf[msg.sender] < _value) throw;            // Check if the sender has enough
		if (_value <= 0) throw; 
        balanceOf[msg.sender] = SafeMath.safeSub(balanceOf[msg.sender], _value);                      // Subtract from the sender
        freezeOf[msg.sender] = SafeMath.safeAdd(freezeOf[msg.sender], _value);                                // Updates totalSupply
        Freeze(msg.sender, _value);
        return true;
    }
	
	function unfreeze(uint256 _value) returns (bool success) {
        if (freezeOf[msg.sender] < _value) throw;            // Check if the sender has enough
		if (_value <= 0) throw; 
        freezeOf[msg.sender] = SafeMath.safeSub(freezeOf[msg.sender], _value);                      // Subtract from the sender
		balanceOf[msg.sender] = SafeMath.safeAdd(balanceOf[msg.sender], _value);
        Unfreeze(msg.sender, _value);
        return true;
    }
	
	// transfer balance to owner
	function withdrawEther(uint256 amount) {
		if(msg.sender != owner)throw;
		owner.transfer(amount);
	}
	
	// can accept ether
	function() payable {
    }
}`;

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
    computed: {
      createNewContractDisabled() {
        return this.createContract.params.some((item) => !item.content);
      },
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
