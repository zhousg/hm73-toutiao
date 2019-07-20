<template>
  <el-container class="home-container">
    <el-aside class="my-aside" :width="collapse?'64px':'200px'">
      <div class="logo" :class="{close:collapse}"></div>
      <!-- 导航菜单组件容器 -->
      <el-menu
        :default-active="$route.path"
        background-color="#002033"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="border-right:none"
        :collapse="collapse"
        :collapse-transition="false"
        router
      >
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <i class="el-icon-document"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>
        <el-menu-item index="/image">
          <i class="el-icon-picture"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>
        <el-menu-item index="/publish">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
        <el-menu-item index="/comment">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
        <el-menu-item index="/fans">
          <i class="el-icon-present"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <i class="el-icon-setting"></i>
          <span slot="title">个人设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="my-header">
        <span class="el-icon-s-fold" @click="toggleMenu()"></span>
        <span class="text">江苏传智播客教育科技有限公司</span>
        <el-dropdown style="float:right">
          <span class="el-dropdown-link">
            <img
              style="vertical-align:middle"
              width="30"
              height="30"
              :src="avatar"
              alt
            />
            <b style="vertical-align:middle;padding-left:5px">{{name}}</b>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-setting" @click.native="setting()">个人设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-unlock" @click.native="logout()">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <!-- 显示二级路由对应的组件 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import eventBus from '@/eventBus'
export default {
  data () {
    return {
      collapse: false,
      name: '',
      avatar: ''
    }
  },
  created () {
    const user = JSON.parse(window.sessionStorage.getItem('hm73-toutiao'))
    this.name = user.name
    this.avatar = user.photo
    // 绑定事件
    eventBus.$on('updateHeaderName', (name) => {
      this.name = name
    })
    // 绑定事件
    eventBus.$on('updateHeaderPhoto', (photo) => {
      this.avatar = photo
    })
  },
  methods: {
    toggleMenu () {
      this.collapse = !this.collapse
    },
    // click事件是给谁绑定 el-dropdown-item
    // 它不是原生的dom,不一定支持原生的事件绑定
    // 如果我想给组件绑定原生的事件怎么办  需要给组件解析后的原生标签绑定
    // 使用一个事件修饰符 栗子：@click.prevent  最默认行为  @click.native 触发原生事件
    setting () {
      this.$router.push('/setting')
    },
    logout () {
      // window.sessionStorage.setItem('hm73-toutiao', null)
      window.sessionStorage.removeItem('hm73-toutiao')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped lang='less'>
.home-container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  .my-aside {
    background: #002033;
    .logo {
      width: 100%;
      height: 60px;
      background: #002840 url(../../assets/images/logo_admin.png) no-repeat
        center / 140px auto;
    }
    .close {
      background-image: url(../../assets/images/logo_admin_01.png);
      background-size: 36px auto;
    }
  }
  .my-header {
    border-bottom: 1px solid #ddd;
    line-height: 60px;
    .el-icon-s-fold {
      font-size: 26px;
      vertical-align: middle;
    }
    .text {
      vertical-align: middle;
      padding-left: 10px;
    }
  }
}
</style>
