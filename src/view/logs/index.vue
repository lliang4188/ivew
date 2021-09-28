import dayjs from 'dayjs';
<template>
  <div>
    <Card :dis-hover="true" :shadow="true">
      <Table
        ref="table"
        :columns="columns"
        :data="data"
        :liading="loading"
        @on-selection-change="handleSelect"
      ></Table>
      <Row type="flex" justify="space-between" align="middle">
        <i-col class="ctrls">
         <Button @click="_deleteErrors()">批量删除</Button>
        </i-col>
        <i-col>
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
        </i-col>
      </Row>
    </Card>
  </div>
</template>

<script>
import { deleteErrors, getErrorList } from '@/api/admin'
import Expand from './expand.vue'
import More from './more.vue'
import dayjs from 'dayjs'
export default {
  data () {
    const that = this
    return {
      columns: [
        {
          type: 'expand',
          key: 'stack',
          width: 30,
          render: (h, params) => {
            return h(Expand, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          type: 'selection',
          align: 'center',
          width: 60
        },
        {
          title: '错误消息',
          key: 'message',
          minWidth: 190
        },
        {
          title: '错误码',
          key: 'code',
          align: 'center',
          minWidth: 80,
          filters: [],
          filterMultiple: false,
          filterRemote (value, row) {
            const obj = { ...that.filters }
            if (value[0]) {
              obj[row] = value[0]
            } else {
              delete obj[row]
            }
            that.filters = obj
          }
        },
        {
          title: '请求类型',
          key: 'method',
          align: 'center',
          minWidth: 100,
          filters: [],
          filterMultiple: false,
          filterRemote (value, row) {
            const obj = { ...that.filters }
            if (value[0]) {
              obj[row] = value[0]
            } else {
              delete obj[row]
            }
            that.filters = obj
          }
        },
        {
          title: '请求路径',
          key: 'path',
          minWidth: 200
        },
        {
          title: '请求参数',
          key: 'param',
          minWidth: 200,
          render: (h, params) => {
            return h(More, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: '日期',
          key: 'created',
          align: 'center',
          minWidth: 180,
          render: (h, params) => {
            return h('div', [
              h('span', dayjs(params.row.created).format('YYYY-MM-DD hh:mm:ss'))
            ])
          }
        },
        {
          title: '用户',
          key: 'username',
          align: 'center',
          minWidth: 120
        }
      ],
      data: [],
      filters: {},
      globalFilters: {
        // 全局过滤条件：多条件筛选、分页
        message: undefined,
        code: undefined,
        method: undefined,
        page: { num: 1, limit: 10 }
      },
      page: 1,
      limit: 10,
      total: 0,
      pageArr: [10, 20, 30, 50, 100],
      loading: true,
      selection: []
    }
  },
  watch: {
    filters (newval, oldval) {
      console.log('TCl: -> filters -> newval', newval)
      this._getErrorList()
    }
  },
  mounted () {
    this._getErrorList()
  },
  methods: {
    _deleteErrors () {
      const selection = this.selection
      if (selection.length !== 0) {
        this.$Modal.confirm({
          title: '确认删除',
          content: '确定要删除已选中的错误消息吗？',
          onOk: () => {
            const arr = selection.reduce((obj, item) => {
              return [...obj, item._id]
            }, [])
            deleteErrors({ ids: arr }).then((res) => {
              if (res.code === 200) {
                this.data = this.data.filter((item) => {
                  if (!arr.includes(item._id)) {
                    return item
                  }
                })
                this.$Message.success('删除成功！')
              } else {
                this.$Message.error('删除失败，请联系管理员！')
              }
            })
          }
        })
      } else {
        this.$Modal.error({
          title: '错误',
          content: '请选择要删除的错误消息'
        })
      }
    },
    _getErrorList () {
      getErrorList({
        page: this.page,
        limit: this.limit,
        filter: this.filters || {}
      }).then((res) => {
        if (res.code === 200) {
          this.data = res.data
          this.total = res.total
          this.loading = false
          const keys = Object.keys(res.filters)
          this.columns.map((item) => {
            if (keys.includes(item.key)) {
              if (item.filters.length === 0) {
                item.filters = res.filters[item.key]
              }
            }
          })
        }
      })
    },
    onPageChange (num) {
      // 页码
      this.globalFilters.page.num = num
    },
    onPageSizeChange (num) {
      // 每页显示条数
      this.globalFilters.page.limit = num
    },
    handleSelect (selection) {
      this.selection = selection
    }
  }
}
</script>

<style lang="scss" scoped>
  .ctrls {
    margin-top: 10px;
    button {
      margin-right: 10px;
    }
  }
</style>
