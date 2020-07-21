<template>
  <section
    class="page-table el-style-extend"
    :class="className"
  >
    <ab-filter
      :filter-list="filterList"
      :filter-btn-list="filterBtnList"
      @handleClick="handleFilterBtnClick"
    />
    <div class="tip fs-12 pd-t5 pd-b5" @click="openSetTdColDialog">温馨提示：点击可设置表格显示内容</div>
    <el-table
      v-if="showTable"
      ref="gTable"
      v-loading="listInfo.loading"
      border
      row-key="id"
      :data="tableData"
      style="width:100%"
      :cell-class-name="cellClassName"
      @select-all="handleSelectionChange"
      @selection-change="handleSelectionChange"
    >
      <!-- 复选框 -->
      <el-table-column
        v-if="hasCheckBox"
        :key="'selection'"
        align="center"
        type="selection"
        width="55"
      />
      <!-- 序号 -->
      <el-table-column
        v-if="showTabIndex"
        :key="'index'"
        align="center"
        label="序号"
        :width="!pageFieldList.length? '' : 80"
        fixed
      >
        <template v-slot="scope">
          <span>{{ scope.$index + 1 + (listInfo.query.curPage - 1) * listInfo.query.pageSize }}</span>
        </template>
      </el-table-column>
      <!-- 表格内容 -->
      <el-table-column
        v-for="(item, index) in pageFieldList"
        :key="`col_${index}`"
        :prop="item.value"
        :fixed="item.fixed"
        align="center"
        :width="item.width"
        :min-width="item.minWidth || '100px'"
        show-overflow-tooltip
        label-class-name="drop-handler"
      >
        <template slot="header">
          {{ item.label }}
        </template>
        <template v-slot="scope">
          <!-- solt 自定义列-->
          <template v-if="item.type === 'slot'">
            <slot
              :name="'col-' + item.value"
              :row="scope.row"
            />
          </template>
          <!-- 标签 -->
          <el-tag v-else-if="item.type === 'tag'">
            {{ scope.row[item.value] }}
          </el-tag>
          <!-- 图片 -->
          <img
            v-else-if="item.type === 'image' && scope.row[item.value]"
            height="50px"
            :src="scope.row[item.value]"
          >
          <!-- 其他 -->
          <span v-else>
            {{ scope.row[item.value] }}
          </span>
        </template>
      </el-table-column>
      <!-- 操作栏 -->
      <el-table-column
        v-if="handle && JSON.stringify(handle) !== '{}'"
        :key="'handle'"
        :fixed="handle.fixed"
        align="center"
        :label="handle.label"
        :width="handle.width"
      >
        <template slot="header">
          <span>{{ handle.label }}</span>
          <!-- <i class="el-icon-setting" @click="openSetTdColDialog" /> -->
        </template>
        <template v-slot="scope">
          <template v-for="(item, index) in handle.btnList">
            <!-- 自定义操作类型 -->
            <slot
              v-if="item.slot"
              :name="'bt-' + item.event"
              :data="{item, row: scope.row}"
            />
            <!-- 操作按钮 -->
            <el-button
              v-if="!item.slot && item.show"
              :key="index"
              v-waves
              size="mini"
              :type="item.type"
              :icon="item.icon"
              :disabled="item.disabled"
              :loading="scope.row[item.loading]"
              @click="handleRowItemClick(item.event, scope.row)"
            >
              {{ item.label }}
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <template>
      <div
        v-show="!listInfo.loading"
        class="pagination-container"
      >
        <el-pagination
          :hide-on-single-page="true"
          :current-page.sync="listInfo.query.curPage"
          :page-sizes="listInfo.pageSizes"
          :page-size="listInfo.query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="listInfo.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </template>
    <!-- 弹窗设置表格 -->
    <AbDialog
      ref="AbDialogRef"
      title="设置"
      width="600px"
      @confirm="setTdColFinish"
      @closeedCallback="closeedCallback"
    >
      <el-checkbox-group
        v-model="needShowTdColList"
        class="g-cb-group"
      >
        <el-checkbox v-for="item in checkboxFieldList" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
      </el-checkbox-group>
    </AbDialog>
  </section>
</template>

<script>
import Sortable from 'sortablejs'
import AbDialog from '../../dialog/src/main'
import AbFilter from '../../filter/src/main'

export default {
  name: 'AbPageTable',
  components: {
    AbDialog,
    AbFilter
  },
  props: {
    // 自定义类名
    className: {
      type: String,
      default: ''
    },
    // 刷新: 在父组件通过设置 refresh = Math.random() 达到刷新目的
    refresh: Number,
    // 获取数据的接口
    apiFn: Function,
    // 表格数据所在字段
    resFieldListStr: {
      type: String,
      default: 'data'
    },
    // 数据总数所在字段
    resFieldTotalStr: {
      type: String,
      default: 'data'
    },
    // 是否显示序号
    showTabIndex: {
      type: Boolean,
      default: false
    },
    // 是否有选择框
    hasCheckBox: {
      type: Boolean,
      default: false
    },
    // 选中列表
    checkedList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 重置当前页
    initCurpage: {
      type: Number,
      default: 1
    },
    // 查询条件
    query: {
      type: Object,
      default: () => {
        return {}
      }
    },
    /**
     * @Array { object }
     * @desc 表格字段配置
     * @property { string } label 表头text
     * @property { string } value 对应列的字段
     * @property { string } width width
     * @property { string } minWidth minWidth
     * @property { string } fixed fixed
     * @property { Boolean } hidden 是否隐藏
     */
    fieldList: {
      type: Array,
      default: () => {
        return []
      }
    },
    /**
     * @prop { object }
     * @desc 操作栏配置
     * @property { string } label 显示文本
     * @property { string } fixed fixed position
     * @property { string } width width
     * @property { [object] } btnList 按钮列表 {label, type, icon, event: event_name, show: Boolean}
     */
    handle: {
      type: Object,
      default() {
        return {}
      }
    },
    // 列表数据
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
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
    filterList: Array,
    /**
     * @Array { object }
     * @desc 搜索栏按钮列表
     * @property { string } label 显示文本
     * @property { string } icon icon
     * @property { string } elType 类型
     * @property { string } event 事件名
     * @property { [string] } reqField 当事件触发时希望得到的数据
     * @property { [object] } dropdownMenu el-dropdown-menu
     */
    filterBtnList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    const FILTER_ACTIONS = new Map([
      ['btn_search', (query) => {
        // do something
      }],
      ['btn_export', () => {
        // do something
      }],
      ['btn_export_cur', () => {
        this.exportData(this.tableData, `-${this.listInfo.query.curPage}`)
      }],
      ['btn_export_all', async() => {
        const allTableData = await this.getAllTableData()
        this.exportData(allTableData, '-all')
      }]
    ])
    return {
      actions: FILTER_ACTIONS,
      // 列表相关
      listInfo: {
        loading: false, // 加载动画
        total: 0, // 总条数
        pageSizes: [10, 20, 50, 100], // 分页数量列表
        query: { // 查询条件
          curPage: 1, // 当前页
          pageSize: 10 // 每页条数
        }
      },
      // 当前拖拽列所在的下标
      actColIdx: null,
      // 需要在表格显示的列
      needShowTdColList: [],
      // 表格列数据 仅用于渲染
      checkboxFieldList: [],
      // 控制表格显示隐藏
      showTable: true,
      // 选中的row
      multipleSelection: []
    }
  },
  computed: {
    // 过滤隐藏的列
    pageFieldList() {
      return this.fieldList.filter(v => !v.hidden)
    }
  },
  watch: {
    initCurpage(nv) {
      this.listInfo.query.curPage = nv
    },
    refresh() {
      if (this.apiFn) {
        this.getList(this.apiFn)
      }
    }
  },
  mounted() {
    this.initEvent()
    this.initCheckboxFieldList()
    this.initColumnDrop()
  },
  methods: {
    // 初始化事件
    initEvent() {
      const { btnList = [] } = this.handle
      const eventList = [...btnList, ...this.filterBtnList]
      for (let i = 0; i < eventList.length; i++) {
        const { event, reqField = [] } = eventList[i]
        this.actions.set(event, () => {
          const data = {}
          reqField.forEach(v => {
            data[v] = this[v] || null
          })
          this.$emit('handleEvent', event, data)
        })
      }
    },
    // 初始化表格复选框列表
    initCheckboxFieldList() {
      this.checkboxFieldList = this.fieldList.map(({ label, value }) => {
        return { label, value }
      })
    },
    // 处理参数
    handleParams() {
      return { ...this.listInfo.query, ...this.query }
    },
    // 得到数据
    getList(api) {
      this.listInfo.loading = true
      return new Promise((resolve, reject) => {
        // 每次调用接口时都自动绑定最新的数据
        api(this.handleParams()).then(res => {
          this.listInfo.loading = false
          // 使外面可以访问到表格数据
          const arr = this.ab_func.safe(res, this.resFieldListStr, [])
          this.$emit('update:tableData', arr)
          this.listInfo.total = this.ab_func.safe(res, this.resFieldTotalStr, 0)
          if (this.hasCheckBox) {
            // 设置当前选中项
            this.checkedList.forEach(selected => {
              const row = arr.find(item => {
                return item.id === selected
              })
              this.$nextTick(() => {
                if (row) {
                  this.$refs.table.toggleRowSelection(row, true)
                }
              })
            })
          }
          resolve(res)
        }).catch(() => {
          this.listInfo.loading = false
          reject()
        })
      })
    },
    // 每页显示条数变化回调
    handleSizeChange(val) {
      const query = this.listInfo.query
      query.pageSize = val // 每页条数
      query.curPage = 1 // 每页条数切换，重置当前页
      this.getList(this.apiFn)
    },
    // 页码改变回调
    handleCurrentChange(val) {
      this.listInfo.query.curPage = val // 当前页
      this.getList(this.apiFn)
    },
    // 派发表格内按钮点击事件
    handleRowItemClick(event, data) {
      this.$emit('handleRowItemClick', event, data)
    },
    // 选中数据
    handleSelectionChange(rows) {
      this.multipleSelection = rows
      this.$emit('handleEvent', 'tableCheck', rows)
    },
    // 列拖拽
    initColumnDrop() {
      const dropWrapper = document.querySelector('.el-table__header-wrapper tr')
      const sortableInstance = Sortable.create(dropWrapper, {
        animation: 180,
        delay: 0,
        handle: '.drop-handler',
        chosenClass: 'act_drop_ele',
        // 元素被选中
        onChoose: evt => {
          // element index within parent
          const { oldIndex } = this.dropEvtHandler(evt)
          this.actColIdx = oldIndex
        },
        // 元素未被选中的时候（从选中到未选中）
        onUnchoose: evt => {
          // same properties as onEnd
          this.actColIdx = null
        },
        onChange: evt => {
          const { newIndex } = this.dropEvtHandler(evt)
          const oldIndex = this.actColIdx
          this.actColIdx = newIndex
          const list = []
          const hiddenList = []
          this.fieldList.forEach(v => {
            v.hidden ? hiddenList.push(v) : list.push(v)
          })
          const oldItem = list[oldIndex]
          list.splice(oldIndex, 1)
          list.splice(newIndex, 0, oldItem)
          this.$emit('update:fieldList', [...list, ...hiddenList])
        }
      })
      this.$once('hook:beforeDestory', () => {
        sortableInstance.destroy()
      })
    },
    // 获取当前拖拽元素的新旧位置
    dropEvtHandler(evt) {
      if (this.hasCheckBox && this.showTabIndex) {
        evt.oldIndex = evt.oldIndex - 2
        evt.newIndex = evt.newIndex - 2
      } else if (this.hasCheckBox || this.showTabIndex) {
        evt.oldIndex = evt.oldIndex - 1
        evt.newIndex = evt.newIndex - 1
      }
      return evt
    },
    // 设置表格单元格class
    cellClassName({ columnIndex }) {
      if (columnIndex === this.actColIdx) {
        return 'act_drop_ele'
      }
      return ''
    },
    // 打开表格显示内容设置
    openSetTdColDialog() {
      this.$refs.AbDialogRef.open()
      this.needShowTdColList = this.pageFieldList.map(v => {
        return v.value
      })
    },
    // 表格设置完成回调
    setTdColFinish() {
      this.fieldList.forEach(v => {
        this.$set(v, 'hidden', !this.needShowTdColList.includes(v.value))
      })
      // 这里通过v-if来让table重新渲染
      this.showTable = false
      this.$nextTick(() => {
        this.showTable = true
      })
    },
    // 表格设置关闭完成回调
    closeedCallback() {
      this.initColumnDrop()
    },
    // 过滤栏按钮点击事件
    handleFilterBtnClick(event, data) {
      this.actions.get(event).call(this, data)
    },
    // 导出数据
    exportData(tableData = [], extendName = '') {
      const allColumns = this.fieldList
      this.ab_func.exportJsonToExcel({ allColumns, tableData, excelName: this.$route.meta.title + extendName })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    async getAllTableData() {
      let arr = []
      for (let i = 0; i < 10; i++) {
        const res = await this.getList(this.apiFn)
        arr = arr.concat(this.ab_func.safe(res, this.resFieldListStr, []))
      }
      return arr
    }
  }
}
</script>

<style lang="scss">
.page-table {
  &.el-style-extend {
    .el-table th {
      padding: 0;
      .cell {
        height: 48px;
        line-height: 48px;
      }
    }
    .el-button span {
      margin-left: 0;
    }
    .drop-handler {
      // cursor: all-scroll;
    }
    .act_drop_ele {
      background-color: #f5f7fa;
    }
    .el-icon-setting {
      position: absolute;
      right: 3px;
      top: 3px;
      font-size: 18px;
      cursor: pointer;
    }
    .g-cb-group {
      .el-checkbox {
        width: 33.33%;
        margin-bottom: 5px;
        width: 100px;
        margin-right: 80px;
        &.is-checked {
          .el-checkbox__label {
            color: #606266;
          }
          .el-checkbox__inner {
            background-color: #fff;
            border-color: #DCDFE6;
            &::after {
              border-color: #1890ff;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.page-table {
  .pagination-container {
    padding: 15px 0;
  }
  .tip {
    color: #909399;
    cursor: pointer;
  }
}
</style>
