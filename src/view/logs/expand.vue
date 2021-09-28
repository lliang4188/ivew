<template>
  <div>
    <Row>
      <i-col span="24">
        <p>错误内容：{{row.path}} - {{row.method}} - {{ row.code }} </p>
        <p>{{ row.param }}</p>
      </i-col>
      <i-col span="24">
        <p>Stack:</p>
        <p>{{ row.stack }}</p>
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
  }
}
</script>

<style lang="scss" scoped>

</style>
