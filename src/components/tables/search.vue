<template>
  <div class="wrapper">
    <template v-if="item.type === 'radio'">
      <RadioGroup @on-change="handleChange" :value="inputValue">
        <Radio
          :label="obj.value"
          v-for="(obj, index) in findalRadio"
          :key="'search-radio-' + index"
        >
          <span>{{ obj.key }}</span>
        </Radio>
      </RadioGroup>
    </template>
    <template v-else-if="item.type === 'date'">
      <DatePicker
        type="daterange"
        placement="bottom-end"
        placeholder="请选择时间段"
        style="width: 200px;"
        @on-change="handleChange"
        :value="inputValue"
      ></DatePicker>
    </template>
    <template v-else-if="item.type === 'select'">
      <Select multiple style="width: 260px" @on-change="handleChange" :value="inputValue">
        <Option
          v-for="obj in item.options"
          :value="obj.value"
          :key="obj.key"
          >{{ obj.key }}</Option
        >
      </Select>
    </template>
    <template v-else>
      <Input
        @on-change="handleChange"
        clearable
        placeholder="输入关键字搜索"
        class="search-input"
        :value="inputValue"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: 'search-item',
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    value: {
      type: [String, Array, Number],
      default: ''
    }
  },
  data () {
    return {
      searchValue: '',
      selection: [],
      radioOptions: [
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
  computed: {

    findalRadio () {
      let result = {}
      if (this.item.type === 'radio') {
        if (this.item.option) {
          result = this.item.option
        } else {
          result = this.radioOptions
        }
      }
      return result
    },
    inputValue () {
      return this.value
    }
  },
  methods: {
    handleClear (e) {
      if (e.target.value === '') this.insideTableData = this.value
    },
    handleChange (value) {
      this.$emit('changeEvent', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper{
  display: inline-block;
  margin: 0 10px;
}
</style>
