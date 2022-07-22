<template>
  <section class="pb-30">
    <div class="header-wrapper">
      <div class="header margin-auto">
        <div class="header-logo">
          <router-link to="/" class="header-title" tag="h2">灵境MaaS链区块链浏览器</router-link>
          <div
            class="dropdown-wrapper"
            ref="dropdownWrapper"
            :class="{ 'dropdown-wrapper-test': !isProd }"
          >
            <div class="flag" @click="show = !show" :class="{ show: show }">
              {{ isProd ? '主网' : '测试网' }}
              <span class="flag-icon"></span>
            </div>
            <transition name="slide-fade">
              <div class="dropdown" v-show="show">
                <div @click="handleSelect" class="dropdown-item">
                  {{ isProd ? '测试网' : '主网' }}
                </div>
              </div>
            </transition>
          </div>
        </div>
        <div class="header-nav">
          <transition name="slide-fade2">
            <div class="header-search" v-show="!inHome || homeShow">
              <svg-icon icon-class="search" class="header-search-icon f-16" />
              <el-input
                class="header-search-input"
                placeholder="输入地址/交易哈希/区块高度"
                @keyup.enter.native="toSearch"
                v-model="searchContent"
                style="width: 290px"
                clearable
              ></el-input>
              <el-button type="primary" @click="toSearch">搜索</el-button>
            </div>
          </transition>

          <div class="header-router">
            <router-link
              to="/blocks"
              :class="{ 'router-link-active': $route.path.includes('/block') }"
              >区块</router-link
            >
            <router-link to="/txs" :class="{ 'router-link-active': $route.path.includes('/tx') }"
              >交易</router-link
            >
            <router-link
              to="/addresses"
              :class="{ 'router-link-active': $route.path.includes('/address') }"
              >地址</router-link
            >
            <span class="add-network" @click="switchNetwork">
              <img src="@/assets/images/metamask.png" width="16" height="16" alt="metamask" />
              Add Mass {{ isProd ? '' : 'Testnet' }} Network
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="margin-auto">
      <router-view :key="$route.fullPath" />
    </div>
  </section>
</template>

<script>
import { isHexString, debounce } from '@dna2.0/utils';
import { getBlock, getAddress, getTransaction } from '../api';
import { switchNetwork } from './contract/utils';

export default {
  name: 'explorer',
  data() {
    return {
      searchContent: '',
      show: false,
      homeShow: false,
    };
  },
  computed: {
    isProd() {
      return process.env.NODE_ENV === 'production';
    },
    inHome() {
      return this.$route.name === 'home';
    },
  },
  watch: {
    $route(to, from) {
      this.searchContent = '';
    },
  },
  methods: {
    async toSearch() {
      const content = this.searchContent.trim();
      const len = content.length;

      if (len === 0) {
        return;
      }

      /* block height */
      if (len <= 11 && /^\d+$/.test(content)) {
        const res = await getBlock({
          blockNumber: content,
        });
        if (res) {
          this.$router.push({
            name: 'explorerBlock',
            params: { blockHeight: content },
          });
          return;
        }
      }
      if (isHexString(content)) {
        /* address */
        if (len === 42) {
          const res = await getAddress({
            address: content,
          });
          if (res) {
            this.$router.push({
              name: 'explorerAddress',
              params: { address: content },
            });
            return;
          }
        }

        /* txhash */
        if (len === 66) {
          try {
            const res = await getTransaction({
              txHash: content,
            });
            if (res) {
              this.$router.push({
                name: 'explorerTx',
                params: { txHash: content },
              });
              return;
            }
          } catch (error) {
            this.$message.error('对不起，您的搜索不匹配任何记录');
            return;
          }
        }
      }
      this.$message.error('对不起，您的搜索不匹配任何记录');
    },
    handleSelect() {
      window.location.href = this.isProd
        ? 'https://maas-test-explorer.onchain.com/'
        : 'https://maas-explorer.onchain.com/';
    },
    documentClick({ target }) {
      const el = this.$refs.dropdownWrapper;
      if (!el) return;
      if (el !== target && !el.contains(target)) {
        this.show = false;
      }
    },
    handleScroll() {
      if (!this.inHome) return;
      const y = window.pageYOffset || document.documentElement.scrollTop;
      if (y >= 100) {
        this.homeShow = true;
      } else {
        this.homeShow = false;
      }
    },
    switchNetwork() {
      switchNetwork();
    },
  },
  mounted() {
    document.addEventListener('click', this.documentClick);
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    document.removeEventListener('click', this.documentClick);
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>

<style lang="scss" scoped>
.header-wrapper {
  box-shadow: 0px 1px 10px rgba(6, 8, 69, 0.06);
  background-color: #001a35;
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  height: 80px;

  &-title {
    cursor: pointer;
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
  }

  &-logo {
    display: flex;
    align-items: center;
    column-gap: 10px;
  }

  &-nav {
    display: flex;
    align-items: center;
  }

  &-router {
    display: flex;
    column-gap: 30px;
    align-items: center;
    margin-left: 90px;

    a {
      color: #fff;
      border-bottom-width: 3px;
      border-bottom-style: solid;
      border-bottom-color: transparent;
      font-weight: 400;
      padding-bottom: 5px;
      padding-top: 5px;
      &.router-link-active {
        border-bottom-color: #0078fa;
        font-weight: 500;
      }
    }
  }

  &-search {
    height: 40px;
    background-color: white;
    box-shadow: 0px 10px 20px rgba(0, 120, 250, 0.05);
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;

    &-icon {
      fill: none;
      stroke: none;
    }

    ::v-deep {
      .el-input__inner {
        background-color: white;
        border: none;
        color: rgba(0, 0, 0, 0.6);
      }
      .el-input__icon {
        font-size: 16px;
      }
      .el-button {
        width: 58px;
        height: 30px;
        font-size: 14px;
        line-height: 29px;
        color: #ffffff;
        text-align: center;
        border-radius: 4px;
        padding: 0;
      }
    }
  }
}

.dropdown-wrapper {
  position: relative;
  width: 70px;
  height: 24px;
  background: #0078fa;
  border-radius: 3px;
  font-weight: 500;
  font-size: 12px;
  padding-left: 10px;
  padding-right: 10px;
  color: #ffffff;
  line-height: 24px;

  .dropdown {
    background: #0078fa;
  }

  &-test {
    background: #88a4c1;

    .dropdown {
      background: #88a4c1;
    }
  }
}

.flag {
  display: flex;
  justify-content: space-between;
  align-items: center;
  &-icon {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 5px 4px 0 4px;
    border-color: #ffffff transparent transparent transparent;
    transition: all 0.3s ease;
    cursor: pointer;
  }
  &.show .flag-icon {
    transform: rotateZ(180deg);
  }
}

.dropdown {
  position: absolute;
  z-index: 111;
  top: 25px;
  left: 0px;
  right: 0px;
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
}

.dropdown-item {
  cursor: pointer;
  padding-left: 10px;

  &:hover {
    opacity: 0.8;
  }
}

.margin-auto {
  width: 1280px;
  margin-left: auto;
  margin-right: auto;
}

.add-network {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  color: #fff;
  display: flex;
  align-items: center;
  background: rgba(136,164,193,1);
  border-radius: 4px;
  height: 32px;
  padding-left: 10px;
  padding-right: 10px;
  column-gap: 5px;
  cursor: pointer;

  &:hover {
    background-color: #79a5d3;
  }
}
</style>

<style lang="scss">
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
  max-height: 360px;
  overflow: hidden;
}
.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

.slide-fade2-enter-active,
.slide-fade2-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.slide-fade2-enter,
.slide-fade2-leave-to {
  opacity: 0;
  overflow: hidden;
}
</style>
