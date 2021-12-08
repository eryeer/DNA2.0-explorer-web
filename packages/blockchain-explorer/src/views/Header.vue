<template>
  <header class="box pl-40 pr-20">
    <div class="logo">
      <router-link to="/">
        <img src="@/assets/images/logo.svg" :alt="title" :title="title" width="120" />
      </router-link>
    </div>
    <div class="f-18 f-b title">
      {{ title }}
    </div>
    <div class="dropdown">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <span class="avatar">
            <svg-icon icon-class="avatar" />
          </span>
          <span class="login-btn">{{ userName }}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout" class="pl-30 pr-30">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Header',
  data() {
    return {
      title: process.env.VUE_APP_TITLE,
    };
  },
  computed: {
    ...mapState({
      userName: (state) => state.account.userInfo && state.account.userInfo.userName,
    }),
  },
  methods: {
    ...mapActions(['logout']),
    handleCommand(command) {
      if (command === 'logout') {
        this.logout();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  height: 80px;
  background: #ffffff;
  display: flex;
  align-items: center;
}

.logo {
  margin-right: 60px;
}

.dropdown {
  margin-left: auto;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
}

.avatar {
  margin-right: 10px;
  color: var(--color-primary);
  font-size: 32px;
}
</style>
