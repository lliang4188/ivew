<template>
  <div>
    <i-row
      type="flex"
      aliign="middle"
      justify="center"
      style="margin-bottom: 10px"
    >
      <ButtonGroup class="imooc-btn-group" :class="{ editing: isEdit }">
        <Button size="small" :disabled="isEdit">
          <Dropdown @on-click="addMenu">
            <a href="javascript:void(0)">
              <Icon type="md-add" />
              <span class="imooc-dropdown">新增</span>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="bro">兄弟节点</DropdownItem>
              <DropdownItem name="child" :disabled="menuData.length === 0"
                >子节点</DropdownItem
              >
            </DropdownMenu>
          </Dropdown>
        </Button>
        <Button
          type="primary"
          size="small"
          icon="ios-create"
          @click="editMenu()"
          :disabled="isEdit"
          >修改</Button
        >
        <Button
          type="error"
          size="small"
          @click="deleteMenu()"
          icon="md-trash"
          :disabled="isEdit"
          >删除</Button
        >
      </ButtonGroup>
    </i-row>
    <Tree
      :data="menuData"
      ref="tree"
      @on-select-change="handleTreeChange"
    ></Tree>
  </div>
</template>

<script>
export default {
  name: 'tree',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    menu: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      selectNode: []
    }
  },
  methods: {
    addMenu (type) {
      this.type = type
      if (this.selectNode.length > 0 || this.menuData.length === 0) {
        this.$emit('addMenuEvent', type)
      } else {
        this.$Message.error('请选择菜单节点后再添加！')
      }
    },
    editMenu () {
      if (this.selectNode.length > 0) {
        this.$emit('editMenuEvent', { ...this.selectNode[0] })
      } else {
        this.$Message.error('请选择菜单节点后再编辑！')
      }
    },
    deleteMenu () {
      if (this.selectNode.length > 0 || this.menuData.length === 0) {
        this.$Modal.confirm({
          title: '确定删除吗？',
          content: `删除${this.selectNode[0].title}的菜单吗？`,
          onOk: () => {
            this.$emit('deleteMenuEvent', this.selectNode[0])
            this.selectNode = []
          }
        })
      } else {
        this.$Message.error('请选择菜单节点后再进行删除！')
      }
    },
    handleTreeChange (item) {
      this.selectNode = item
      this.$emit('on-select', item)
    }
  },
  computed: {
    menuData () {
      return this.menu
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
