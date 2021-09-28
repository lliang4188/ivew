<template>
  <div>
    <Row type="flex" align="middle" v-if="row.param !==''">
        <i-col class="overtext" span="16">{{ row.param }}</i-col>
        <i-col span="8">
          <a @click="more()" style="padding-left:6px; font-size:12px">更多&gt;&gt;</a>
        </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    more () {
      this.$Modal.info({
        title: '详情',
        // content: JSON.stringify(this.row.param)
        render: (h, params) => {
          return h('Input', {
            props: {
              disable: true,
              type: 'textarea',
              value: JSON.stringify(this.row.param, null, 2),
              rows: 16
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .overtext{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
</style>
