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
        @on-selection-change="handleSelect"
        @on-row-remove="handleRowRemove"
        @searchEvent="handleSearch"
      />
      <Row type="flex" justify="space-between" align="middle">
        <Col class="ctrls">
        <Button @click="handleDeleteBatch()">批量删除</Button>
        <Button @click="handleSetBatch()">批量编辑</Button>
        </Col>
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
      </Row>
    </Card>
     <BatchSet
      :isShow="showSet"
      :users="users"
      @editEvent="handleItemSet"
      @changeEvent="handleSetChangeEvent"
    ></BatchSet>
    <edit-model
      :isShow="showEdit"
      :item="currentItem"
      :users="users"
      @editEvent="handleItemEdit"
      @changeEvent="handleChangeEvent"
    ></edit-model>
  </div>
</template>

<script>
import { deleteComents, getCommentsAll, updateCommentId, updateComments } from '@/api/admin'
import dayjs from 'dayjs'
import Tables from '_c/tables'
import BatchSet from './batchSet'
import EditModel from './edit'
import Expand from './expand'
import More from './more'
export default {
  name: 'comments_management',
  components: {
    Tables,
    BatchSet,
    EditModel
  },
  data () {
    return {
      page: 1,
      limit: 10,
      total: 0,
      option: {},
      showEdit: false,
      showSet: false,
      currentIndex: 0,
      currentItem: {},
      selection: [],
      columns: [
        {
          type: 'expand',
          key: 'stack',
          width: 50,
          render: (h, params) => {
            return h(Expand, {
              props: {
                row: params.row
              }
            })
          },
          hidden: true
        },
        {
          type: 'selection',
          width: 60,
          align: 'center',
          hidden: true
        },
        {
          title: '文章标题',
          key: 'tid',
          ellipsis: true,
          tooltip: true,
          minWidth: 400,
          search: {
            type: 'input'
          },
          render: (h, params) => {
            const name = params.row.tid ? params.row.tid.title : '无标题，请核查！'
            return h('div', name)
          }
        },
        {
          title: '文章作者',
          key: 'uid',
          minWidth: 120,
          align: 'center',
          search: {
            type: 'input'
          },
          render: (h, params) => {
            const name = params.row.uid ? params.row.uid.name : '无用户昵称，请核查！'
            return h('div', name)
          }
        },
        {
          title: '评论用户',
          key: 'cuid',
          minWidth: 120,
          align: 'center',
          search: {
            type: 'input'
          },
          render: (h, params) => {
            const name = params.row.cuid ? params.row.cuid.name : '无评论用户昵称，请核查！'
            return h('div', name)
          }
        },
        {
          title: '回复内容',
          key: 'content',
          minWidth: 240,
          search: {
            type: 'input'
          },
          render: (h, params) => {
            return h(More, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: '是否显示',
          key: 'status',
          minWidth: 80,
          render: (h, params) => {
            return h('Icon', {
              props: {
                color: params.row.status === '1' ? '#19be6b' : '#ed4014',
                type: params.row.status === '1' ? 'md-checkmark' : 'md-close'
              }
            })
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
          title: '是否采纳',
          key: 'isBest',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  color: '#19be6b',
                  type: params.row.isBest === '1' ? 'md-checkmark' : '',
                  size: 20
                }
              })
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
              h('span', dayjs(params.row.created).format('YYYY-MM-DD HH:mm:ss'))
            ])
          },
          search: {
            type: 'date'
          }
        },
        {
          title: '设置',
          key: 'settings',
          fixed: 'right',
          width: 160,
          slot: 'action',
          align: 'center',
          hidden: true
        }
      ],
      tableData: [],
      pageArr: [10, 20, 30, 50, 100]
    }
  },
  computed: {
    users () {
      const arr = this.selection.reduce((obj, item) => {
        return {
          ...obj,
          [item.cuid._id]: item.cuid.name
        }
      }, {})
      return arr
    }
  },
  mounted () {
    this.option = { item: 'status', search: '1' }
    this._getList()
  },
  methods: {
    // 批量删除
    handleDeleteBatch () {
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要删除的数据！')
        return
      }
      const msg = this.selection.map((o) => o.title).join(',')
      this.$Modal.confirm({
        title: '确定要删除删除吗？',
        content: `确定要删除${msg}吗`,
        onOk: () => {
          const arr = this.selection.map((o) => o._id)
          deleteComents({ ids: arr }).then((res) => {
            // this.tableData.splice(index, 1)
            this.tableData = this.tableData.filter(
              (item) => !arr.includes(item._id)
            )
            this.$Message.success('删除成功！')
            //  this._getList()
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    handleSetBatch () {
      // 批量进行删除
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要编辑的数据！')
        return
      }
      // 批量进行设置 -> vip, 禁言, 角色
      this.showSet = true
    },
    handleSelect (selection) {
      this.selection = selection
    },
    handleSearch (value) {
      // 判断是否有新的查询内容的传递，把分页数据归0
      // this.option = {}
      // this.page = 1
      if (
        (typeof this.option.search !== 'undefined' &&
          value.search !== this.option.search) ||
        this.option === {}
      ) {
        this.page = 1 // 从1开始
      }
      // if (value.item === 'tags') {
      //   value.item = 'tag'
      // }
      this.option = value
      this._getList()
    },
    handleChangeEvent (value) {
      this.showEdit = value
    },
    handleItemEdit (item) {
      updateCommentId(item).then((res) => {
        if (res.code === 200) {
          this.$Message.success('更新成功')
          this.tableData.splice(this.currentIndex, 1, item)
        }
      })
      this.showEdit = false
    },
    // 批量设置模态框
    handleItemSet (settings) {
      const msg = this.selection.map((o) => o.title).join(',')
      this.$Modal.confirm({
        title: '确定修改吗？',
        content: `修改${msg}的文章吗`,
        onOk: () => {
          const arr = this.selection.map((o) => o._id)
          updateComments({ ids: arr, settings }).then((res) => {
            // this.tableData.splice(index, 1)
            this.tableData.map((item) => {
              if (arr.includes(item._id)) {
                for (var keys of Object.keys(settings)) {
                  item[keys] = settings[keys]
                }
              }
            })
            this.$Message.success('批量设置成功！')
            //  this._getList()
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    handleRowEdit (row, index) {
      this.showEdit = true
      this.currentIndex = index
      this.currentItem = { ...row }
    },
    handleRowRemove (row, index) {
      this.$Modal.confirm({
        title: '确定删除文章吗？',
        content: `删除第${index + 1}条数据，文章标题：“${row.title}”的文章吗`,
        onOk: () => {
          deleteComents({ ids: row._id })
            .then((res) => {
              if (res.code === 200) {
                this.tableData = this.tableData.filter(
                  (item) => item._id !== row._id
                )
                this.$Message.info('成功删除！')
              }
            })
            .catch((err) => {
              this.$Message.info('删除失败！原因：' + err)
            })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    onPageChange (page) {
      this.page = page
      this._getList()
    },
    handleSetChangeEvent (value) {
      this.showSet = value
    },
    onPageSizeChange (size) {
      this.limit = size
      this._getList()
    },
    _getList () {
      getCommentsAll({ page: this.page - 1, limit: this.limit, options: this.option }).then((res) => {
        this.tableData = res.data
        this.total = res.total
      })
    }
  }
}
</script>

<style lang="scss" scoped>
 .ctrls {
   button {
     margin-right: 10px;
   }
 }
</style>
