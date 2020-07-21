<template>
  <el-upload
    ref="abUpload"
    :action="url"
    :headers="headersData"
    :multiple="multiple"
    :auto-upload="autoUpload"
    :data="uploadData"
    :before-upload="uploadBefore"
    :on-remove="uploadRemove"
    :on-progress="uploadProgress"
    :on-success="uploadSuccess"
    :on-error="uploadError"
    :file-list="fileList"
    :list-type="listType"
    :drag="drag"
    :class="[className, 'el-style-extend']"
  >
    <el-button v-if="listType === 'text'" slot="trigger" size="small" type="primary">
      {{ slotTriggerText }}
    </el-button>

    <div v-if="listType === 'picture-card'">
      <i class="el-icon-plus" />
    </div>

    <!-- 拖拽上传 -->
    <div v-if="listType === 'drag'" class="gnete-upload-drag">
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </div>

    <div slot="tip">{{ slotTip }}</div>
  </el-upload>
</template>

<script>
const IMAGE_TYPE_LIST = ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'raw']
export default {
  name: 'AbUpload',
  props: {
    className: String,
    // 上传的地址
    url: {
      type: String,
      default: ''
    },
    // 是否支持上传多个
    multiple: {
      type: Boolean,
      default: true
    },
    // 显示上传的内容
    fileData: {
      type: Array
    },
    // 是否自动上传
    autoUpload: {
      type: Boolean,
      default: true
    },
    // 上传参数
    uploadData: {
      type: Object,
      default() {
        return {}
      }
    },
    // 上传的文件类型
    uploadType: {
      type: String,
      default: 'image'
    },
    drag: Boolean,
    // 上传的文件个数
    uploadNums: {
      type: Number,
      default: -1
    },
    // 文件类型
    listType: {
      type: String,
      default: 'text'
    },
    // el-upload slot trigger text
    slotTriggerText: {
      type: String,
      default: '点击上传'
    },
    // el-upload slot tip text
    slotTip: String,
    displayMod: {
      type: String,
      default: 'btn' // btn: 按钮 drag: 拖拽 plus: 加号
    }
  },
  data() {
    return {
      checkTypeRst: true, // 检查文件类型
      headersData: {}, // 上传的文件数据
      fileList: [] // 上传成功的文件列表
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 组件初始化
    init() {
      // 显示已上传的文件
      if (this.fileData) {
        this.fileList = JSON.parse(JSON.stringify(this.fileData))
      }
    },
    // 检查文件类型
    checkFileType(check) {
      let result = true
      let msg = ''
      switch (this.uploadType) {
        case 'image':
          if (!IMAGE_TYPE_LIST.includes(check)) {
            result = false
            msg = '不支持的图片格式'
          }
          break
      }
      return { msg, result }
    },
    // 文件上传之前
    uploadBefore(file) {
      const fileType = file.name.split('.')
      const len = fileType.length - 1
      // 判断上传文件的后缀名, 将后缀名都转换成小写做比较
      const { result, msg } = this.checkFileType(fileType[len].toLowerCase())
      this.checkTypeRst = result
      if (!this.checkTypeRst) {
        this.$refs.abUpload.abort(file)
        this.$emit('handleEvent', 'uploadTypeError', { msg })
        return
      }
    },
    // 文件上传中
    uploadProgress(event, file, fileList) {
      this.$emit('handleEvent', 'uploadProgress', { event })
    },
    // 文件上传成功
    uploadSuccess(res, file, fileList) {
      // 根据设置的文件个数做处理 -1为无限大
      if (this.uploadNums === -1 || fileList.length < this.uploadNums) {
        this.fileList = fileList
      } else if (fileList.length > this.uploadNums) {
        this.fileList = fileList.slice(0, this.uploadNums)
      }
      this.$emit('handleEvent', 'uploadSuccess', { res })
    },
    // 文件上传失败
    uploadError(error, file, fileList) {
      this.$emit('handleEvent', 'uploadFail', { error })
      // 删除当前文件
      this.delCurFile(file, fileList)
    },
    // 文件移除时
    uploadRemove(file, fileList) {
    },
    // 删除当前文件
    delCurFile(file, fileList = []) {
      fileList.forEach((item, index) => {
        if (JSON.stringify(item) === JSON.stringify(file)) {
          fileList.splice(index, 1)
        }
      })
    }
  }
}
</script>
<style lang="scss">
.el-style-extend {
  .gnete-upload-drag {
    background-color: #fff;
    border-radius: 6px;
    box-sizing: border-box;
    width: 360px;
    height: 180px;
    text-align: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
}
</style>
<style scoped>
</style>
