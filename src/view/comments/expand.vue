<template>
  <div>
    <i-row>
      <i-col span="24">
        <strong>评论用户：{{ row.cuid.name }}</strong>
      </i-col>
      <i-col span="24">
        <strong>评论内容</strong>
        <p>{{ row.content }}</p>
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
  }
}

</script>

<style lang="scss" scoped>

</style>
