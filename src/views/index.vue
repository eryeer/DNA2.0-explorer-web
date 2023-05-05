<template>
  <div class="app-container">
    <section class="pb-30 header-top">
      <div class="header-wrapper">
        <div class="header margin-auto">
          <div class="header-logo">
            <router-link to="/" class="header-title" tag="h2"
              ><img src="~@/assets/images/logo.svg" height="50px" /><span
                >酒泉链浏览器</span
              ></router-link
            >
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
                <!-- <img src="@/assets/images/metamask.png" width="16" height="16" alt="metamask" /> -->
                Add Jiuquan {{ isProd ? '' : 'Testnet ' }}Network
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="margin-auto">
        <router-view :key="$route.fullPath" />
      </div>
    </section>
    <div class="margin-auto footer">
      <div class="footer-container">
        <div>
          <!-- <div class="footer-logo">Jiuquan</div>
          <div class="footer-intro">Jiuquan to the Blockchain</div> -->
          <div class="footer-copyright">
            Copyright 2023 Jiuquan.
            <a class="footer-link" href="https://onegate.space/terms.html" target="_blank">Terms</a>
            &
            <a class="footer-link" href="https://onegate.space/privacy.html" target="_blank"
              >Privacy</a
            >
          </div>
        </div>
        <div style="margin-left: auto">
          <div class="footer-title">Help</div>
          <a
            class="footer-subtitle"
            href="https://onegate.gitbook.io/onegate/manage-wallets"
            target="_blank"
            >Wallet</a
          >
          <a class="footer-subtitle" href="https://onegate.gitbook.io/onegate/nfts" target="_blank"
            >NFT</a
          >
        </div>
        <div style="margin-left: 150px">
          <div class="footer-title">Developer</div>
          <a class="footer-subtitle" href="javascript:">dAPI</a>
        </div>
        <div style="margin-left: 150px">
          <div class="footer-title">Contact Us</div>
          <div style="padding-bottom: 4px">
            <a
              class="text-muted"
              title="Twitter: OneGateWallet"
              href="https://twitter.com/OneGateSpace"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="27"
                height="22"
                viewBox="0 0 27 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M26.1358 3.26512C25.2059 3.67759 24.2063 3.95634 23.1575 4.08168C24.228 3.43988 25.0504 2.42364 25.4375 1.21265C24.4354 1.80698 23.3257 2.23852 22.1444 2.47103C21.1985 1.46318 19.8509 0.833496 18.3593 0.833496C15.4955 0.833496 13.1734 3.15527 13.1734 6.01912C13.1734 6.42554 13.2193 6.82134 13.3078 7.20093C8.99789 6.98464 5.17673 4.92012 2.6191 1.78265C2.17269 2.54854 1.91696 3.43934 1.91696 4.38973C1.91696 6.18888 2.83243 7.77613 4.22393 8.70615C3.37394 8.67908 2.57423 8.44588 1.87512 8.05747C1.87463 8.07913 1.87463 8.10077 1.87463 8.12265C1.87463 10.6353 3.66218 12.7311 6.03445 13.2076C5.59933 13.3261 5.14119 13.3895 4.66825 13.3895C4.33409 13.3895 4.00923 13.3569 3.69254 13.2965C4.35247 15.3566 6.26758 16.856 8.53685 16.8977C6.76207 18.2887 4.52606 19.1178 2.09642 19.1178C1.67784 19.1178 1.26506 19.0931 0.859375 19.0451C3.15431 20.5165 5.88017 21.3752 8.80867 21.3752C18.3471 21.3752 23.5633 13.4733 23.5633 6.62042C23.5633 6.39562 23.5582 6.17197 23.5482 5.94952C24.5615 5.21837 25.4406 4.30506 26.1358 3.26512Z"
                  fill="#676c6c"
                />
              </svg>
            </a>
          </div>
          <div>
            <a class="text-muted" href="mailto:hello@onegate.space">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.75 3.75H2.25C1.83516 3.75 1.5 4.08516 1.5 4.5V19.5C1.5 19.9148 1.83516 20.25 2.25 20.25H21.75C22.1648 20.25 22.5 19.9148 22.5 19.5V4.5C22.5 4.08516 22.1648 3.75 21.75 3.75ZM19.8563 6.30234L12.4617 12.0563C12.2789 12.1992 12.0234 12.1992 11.8406 12.0563L4.44375 6.30234C4.41587 6.28082 4.39541 6.25112 4.38526 6.21739C4.37511 6.18367 4.37576 6.14761 4.38713 6.11427C4.3985 6.08094 4.42002 6.052 4.44867 6.0315C4.47731 6.01101 4.51165 5.99999 4.54688 6H19.7531C19.7883 5.99999 19.8227 6.01101 19.8513 6.0315C19.88 6.052 19.9015 6.08094 19.9129 6.11427C19.9242 6.14761 19.9249 6.18367 19.9147 6.21739C19.9046 6.25112 19.8841 6.28082 19.8563 6.30234Z"
                  fill="#676c6c"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isHexString } from '@/utils';
import { getBlock, getAddress, getTransaction } from '@/api/explorer';
import { switchNetwork, getNetworkParams } from './contract/utils';

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
        ? 'https://test-explorer.lingjing-eco.com.cn/'
        : 'https://explorer.lingjing-eco.com.cn/';
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
      if (!ethereum || !ethereum.on) {
        window.open('https://metamask.io/', '_blank', 'noopener');
        return;
      }
      const networkVersion = ethereum.networkVersion;
      const networkParams = getNetworkParams();
      if (parseInt(networkParams.chainId, 16) == networkVersion) {
        this.$message({
          message: `${networkParams.chainName} has already been added to Metamask.`,
          type: 'info',
        });
        return;
      }
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
.app-container {
  height: 100%;
}

.header-top {
  box-sizing: border-box;
  min-height: 100%;
  padding-bottom: 80px;
}

.footer {
  border-top: 1px solid white;
  width: 100% !important;
  background-color: #f9f9f9;
  height: 300px;

  &-container {
    padding-top: 48px;
    width: 1280px;
    display: flex;
    margin: 0 auto;
  }

  &-logo {
    color: black;
    font-family: Verdana;
    font-size: 34px;
  }

  &-intro {
    margin-top: 16px;
    font-size: 13px;
    font-weight: 400;
    color: #525f7f;
  }

  &-copyright {
    color: #525f7f;
    // margin-top: 150px;
    font-size: 16px;
    font-weight: 400;
  }

  &-link {
    cursor: pointer;
    font-size: 16px;
    color: #8898aa;
  }

  &-title {
    font-size: 16px;
    color: #525f7f;
    font-weight: bolder;
    margin-bottom: 16px;
  }

  &-subtitle {
    display: block;
    cursor: pointer;
    font-size: 16px;
    color: #8898aa;
    font-weight: 400;
    margin-bottom: 4px;
  }
}

.header-wrapper {
  background-color: white;
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 1000;
  color: black;
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
    display: flex;
    align-items: center;
    gap: 10px;
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
    margin-left: 250px;

    a {
      color: #606266;
      border-bottom-width: 3px;
      border-bottom-style: solid;
      border-bottom-color: transparent;
      font-family: Inter;
      font-style: normal;
      font-weight: 300;
      font-size: 14px;
      padding-bottom: 5px;
      padding-top: 5px;
      &.router-link-active {
        border-bottom-color: #5e72e4;
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
  background: #5e72e4;
  border-radius: 3px;
  font-weight: 500;
  font-size: 12px;
  padding-left: 10px;
  padding-right: 10px;
  color: #ffffff;
  line-height: 24px;

  .dropdown {
    background: #5e72e4;
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
  background: rgba(136, 164, 193, 1);
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
