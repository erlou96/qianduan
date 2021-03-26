<template>
  <div :id="id" :style="style"></div>
</template>
<script>
import echarts from 'echarts'
import theme from './monitor.js'

export default {
    name: 'Line-echarts',
    data () {
        return {
            // echarts实例
            chart: ''
        }
    },
    props: {
    // 父组件需要传递的参数：id，width，height，option
        id: {
            type: String
        },
        width: {
            type: String,
            default: '90%'
        },
        height: {
            type: String,
            default: '400px'
        },
        option: {
            type: Object,
            // Object类型的prop值一定要用函数return出来，不然会报错。原理和data是一样的，
            // 使用闭包保证一个vue实例拥有自己的一份props
            default () {
                return {
                  legend: {
                      right: 20,
                      orient: 'vertical',
                      data: ['今日', '昨日']
                  }
                }
            }
        }
    },
    computed: {
        style () {
            return {
                height: this.height,
                width: this.width
            }
        },
        data () {
            return this.option.xAxis.data
        },
        ydata () {
            return this.option.series[0].data
        },
        ydata2 () {
            return this.option.series[1].data
        }
    },
    mounted () {
        this.init()
    },
    watch: {
        // 观察option的变化
        // option: {
        //     handler (newVal, oldVal) {
        //       console.log(newVal )
        //         if (this.chart) {
        //             if (newVal) {
        //                 this.chart.setOption(newVal)
        //             } else {
        //                 this.chart.setOption(oldVal)
        //             }
        //         } else {
        //             this.init()
        //         }
        //     },
        //     deep: true // 对象内部属性的监听，关键。
        // }
        data (newValue, OldValue) {
            console.log(newValue)
            this.option.xAxis.data = newValue
            this.chart.setOption(this.option)
            this.chart.setOption({
                legend: {
                    selected: {
                        'user': false,
                        'system': false
                    }
                }
            })
            this.chart.setOption({
                legend: {
                    selected: {
                        'user': true,
                        'system': true
                    }
                }
            })
        },
        ydata (newValue, OldValue) {
            console.log(newValue)
            this.option.series[0].data = newValue
            // this.option.series = newValue
            this.chart.setOption(this.option)
            this.chart.setOption({
                legend: {
                    selected: {
                        'user': false,
                        'system': false
                    }
                }
            })
            this.chart.setOption({
                legend: {
                    selected: {
                        'user': true,
                        'system': true
                    }
                }
            })
        },
        ydata2 (newValue, OldValue) {
            console.log(newValue)
            this.option.series[1].data = newValue
            //this.option.series = newValue
            this.chart.setOption(this.option)
            this.chart.setOption({
                legend: {
                    selected: {
                        '今日': false,
                        '昨日': false
                    }
                }
            })
            this.chart.setOption({
                legend: {
                    selected: {
                        '今日': true,
                        '昨日': true
                    }
                }
            })
        },
    },
    methods: {
        init () {
            this.chart = echarts.init(document.getElementById(this.id))
            window.addEventListener('resize', this.chart.resize)
            this.chart.setOption(this.option)
        }
    }
}
</script>
