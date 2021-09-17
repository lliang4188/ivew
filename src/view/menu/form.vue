<template>
  <div>
    <Form
      ref="form"
      :model="formData"
      :rules="formRules"
      :label-width="100"
      :disabled="!isEdit"
    >
      <FormItem label="菜单标题" prop="title">
        <Input v-model="formData.title" placeholder="请输入菜单名称"></Input>
      </FormItem>
      <FormItem label="路径" prop="path">
        <Input v-model="formData.path" placeholder="请输入菜单路由"></Input>
      </FormItem>
      <FormItem label="菜单类型">
        <Select v-model="formData.type" placeholder="请选择菜单类型">
          <Option value="menu">目录</Option>
          <Option value="resouce">资源</Option>
          <Option value="link">链接</Option>
        </Select>
      </FormItem>
      <template v-if="formData.type !== 'link'">
        <FormItem label="组件名称" prop="name">
          <Input v-model="formData.name" placeholder="请输入组件名称"></Input>
        </FormItem>
        <FormItem label="组件">
          <Input v-model="formData.component" placeholder="请输入前端组件名称">
            <span slot="prepend">()=> import('@</span>
            <span slot="append">.vue')</span>
          </Input>
        </FormItem>
        <FormItem label="面包屑显示">
          <Switch v-model="formData.hideInBread" size="large">
            <span slot="open">显示</span>
            <span slot="close">隐藏</span>
          </Switch>
        </FormItem>
        <FormItem label="菜单显示">
          <Switch v-model="formData.hideInMeun" size="large">
            <span slot="open">显示</span>
            <span slot="close">隐藏</span>
          </Switch>
        </FormItem>
        <FormItem label="页面缓存">
          <Switch v-model="formData.notCache" size="large">
            <span slot="open">否</span>
            <span slot="close">是</span>
          </Switch>
        </FormItem>
      </template>
      <template v-else>
         <FormItem label="链接">
          <Input v-model="formData.link" placeholder="请输入跳转链接"></Input>
        </FormItem>
      </template>
      <FormItem label="排序">
        <Input v-model="formData.sort" placeholder="默认排序"></Input>
      </FormItem>
      <FormItem label="图标">
        <Input v-model="formData.icon" placeholder="请输入图标名称"></Input>
      </FormItem>
      <FormItem label="重定向">
        <Input v-model="formData.redirect" placeholder="重定向组件"></Input>
      </FormItem>
      <FormItem v-if="isEdit">
        <Button type="primary" @click="submit()">确定</Button>
        <Button style="margin-left: 8px" @click="cancel()">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      formRules: {
        title: [
          {
            required: true,
            message: '菜单名称不得为空',
            trigger: 'blur'
          }
        ],
        path: [
          {
            required: true,
            message: '菜单路由路径不得为空',
            trigger: 'blur'
          }
        ],
        component: [
          {
            required: true,
            message: '前端组件不得为空',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '组件名称不得为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 校验通过
          const data = {
            ...this.formData,
            expand: true
          }
          this.$emit('submit', data)
          // 恢复到默认状态
          this.initFields()
        } else {
          this.$Message.error('请校验表单数据！')
        }
      })
    },
    cancel () {
      this.initFields()
    },
    initFields () {
      this.$emit('cancel')
      this.$refs.form.resetFields()
    },
    setMenu (data) {
      this.$emit('submit', data)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
