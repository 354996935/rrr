<template>
  <div>
    <el-form
      ref="abForm"
      class="page-form"
      :class="className"
      :model="formData"
      :rules="formRules"
      :label-width="labelWidth"
    >
      <el-form-item
        v-for="(item, index) in fieldList"
        :key="index"
        :prop="item.key"
        :label="item.label"
        :class="item.className"
      >
        <!-- solt -->
        <template v-if="item.type === 'slot'">
          <slot :name="'form-' + item.key" />
        </template>
        <!-- 普通输入框 -->
        <el-input
          v-if="item.type === 'text'"
          v-model="formData[item.key]"
          :type="(item.elProp || {}).type"
          :placeholder="item.placeholder"
          :style="{ width: (item.elProp || {}).width + 'px' }"
          @focus="handleEvent(item.event)"
        />
        <!-- 文本输入框 -->
        <el-input
          v-if="item.type === 'textarea'"
          v-model.trim="formData[item.key]"
          :type="item.type"
          :placeholder="item.placeholder"
          :style="{ width: (item.elProp || {}).width + 'px' }"
          :autosize="(item.elProp || {}).autosize || {minRows: 2, maxRows: 10}"
          @focus="handleEvent(item.event)"
        />
        <!-- 计数器 -->
        <el-input-number
          v-if="item.type === 'inputNumber'"
          v-model="formData[item.key]"
          size="small"
          :min="(item.elProp || {}).min"
          :max="(item.elProp || {}).max"
          @change="handleEvent(item.event)"
        />
        <!-- 选择框 -->
        <el-select
          v-if="item.type === 'select'"
          v-model="formData[item.key]"
          :clearable="item.clearable"
          :filterable="item.filterable"
          :placeholder="item.placeholder"
          :style="{ width: (item.elProp || {}).width + 'px' }"
          @change="handleEvent(item.event, formData[item.key])"
        >
          <el-option
            v-for="(optItem, optIndex) in item.props(formData).options"
            :key="optIndex"
            :label="optItem.label"
            :value="optItem.value"
          />
        </el-select>
        <!-- 单选框 -->
        <el-radio-group
          v-if="item.type === 'radio'"
          v-model="formData[item.key]"
        >
          <el-radio v-for="(optItem, optIndex) in item.props(formData).options" :key="optIndex" :label="optItem.value">{{ optItem.label }}</el-radio>
        </el-radio-group>
        <!-- 多选框 -->
        <el-checkbox-group
          v-if="item.type === 'checkbox'"
          v-model="formData[item.key]"
        >
          <el-checkbox v-for="(optItem, optIndex) in item.props(formData).options" :key="optIndex" :label="optItem.value">{{ optItem.label }}</el-checkbox>
        </el-checkbox-group>
        <!-- 日期选择框 -->
        <el-date-picker
          v-if="item.type === 'date'"
          v-model="formData[item.key]"
          :type="item.dateType"
          :picker-options="item.TimePickerOptions"
          :clearable="item.clearable"
          :disabled="item.disabled"
          @focus="handleEvent(item.event)"
        />
      </el-form-item>
    </el-form>
    <slot name="buttons">
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="default" @click="reset">重置</el-button>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'AbForm',
  props: {
    // 自定义类名
    className: String,
    // label宽度
    labelWidth: {
      type: String,
      default: '120px'
    },
    // 验证规则
    formRules: {
      type: Object,
      default() {
        return {}
      }
    },
    /**
     * @Array { object }
     * @desc 表格字段配置
     * @property { string } type el-form-item type 使用对应的控件
     * @property { string } label el-form-item label 表单item对应的文本
     * @property { string } key el-form-item prop 表单item对应的字段
     * @property { any } value el-form-item prop 表单item对应的字段的值
     * @property { string } className el-form-item class
     * @property { string } placeholder placeholder
     * @property { function } props 返回需要使用的字段数据 el-select\el-radio > {options, value: item联动需要强制设置的值, ...arg}
     * @property { function } ifRender 返回Boolean true: 显示 false: 隐藏
     * @property { object } elProp element ui 组件的其他属性
     */
    fieldList: Array
  },
  data() {
    return {
      formData: {}
    }
  },
  watch: {

  },
  created() {
    this.initFormData()
  },
  methods: {
    initFormData() {
      for (let i = 0; i < this.fieldList.length; i++) {
        const { key, value } = this.fieldList[i]
        this.$set(this.formData, key, value)
      }
    },
    // 绑定的相关事件
    handleEvent(evnet) {
      this.$emit('handleEvent', evnet)
    },
    // 派发按钮点击事件
    handleClick(event, data) {
      this.$emit('handleClick', event, data)
    },
    submit() {},
    reset() {}
  }
}
</script>

<style lang="scss" scoped>
// 自定义form相关
.page-form{
  .el-form-item{
    // display: inline-block;
    // float: left;
    // width: 48%;
    .el-form-item__content{
      .el-input, .el-select, .el-textarea{
        // width: 240px;
      }
      .el-input-number{
        .el-input{
          width: inherit;
        }
      }
    }
  }
  .el-form-block{
    display: block;
    width: 100%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
}
.page-form-block{
  .el-form-item{
    display: block;
    .el-form-item__content{
      .el-input, .el-select, .el-textarea{
        width: inherit;
      }
      .el-input-number{
        .el-input{
          width: inherit;
        }
      }
    }
  }
  .el-form-block{
    display: block;
    width: 100%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
}
</style>
