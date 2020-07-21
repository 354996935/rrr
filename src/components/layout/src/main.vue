<template>
  <div :class="classObj" class="app-wrapper">
    <!-- sidebar -->
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <!-- header -->
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <!-- app-main -->
      <section class="app-main">
        <transition name="fade-transform" mode="out-in">
          <slot />
        </transition>
      </section>
      <!-- setting icon -->
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import { Navbar, Settings, Sidebar, TagsView, RightPanel } from './components'
import { mapState } from 'vuex'

export default {
  name: 'AbLayout',
  components: {
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  computed: {
    ...mapState({
      viewLevel: state => state.adminBaseFrame.app.viewLevel,
      sidebar: state => state.adminBaseFrame.app.sidebar,
      showSettings: state => state.adminBaseFrame.settings.showSettings,
      needTagsView: state => state.adminBaseFrame.settings.tagsView,
      fixedHeader: state => state.adminBaseFrame.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: this.sidebar.status === 'hide',
        miniSidebar: this.sidebar.status === 'mini',
        openSidebar: this.sidebar.status === 'normal',
        withoutAnimation: this.sidebar.withoutAnimation
      }
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(nv) {
        const { meta: { viewLevel = 1 }} = nv
        if (this.viewLevel !== viewLevel) {
          this.$store.dispatch('adminBaseFrame/app/setViewLevel', viewLevel)
        }
      }
    }
  }
}
</script>

<style lang="scss">
  // fix css style bug in open el-dialog
  .el-popup-parent--hidden {
    .fixed-header {
      padding-right: 15px;
    }
  }
</style>

<style lang="scss" scoped>
  .app-wrapper {
    position: relative;
    height: 100%;
    width: 100%;

    &:after {
      content: "";
      display: table;
      clear: both;
    }

    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - 210px);
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: 100%;
  }

  .miniSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }

  .app-main {
    /* 50= navbar  50  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  .fixed-header+.app-main {
    padding-top: 50px;
  }

  .hasTagsView {
    .app-main {
      /* 84 = navbar + tags-view = 50 + 34 */
      min-height: calc(100vh - 84px);
    }

    .fixed-header+.app-main {
      padding-top: 84px;
    }
  }
</style>
