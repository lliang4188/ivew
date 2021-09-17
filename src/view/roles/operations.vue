<template>
  <div>
     <tables
      ref="tables"
      :columns="columns"
      v-model="localData"
      @on-selection-change="handleSelect"
    >
    </tables>
    <Row type="flex" justify="space-between" align="middle">
      <Col>
        <Page
          v-if="total.length > 0"
          :total="total"
          :current="page"
          :page-size="limit"
          :page-size-opts="pageArr"
          show-elevator
          show-sizer
          show-total
          @on-change="onPageChange"
          @on-page-size-change="onPageSizeChange"
        />
      </Col>
    </Row>
  </div>
</template>

<script>
import Tables from '_c/tables'
export default {
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Tables
  },
  data () {
    return {
      total: 0,
      page: 1,
      limit: 10,
      pageArr: [10, 20, 30, 50, 100],
      selection: [],
      current: 0,
      localData: []
    }
  },

  watch: {
    tableData (newval, oldval) {
      localStorage.setItem('localData', JSON.stringify(newval))
      this.localData = newval
    }
  },
  methods: {
    handleSelect (selection) {
      this.selection = selection
      this.$emit('on-change', selection)
      if (!this.isEdit) {
        setTimeout(() => {
          const tmpData = localStorage.getItem('localData')
          if (typeof tmpData !== 'undefined') {
            this.localData = JSON.parse(tmpData)
          }
          this.$Message.warning('无法修改，请选择权限进行编辑！')
        }, 0)
      }
    },
    handleSearch () {},
    // 批量删除
    handleDeleteBatch () {
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要删除的数据！')
        return
      }
      const msg = this.selection.map((o) => o.name).join(',')
      this.$Modal.confirm({
        title: '确定要删除删除吗？',
        content: `确定要删除${msg}吗`,
        onOk: () => {
          const arr = this.selection.map((o) => o.name)

          // this.localData.splice(index, 1)
          this.localData = this.localData.filter(
            (item) => !arr.includes(item.name)
          )
          this.$Message.success('删除成功！')
          //  this._getList()
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    handleSetBatch () {
      // 批量进行删除
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要删除的数据！')
        return
      }
      // 批量进行设置 -> vip, 禁言, 角色
      this.showSet = true
    },
    // 批量设置模态框
    handleItemSet (setting) {
      const msg = this.selection.map((o) => o.name).join(', ')
      this.$Modal.confirm({
        title: '确定设置吗？',
        content: `确定修改${msg}的资源吗？`,
        onOk: () => {
          const arr = this.selection.map((o) => o.name)
          this.localData.map((item, index) => {
            const tmp = { ...item }
            if (arr.includes(tmp.name)) {
              for (var keys of Object.keys(setting)) {
                tmp[keys] = setting[keys]
              }
              this.$set(this.localData, index, tmp)
            }
          })
          this.$Message.success('批量设置成功！')
        },
        onCancel: () => {
          this.$Message.info('取消操作')
        }
      })
    },
    handleSetChangeEvent (value) {
      this.showSet = value
    },
    handleAdd () {
      this.showModel = true
    },
    handleItemAdd (item) {
      // 每次添加模态框框架触发的添加数据事件
      if (this.showEdit) {
        // 编辑
        this.localData.splice(this.current, 1, item)
        this.showEdit = false
      } else {
        // 新增
        this.localData.push(item)
      }
    },
    handleAddChangeEvent (value) {
      this.showModel = value
    },

    onPageChange (page) {
      this.page = page
    },
    onPageSizeChange (size) {
      this.limit = size
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
