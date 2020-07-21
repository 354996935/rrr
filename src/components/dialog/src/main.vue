<template>
  <el-dialog
    :width="width"
    :close-on-click-modal="closeOnClickModal"
    :center="center"
    :visible.sync="dialogSetTableVisible"
    :custom-class="customClass"
    :show-close="showClose"
    @open="$_openCallback"
    @close="$_closeCallback"
    @closed="$_closeedCallback"
  >
    <div slot="title">
      {{ title }}
    </div>
    <div>
      <slot />
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="$_confirm">确 定</el-button>
      <el-button @click="$_cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AbDialog',
  props: {
    // 标题
    title: String,
    // 宽度
    width: {
      type: String,
      default: '50%'
    },
    // 自定义类名
    customClass: String,
    // 是否显示关闭按钮
    showClose: {
      type: Boolean,
      default: true
    },
    // 是否可以通过点击 modal 关闭 Dialog
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    // 是否对头部和底部采用居中布局
    center: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogSetTableVisible: false
    }
  },
  methods: {
    // 打开 Dialog
    open() {
      this.dialogSetTableVisible = true
    },
    // 关闭 Dialog
    close() {
      this.dialogSetTableVisible = false
    },
    // Dialog 打开的回调
    $_openCallback() {
      this.$emit('openCallback')
    },
    // Dialog 关闭的回调
    $_closeCallback() {
      this.$emit('closeCallback')
    },
    // Dialog 关闭动画结束的回调
    $_closeedCallback() {
      this.$emit('closeedCallback')
    },
    $_cancel() {
      this.close()
      this.$emit('cancel')
    },
    $_confirm() {
      this.close()
      this.$emit('confirm')
    }

  }
}
</script>
