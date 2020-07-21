<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <div v-if="collapse" key="collapse" class="sidebar-logo-link" @click="goHome">
        <!-- <img v-if="logo" :src="logo" class="sidebar-logo"> -->
        <h1 v-if="viewLevel == 1" class="sidebar-title">{{ title }} </h1>
        <h1 v-else class="sidebar-title">
          <i class="el-icon-arrow-left" />
        </h1>
      </div>
      <div v-else key="expand" class="sidebar-logo-link" @click="goHome">
        <h1 v-if="viewLevel == 1" class="sidebar-title">{{ title }} </h1>
        <h1 v-else class="sidebar-title">
          <i class="el-icon-arrow-left" />
        </h1>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AbSidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
    }
  },
  computed: {
    ...mapGetters(['adminBaseFrame']),
    viewLevel() {
      return this.adminBaseFrame.app.viewLevel
    },
    title() {
      return 'app demo title'
    }
  },
  methods: {
    goHome() {
      if (this.viewLevel !== 1) {
        this.$router.push(this.adminBaseFrame.app.lastVisitedView[`lv_${this.viewLevel - 1}`])
        return
      }
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    cursor: pointer;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
.el-icon-arrow-left {
  transform: scale(2);
}
</style>
