<template>
   <div>
    <Card>
      <tables
        ref="tables"
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-row-edit="handleRowEdit"
        @on-row-remove="handleRowRemove"
        @on-selection-change="handleSelect"
        @searchEvent="handleSearch"
      >
      <template v-slot:table-header>
        <Button @click="handleAddUser" class="search-btn" type="default"><Icon type="md-person-add"/>&nbsp;&nbsp;新增用户</Button>
      </template>
      </tables>
      <Row type="flex" justify="space-between" align="middle">
        <Col class="ctrls">
          <Button @click="handleDeleteBatch()">批量删除</Button>
          <Button @click="handleSetBatch()">批量设置</Button>
          <Button type="primary" style="margin: 10px 0" @click="exportExcel"
            ><Icon type="md-download" />下载表格</Button
          >
        </Col>
        <Col>
          <Page
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
    </Card>
     <edit-model
      :isShow="showEdit"
      :item="currentItem"
      :roles="roles"
      @editEvent="handleItemEdit"
      @changeEvent="handleChangeEvent"
    ></edit-model>
     <Add-model
      :isShow="showAdd"
      :item="currentItem"
      :roles="roles"
      @editEvent="handleItemAdd"
      @changeEvent="handleAddChangeEvent"
    ></Add-model>
     <BatchSet
      :isShow="showSet"
      :item="currentItem"
      :roles="roles"
      @editEvent="handleItemSet"
      @changeEvent="handleSetChangeEvent"
    ></BatchSet>
  </div>
</template>

<script>
import { getUserList, updateUserById, deleteUserById, addUser, updateUserBatchById, getRoleNames } from '@/api/admin'
import Tables from '_c/tables'
import dayjs from 'dayjs'
import EditModel from './edit.vue'
import AddModel from './add.vue'
import BatchSet from './batchSet.vue'
export default {
  components: {
    Tables,
    EditModel,
    AddModel,
    BatchSet
  },
  data () {
    return {
      page: 1,
      limit: 10,
      total: 0,
      showEdit: false,
      showAdd: false,
      showSet: false,
      currentIndex: 0,
      currentItem: {},
      options: {},
      roles: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          hidden: true
        },
        {
          title: '用户昵称',
          key: 'name',
          minWidth: 120,
          search: {
            type: 'input'
          }
        },
        {
          title: '登录名',
          key: 'username',
          minWidth: 120,
          search: {
            type: 'input'
          }
        },
        {
          title: '角色',
          key: 'roles',
          align: 'center',
          minWidth: 160,
          render: (h, params) => {
            const roleNames = params.row.roles.map(o => this.roleNames[o]).join(',')
            return h('div', [
              h('span', roleNames)
            ])
          },
          search: {
            type: 'select',
            options: [
              {
                key: '超级管理员',
                value: 'super_admin'
              },
              {
                key: '管理员',
                value: 'admin'
              },
              {
                key: '普通用户',
                value: 'user'
              }
            ]
          }
        },
        {
          title: '积分',
          key: 'favs',
          align: 'center',
          hidden: true,
          minWidth: 80
        },
        {
          title: '是否禁用',
          key: 'status',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.status === '0' ? '否' : '是')
            ])
          },
          search: {
            type: 'radio',
            options: [
              {
                key: '全部',
                value: ''
              },
              {
                key: '否',
                value: '0'
              },
              {
                key: '是',
                value: '1'
              }
            ]
          }
        },
        {
          title: '是否是VIP',
          key: 'isVip',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.isVip === '0' ? '否' : '是')
            ])
          },
          search: {
            type: 'radio',
            options: [
              {
                key: '全部',
                value: ''
              },
              {
                key: '否',
                value: '0'
              },
              {
                key: '是',
                value: '1'
              }
            ]
          }
        },
        {
          title: '创建时间',
          key: 'created',
          align: 'center',
          minWidth: 180,
          render: (h, params) => {
            return h('div', [
              h(
                'span',
                dayjs(params.row.created).format('YYYY-MM-DD HH:mm:ss')
              )
            ])
          },
          search: {
            type: 'date'
          }
        },
        {
          title: '设置',
          key: 'setting',
          slot: 'action',
          hidden: true,
          fixed: 'right',
          width: 160,
          align: 'center'
        }
      ],
      tableData: [],
      pageArr: [10, 20, 30, 50, 100],
      selection: []
    }
  },
  computed: {
    roleNames () {
      const tmp = {}
      this.roles.forEach((item) => {
        tmp[item.role] = item.name
      })
      return tmp
    }
  },
  mounted () {
    this._getList()
    this._getRoleNames()
  },
  methods: {
    handleDeleteBatch () {
      // 批量删除
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要删除的数据！')
        return
      }
      const msg = this.selection.map(o => o.username).join(',')
      this.$Modal.confirm({
        title: '确定删除用户吗？',
        content: `删除${msg}的用户`,
        onOk: () => {
          const arr = this.selection.map(o => o._id)
          deleteUserById(arr).then((res) => {
          // if (res.code === 200) {
          // this.tableData.splice(index, 1)
            this.tableData = this.tableData.filter((item) => !arr.includes(item._id))
            this.$Message.success('删除成功！')
          // this._getList()
          // }
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    handleSetBatch () {
      // 批量设置
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要编辑的数据！')
        return
      }
      // 批量设置 -> Vip，禁言，角色
      this.showSet = true
    },
    handleSelect (selection) {
      this.selection = selection
    },
    handleAddUser () {
      this.showAdd = true
    },
    handleChangeEvent (value) {
      this.showEdit = value
    },
    handleAddChangeEvent (value) {
      this.showAdd = value
    },
    handleSetChangeEvent (value) {
      this.showSet = value
    },
    // 添加模态框
    handleItemAdd (item) {
      addUser(item).then((res) => {
        if (res.code === 200) {
          console.log('更新成功')
          this.tableData.splice(0, 0, res.data)
        }
      })
    },
    // 编辑模态框
    handleItemEdit (item) {
      updateUserById(item).then((res) => {
        if (res.code === 200) {
          // this.$Message.success('更新成功')
          this.tableData.splice(this.currentIndex, 1, item)
        }
      })
      this.showEdit = false
    },
    // 批量编辑模态框
    handleRowEdit (row, index) {
      this.showEdit = true
      this.currentIndex = index
      this.currentItem = { ...row }
    },
    // 批量设置模态框
    handleItemSet (settings) {
      const msg = this.selection.map(o => o.username).join(',')
      this.$Modal.confirm({
        title: '确定修改用户吗？',
        content: `删除${msg}的用户`,
        onOk: () => {
          const arr = this.selection.map(o => o._id)
          updateUserBatchById({ ids: arr, settings }).then((res) => {
          // if (res.code === 200) {
          // this.tableData.splice(index, 1)
            this.tableData = this.tableData.map(
              (item) => {
                if (arr.includes(item._id)) {
                  for (const keys of Object.keys(settings)) {
                    item[keys] = settings[keys]
                  }
                }
              })
            this.$Message.success('删除成功！')
          // this._getList()
          // }
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    handleRowRemove (row, index) {
      this.$Modal.confirm({
        title: '确定删除用户吗？',
        content: `删除${row.name}的用户`,
        onOk: () => {
          deleteUserById(row._id).then((res) => {
            if (res.code === 200) {
              this.tableData.splice(index, 1)
              this.$Message.success('删除成功！')
            }
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    handleSearch (value) {
      // 判断是否有新的查询内容传递，把分页数据归0
      if ((typeof this.options.search !== 'undefined' && value.search !== this.options.search) || this.options === {}) {
        this.page = 1
      }
      this.options = value
      this._getList()
    },
    onPageChange (page) {
      this.page = page
      this._getList()
    },
    onPageSizeChange (size) {
      this.limit = size
      this._getList()
    },
    _getList () {
      getUserList({ page: this.page - 1, limit: this.limit, options: this.options }).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data
          this.total = res.total
        }
      })
    },
    _getRoleNames () {
      getRoleNames().then((res) => {
        if (res.code === 200) {
          this.roles = res.data
        }
      })
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .ctrls{
    button{
      margin-right: 10px;
      &:last-child{
        margin-right: 0;
      }
    }
  }
</style>
