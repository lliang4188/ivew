<template>
  <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
import moment from 'dayjs'
const labelOption = {
  show: true,
  position: 'top',
  distance: 6,
  align: 'center',
  verticalAlign: 'middle',
  rotate: 0,
  formatter: '{c}',
  fontSize: 12
  // rich: {
  //   name: {
  //     textBorderColor: '#fff'
  //   }
  // }
}
export default {
  name: 'serviceRequests',
  props: {
    weekData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    }
  },
  mounted () {
    const dateArr = []
    for (let i = 0; i <= 6; i++) {
      dateArr.push(moment().subtract(6 - i, 'day').format('YYYY-MM-DD'))
    }
    const seriesArr = []
    Object.keys(this.weekData).forEach((key) => {
      let name = ''
      if (key === 'user') {
        name = '新增用户'
      } else if (key === 'sign') {
        name = '签到总数'
      } else if (key === 'post') {
        name = '发帖总数'
      } else if (key === 'comments') {
        name = '回复总数'
      }
      seriesArr.push(
        {
          name: name,
          type: 'bar',
          barGap: 0,
          data: this.weekData[key],
          label: labelOption
        }
      )
    })
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: {
        top: '3%',
        left: '1.2%',
        right: '1%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: dateArr
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: seriesArr
    }
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom)
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
