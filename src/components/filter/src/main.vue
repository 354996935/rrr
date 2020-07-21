<template>
  <div
    class="page-filter el-style-extend"
    :class="className"
  >
    <!-- 输入区 -->
    <div v-show="showFilterBar" class="mg-b10">
      <div
        v-for="(item, index) in filterList"
        :key="index"
        class="filter-item"
      >
        <label v-if="item.label" class="filter-label" :style="{width: labelWidth}">{{ item.label }}</label>
        <!-- 输入框 -->
        <el-input
          v-if="item.type === 'input'"
          v-model="searchQuery[item.key]"
          class="filter-input"
          :clearable="true"
          :placeholder="item.placeholder"
          @focus="handleEvent(item.event)"
        />
        <!-- 选择框 -->
        <el-select
          v-if="item.type === 'select'"
          v-model="searchQuery[item.key]"
          class="filter-select"
          :clearable="true"
          :placeholder="item.placeholder"
          @change="handleEvent(item.event)"
        >
          <el-option
            v-for="(opt, optIndex) in item.options"
            :key="optIndex"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <!-- 时间选择框 -->
        <el-time-select
          v-if="item.type === 'time'"
          v-model="searchQuery[item.key]"
          class="filter-time"
          :picker-options="item.TimePickerOptions"
          :clearable="true"
          :placeholder="item.placeholder"
        />
        <!-- 日期选择框 -->
        <el-date-picker
          v-if="item.type === 'date'"
          v-model="searchQuery[item.key]"
          class="filter-date"
          :picker-options="item.datePickerOptions || datePickerOptions"
          :type="item.dateType"
          :clearable="true"
          :placeholder="item.placeholder"
        />
      </div>
    </div>
    <!-- 按钮区 -->
    <div class="btn-warpper">
      <div
        v-for="(item, index) in btnList"
        :key="index"
        :class="['filter-item', `filter-${item.event}`]"
      >
        <el-dropdown v-if="item.dropdownMenu && item.dropdownMenu.length">
          <el-button type="primary">
            {{ item.label }}
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(dItem, dIndex) in item.dropdownMenu"
              :key="dIndex"
              v-interval-click="{func: handleClick, arg: dItem.event}"
            >{{ dItem.label }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
          v-else
          v-waves
          v-interval-click="{func: handleClick, arg: item.event}"
          class="filter-btn"
          :type="item.elType"
          :icon="item.icon"
        >
          {{ item.label }}
        </el-button>
      </div>
      <el-switch
        v-model="showFilterBar"
        active-text="开"
        inactive-text="关"
        class="switch-style"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AbFilter',
  props: {
    // 自定义类名
    className: String,
    /**
     * @Array { object }
     * @desc 搜索栏列表
     * @property { string } label 显示文本
     * @property { string } key form-item绑定的字段
     * @property { string } value form-item绑定字段的默认值
     * @property { string } type form-item类型 input || select || time || date
     * @property { string } event 事件名
     * @property { string } placeholder placeholder
     * @property { [object] } options select element options
     * @property { string } dateType el-date-picker type
     */
    filterList: {
      type: Array,
      default() {
        return []
      }
    },
    useDefaultBtn: {
      type: Boolean,
      default: true
    },
    /**
     * @Array { object }
     * @desc 搜索栏按钮列表
     * @property { string } label 显示文本
     * @property { string } icon icon
     * @property { string } elType 类型
     * @property { string } event 事件名
     * @property { [string] } reqField 当事件触发时希望得到的数据
     * @property { [object] } dropdownMenu el-dropdown-menu {label, event}
     */
    filterBtnList: {
      type: Array,
      default() {
        return []
      }
    },
    // 参数
    query: {
      type: Object,
      default() {
        return {}
      }
    },
    // label width
    labelWidth: {
      type: String,
      default: '80px'
    }
  },
  data() {
    const defaultBtnList = [
      {
        label: '查询',
        icon: 'el-icon-search',
        elType: 'primary',
        event: 'btn_search'
      },
      {
        label: '重置',
        icon: 'el-icon-refresh-right',
        elType: '',
        event: 'btn_reset'
      },
      {
        label: '导出',
        icon: 'el-icon-download',
        elType: 'primary',
        event: 'btn_export',
        dropdownMenu: [
          {
            label: '导出当前',
            event: 'btn_export_cur'
          },
          {
            label: '导出全部',
            event: 'btn_export_all'
          }
        ]
      }
    ]
    return {
      // 默认的按钮
      defaultBtnList,
      // 时间相关设置
      datePickerOptions: {
        disabledDate(time) {
          // 大于当前的时间都不能选 (+十分钟让点击此刻的时候可以选择到当前时间)
          return time.getTime() > +new Date() + 1000 * 600 * 1
        }
      },
      // filter params
      searchQuery: {},
      showFilterBar: true
    }
  },
  computed: {
    btnList() {
      if (this.useDefaultBtn) {
        return [...this.defaultBtnList, ...this.filterBtnList]
      }
      return this.filterBtnList
    }
  },
  mounted() {
    this.initParams()
  },
  methods: {
    // 初始化参数
    initParams() {
      for (let i = 0; i < this.filterList.length; i++) {
        const { key, value } = this.filterList[i]
        this.$set(this.searchQuery, key, value)
      }
    },
    // 绑定的相关事件
    handleEvent(evnet) {
      this.$emit('handleEvent', evnet)
    },
    // 派发按钮点击事件
    handleClick(event) {
      if (event === 'btn_reset') {
        this.initParams()
        return
      }
      this.$emit('handleClick', event, this.searchQuery)
    }
  }
}
</script>

<style lang="scss">
.page-filter.el-style-extend {
  .switch-style .el-switch__label {
    position: absolute;
    display: none;
    color: #fff;
  }
  .switch-style .el-switch__label--left {
    z-index: 9;
    left: 24px;
  }
  .switch-style .el-switch__label--right {
    z-index: 9;
    left: -0;
  }
  .switch-style .el-switch__label.is-active {
    display: block;
  }
  .switch-style.el-switch .el-switch__core,.el-switch .el-switch__label {
    width: 50px !important;
  }
}
</style>
<style lang="scss" scoped>
// 自定义过滤相关
.page-filter {
  display: block;
  padding-bottom: 5px;
  .filter-item {
    display: inline-flex;
    align-items: center;
    margin-bottom: 7px;
    margin-right: 10px;
  }
  .filter-label {
    padding-right: 10px;
    font-size: 14px;
    color: #606266;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align-last: justify
  }
  .filter-input, .filter-time, .filter-date, .filter-select {
    width: 240px;
    margin-right: 10px;
  }
  .btn-warpper {
    position: relative;
    .filter-btn_export {
      position: absolute;
      right: 0;
    }
  }
}
</style>
