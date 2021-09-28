<template>
  <div>
    <i-row :gutter="10">
      <i-col span="5">
        <Card
          :dis-hover="true"
          :shadow="true"
          style="margin-bottom: 20px"
          class="imooc-card"
        >
          <p slot="title">
            <Icon type="md-contacts"></Icon>
            角色列表
          </p>
          <a slot="extra" @click.prevent="addRoleModel()" v-if="!isEdit">
            <Icon type="ios-add"></Icon>
            新增
          </a>
          <ul>
            <li
              v-for="(item, index) in roles"
              :key="'rolex' + index"
              class="flex"
              @click="selectRole(index)"
              :class="{ selected: roleIndex === index }"
            >
              <div class="flex1">{{ item.name }}</div>
              <span>
                <Icon type="ios-create" size="16" @click.stop="eidtLabel(item, index)" />
                <Icon type="md-build" color="#2d8cf0" size="16" @click.stop="eidtRole(item, index)" />
                <Icon type="md-trash" color="#ed4014" size="16" @click.stop="_deleteRole(item, index)" />
              </span>
            </li>
          </ul>
        </Card>
      </i-col>
      <i-col span="6">
        <Card
          :dis-hover="true"
          :shadow="true"
          style="margin-bottom: 20px"
          title="菜单权限"
          icon="md-menu"
        >
          <div slot="extra">
            <ButtonGroup class="imooc-btn-group" v-if="isEdit">
              <Button
                type="primary"
                size="small"
                icon="ios-create"
                @click="submit()"
                >确定</Button
              >
              <Button
                size="small"
                icon="md-trash"
                @click="cancel()"
                >取消</Button
              >
            </ButtonGroup>
          </div>
          <Tree :data="menuData" show-checkbox @on-select-change="handleTreeChange" @on-check-change="handleTreeChecked"></Tree>
        </Card>
      </i-col>
      <i-col span="13">
        <Card
          :title="$t('resources')"
          icon="md-exit"
          :dis-hover="true"
          :shadow="true"
        >
          <OperationsTable
            :columns="columns"
            :tableData="tableData"
            :isEdit="isEdit"
            @on-change="handleTableChange"
          ></OperationsTable>
        </Card>
      </i-col>
    </i-row>
    <Modal v-model="showAdd" title="添加角色" @on-ok="modelSubmit()" @on-cancel="modelCancel()" :loading="loading">
      <Form :model="formItem" :label-width="80" :rules="formRules" ref="form">
        <FormItem label="角色名称" prop="name">
          <Input
            v-model="formItem.name"
            placeholder="请输入角色名称"
          ></Input>
        </FormItem>
        <FormItem label="角色编码" prop="role">
          <Input
            v-model="formItem.role"
            placeholder="请输入角色编码"
          ></Input>
        </FormItem>
         <FormItem label="角色描述">
          <Input
            v-model="formItem.desc"
            placeholder="请输入角色编码"
          ></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import OperationsTable from './operations.vue'
import { getMenu, getRole, addRole, updateRole, deleteRole } from '@/api/admin'
import { modifyNode, getPropertyIds } from '@/libs/util'
export default {
  name: 'roles',
  components: {
    OperationsTable
  },
  data () {
    return {
      isEdit: false,
      showAdd: false,
      loading: true,
      modelEdit: false,
      editIndex: 0,
      menuData: [],
      roles: [],
      roleIndex: '',
      selectNode: [],
      formItem: {
        name: '',
        role: '',
        desc: ''
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          hidden: true
        },
        {
          title: '资源名称',
          key: 'name',
          search: {
            type: 'input'
          },
          align: 'center'
        },
        {
          title: '资源路径',
          key: 'path',
          search: {
            type: 'input'
          },
          align: 'center'
        },
        {
          title: '请求类型',
          key: 'method',
          search: {
            type: 'input'
          },
          align: 'center',
          render: (h, params) => {
            return h('div', params.row.method.toUpperCase())
          }
        },
        {
          title: '资源类型',
          key: 'type',
          align: 'center',
          search: {
            type: 'radio',
            options: [
              {
                key: '全部',
                value: ''
              },
              {
                key: '接口',
                value: 'btn'
              },
              {
                key: '按钮',
                value: 'btn'
              }
            ]
          }
        },
        {
          title: '资源描述',
          key: 'regmark',
          search: {
            type: 'input'
          }
        }
      ],
      tableData: [],
      formRules: {
        name: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }
        ],
        role: [
          {
            required: true,
            message: '请输入角色编码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    window.vue = this
    this._getMenu()
    this._getRole()
  },
  methods: {
    _getMenu () {
      getMenu().then((res) => {
        if (res.code === 200) {
          this.menuData = res.data
          localStorage.setItem('menuData', JSON.stringify(this.menuData))
        }
      })
    },
    _getRole () {
      getRole().then((res) => {
        if (res.code === 200) {
          this.roles = res.data
        }
      })
    },
    selectRole (vale) {
      if (this.roleIndex === '' || this.roleIndex !== vale) {
        this.roleIndex = vale
        if (this.roles[this.roleIndex].menu.length === 0) {
          modifyNode(this.menuData, null, 'checked', false)
          this.tableData = []
          // this.roleIndex = ''
          return
        }
        // 修改右侧菜单数 + 权限列表的选中状态
        const tmpData = modifyNode(this.menuData, this.roles[this.roleIndex].menu, 'checked', true)
        localStorage.setItem('menuData', JSON.stringify(tmpData))
        if (this.selectNode.length > 0 && this.selectNode[0].operations) {
          this.tableData = this.selectNode[0].operations
        }
      } else {
        modifyNode(this.menuData, null, 'checked', false)
        this.tableData = []
        this.roleIndex = ''
      }
    },
    handleTreeChange (item) {
      if (item.length === 0) {
        return
      }
      this.selectNode = item
      this.tableData = [...item[0].operations]
    },
    handleTreeChecked (item) {
      if (!this.isEdit) {
        const tmpData = localStorage.getItem('menuData')
        if (typeof tmpData !== 'undefined') {
          this.menuData = JSON.parse(tmpData)
        }
        this.$Message.warning('无法修改，请选择权限进行编辑！')
      }
    },
    handleTableChange (table) {
      const ids = table.map((o) => o._id)
      if (this.selectNode.length > 0 && this.selectNode[0].operations) {
        this.selectNode[0].operations.forEach((item) => {
          if (!ids.includes(item._id)) {
            item._checked = false
          } else {
            item._checked = true
          }
        })
      }
      console.log('TCl: -> handleTableChange -> table', this.selectNode[0].operations)
    },
    addRoleModel () {
      this.showAdd = true
    },
    eidtRole (item, index) {
      this.isEdit = true
      this.roleIndex = index
    },
    eidtLabel (item, index) {
      this.modelEdit = true
      this.editIndex = index
      this.showAdd = true
      this.formItem = { ...item }
    },
    _deleteRole (item, index) {
      this.$Modal.confirm({
        title: '确定删除吗？',
        content: `确定要删除${item.name}的角色吗？`,
        onOk: () => {
          this.roles.splice(index, 1)
          deleteRole({ _id: item._id }).then((res) => {
            if (res.code === 200) {
              this.$Message.success('删除成功！')
            }
          })
          //  this._getList()
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    submit () {
      this.isEdit = false
      localStorage.setItem('menuData', JSON.stringify(this.menuData))
      const menu = getPropertyIds(this.menuData, ['children', 'operations'])
      const tmp = { ...this.roles[this.roleIndex] }
      tmp.menu = menu
      this.roles.splice(this.roleIndex, 1, tmp)
      updateRole(tmp).then((res) => {
        if (res.code === 200 && res.data.nModified === 1) {
          this.$Message.success('更新角色权限成功！')
        }
      })
    },
    cancel () {
      this.isEdit = false
      const tmpData = localStorage.getItem('menuData')
      if (typeof tmpData !== 'undefined') {
        this.menuData = JSON.parse(tmpData)
        this.tableData = []
        this.selectNode = []
      }
    },
    modelSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 校验通过后的逻辑
          // 1.获取表单信息
          if (this.modelEdit) {
            const roleData = { _id: this.roles[this.editIndex]._id, ...this.formItem }
            // editIndex
            updateRole(roleData).then((res) => {
              if (res.code === 200 && res.data.nModified === 1) {
                this.roles.splice(this.editIndex, 1, roleData)
              }
              this.$Message.success('更新角色成功！')
            })
          } else {
            // 2.发送创建表单的请求
            addRole(this.formItem).then((res) => {
              if (res.code === 200 && res.data.name !== '') {
                this.roles.push(res.data)
                this.$Message.success('添加角色成功！')
              }
            })
          }

          this.initForm()
        } else {
          this.loading = false
          this.$nextTick(() => (this.loading = true))
          this.$Message.error('请校验表单数据！')
        }
      })
    },
    initForm () {
      this.loading = false
      this.showAdd = false
      this.modelEdit = false
      setTimeout(() => {
        this.$refs.form.resetFields()
      }, 0)
    },
    modelCancel () {
      this.initForm()
    }
  }
}
</script>

<style lang="scss" scoped>
.imooc-card {
  li {
    list-style: none;
    padding: 2px 0;
    &:hover {
      span {
        opacity: 1;
        visibility: visible;
        transform: translateX(0);
        i {
          cursor: pointer;
        }
      }
      .flex1 {
        background-color: #eaf4fe;
      }
    }
  }
  // select #d5e8fc
  // hover #eaf4fe
  span {
    transition: all 0.3s;
    opacity: 0;
    visibility: hidden;
    transform: translateX(50%);
    i {
      margin-right: 5px;
      &:last-child{
        margin-right: 0;
      }
    }
  }
  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-flow: row nowrap;
    .flex1 {
      transition: all 0.2s ease-in-out;
      border-radius: 3px;
      padding: 0 4px;
      cursor: pointer;
    }
    &.selected {
      .flex1 {
        background-color: #d5e8fc;
      }
    }
  }
}
</style>
