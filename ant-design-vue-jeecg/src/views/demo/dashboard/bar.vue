<template>
  <div :id="id" :style="style"></div>
</template>
<script>
import echarts from 'echarts'
import theme from './monitor.js'
export default {
    name: 'Bar',
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
            default: '100%'
        },
        height: {
            type: String,
            default: '300px'
        },
        option: {
            type: Object,
            // Object类型的prop值一定要用函数return出来，不然会报错。原理和data是一样的，
            // 使用闭包保证一个vue实例拥有自己的一份props
            default () {
                return {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value'
                    },
                    yAxis: {
                        type: 'category',
                        data: ['队列总资源', '队列1', '队列2', '队列3']
                    },
                    series: [
                        {
                            name: '直接访问',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                show: true,
                                position: 'insideRight'
                            },
                            data: [320, 302, 301, 334]
                        },
                        {
                            name: '邮件营销',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                show: true,
                                position: 'insideRight'
                            },
                            data: [120, 132, 101, 134]
                        }
                    ]
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
            return this.option.series[0].data
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
            this.option.series[0].data = newValue
            this.chart.setOption(this.option)
        }
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
