<template>
  <div>
    <i-row type="flex">
      <i-col  class="overtext" span="18" ref="content">{{ row.content }}</i-col>
      <i-col span="6" v-if="show">
        <a @click="more()" style="padding-left: 6px;">更多>></a>
      </i-col>
    </i-row>
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
  data () {
    return {
      show: false
    }
  },
  watch: {
    row (newval, oldval) {
      const elem = this.$refs.content.$el
      if (elem.clientHeigth > 43) {
        this.show = true
      } else {
        this.show = false
      }
    }
  },
  methods: {
    more () {
      this.$Modal.info({
        title: '详情',
        render: (h, params) => {
          return h('Input', {
            props: {
              rype: 'textarea',
              value: JSON.stringify(this.row.content, null, 2),
              row: 16
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
