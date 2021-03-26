
<template>
  <div id="memoryLineChart" :style="{width: '90%', height: '400px'}"></div>
</template>

<script>
import echarts from 'echarts'
import axios from 'axios'
export default {

    name: 'MemoryLine',
    data () {
        return {
            lineOptionXdata: [], // 折线图x轴坐标
            memoryMetrics: 'metrics/cpu/Nice._avg[1589781782,1589785382,15],metrics/cpu/System._avg[1589781782,1589785382,15],metrics/cpu/User._avg[1589781782,1589785382,15],metrics/cpu/Idle._avg[1589781782,1589785382,15]',
            nowStamp: Date.parse(new Date() - 180000000), // 当前时间戳
            lineOptionYdata: [],
            lineYtotalAVGdata: [],
            options: {
                title: {
                    text: '内存使用情况',
                    left: '50%',
                    textAlign: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        lineStyle: {
                            color: '#ddd'
                        }
                    },
                    backgroundColor: 'rgba(255,255,255,1)',
                    padding: [5, 10],
                    textStyle: {
                        color: '#7588E4'
                    },
                    extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
                },
                legend: {
                    right: 20,
                    orient: 'vertical',
                    data: ['总内存', '缓存']
                },
                xAxis: {
                    type: 'category',
                    data: ['00:00', '2:00', '4:00', '6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
                    boundaryGap: false,
                    splitLine: {
                        show: true,
                        interval: 'auto',
                        lineStyle: {
                            color: ['#D4DFF5']
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#609ee9'
                        }
                    },
                    axisLabel: {
                        margin: 10,
                        textStyle: {
                            fontSize: 14
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        lineStyle: {
                            color: ['#D4DFF5']
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#609ee9'
                        }
                    },
                    axisLabel: {
                        margin: 10,
                        textStyle: {
                            fontSize: 14
                        }
                    }
                },
                series: [{
                    name: '缓存',
                    type: 'line',
                    smooth: true,
                    showSymbol: false,
                    symbol: 'circle',
                    symbolSize: 6,
                    data: ['1200', '1400', '1008', '1411', '1026', '1288', '1300', '800', '1100', '1000', '1118', '1322'],
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(199, 237, 250,0.5)'
                            }, {
                                offset: 1,
                                color: 'rgba(199, 237, 250,0.2)'
                            }], false)
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#f7b851'
                        }
                    },
                    lineStyle: {
                        normal: {
                            width: 3
                        }
                    }
                }, {
                    name: '总内存',
                    type: 'line',
                    smooth: true,
                    showSymbol: false,
                    symbol: 'circle',
                    symbolSize: 6,
                    data: ['1200', '1400', '808', '811', '626', '488', '1600', '1100', '500', '300', '1998', '822'],
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(216, 244, 247,1)'
                            }, {
                                offset: 1,
                                color: 'rgba(216, 244, 247,1)'
                            }], false)
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#58c8da'
                        }
                    },
                    lineStyle: {
                        normal: {
                            width: 3
                        }
                    }
                }]
            }
        }
    },
    mounted () {
        this.setxAxis()
        // this.changeOneHourDate()
        this.drawLine()
        this.setOptions()
        this.memoryclust()
    },
    methods: {
        drawLine () {
            let mychart = echarts.init(document.getElementById('memoryLineChart'))
            mychart.setOption(this.options)
        },
        setOptions () {
            setInterval(() => {
                this.setxAxis()
                this.memoryclust()
            }, 180000)
        },
        setxAxis () {
            this.nowStamp = Date.parse(new Date()) - 180000 // 毫秒级别的数值被转化为000
            var nowStamp = this.nowStamp
            this.lineOptionXdata = []
            var lineOptionXdata = this.lineOptionXdata
            for (let i = 0; i < 20; i++) {
                lineOptionXdata.unshift(new Date(nowStamp).getHours() + ':' + new Date(nowStamp).getMinutes())
                nowStamp = nowStamp - 180000
            }
            this.lineOptionXdata = lineOptionXdata
            this.options.xAxis.data = this.lineOptionXdata
            console.log('memeory' + this.lineOptionXdata)
        },
        memoryclust () { // 初始化CPU集群整体情况
            this.nowStamp = Date.parse(new Date()) - 180000
            var memoryMetrics = this.memoryMetrics
            var dateString = '[' + (this.nowStamp / 1000 - 3600) + ',' + (this.nowStamp / 1000) + ']'
            console.log(dateString)
            memoryMetrics = 'metrics/memory/Cache._avg' + dateString + ',' + 'metrics/memory/Total._avg' + dateString
            axios.get('/ambari/api/v1/clusters/HT706',
                {
                    params: {
                        // metrics/cpu/Nice._avg[1589781782,1589785382,15],metrics/cpu/System._avg[1589781782,1589785382,15],metrics/cpu/User._avg[1589781782,1589785382,15],metrics/cpu/Idle._avg[1589781782,1589785382,15]
                        fields: memoryMetrics
                    },
                    auth: {
                        username: 'admin',
                        password: 'admin'
                    }
                }).then((response) => {
                var cacheAVGdata = response.data.metrics.memory['Cache._avg']
                var totalAVGdata = response.data.metrics.memory['Total._avg']
                var lineYdata = cacheAVGdata.map(function (item) {
                    return item[0] / 1024 / 1024
                })
                var lineYtotalAVGdata = totalAVGdata.map(function (item) {
                    return item[0] / 1024 / 1024
                })
                var step = parseInt((lineYdata.length / 20))
                for (let i = 0; i < 20; i++) {
                    this.lineOptionYdata[i] = lineYdata[i * step + 1]
                    this.lineYtotalAVGdata[i] = lineYtotalAVGdata[i * step + 1]
                }
                this.options.series[0].data = this.lineOptionYdata
                this.options.series[1].data = this.lineYtotalAVGdata
                this.drawLine()
            }).catch(err => {
                // alert(err + '请求失败')
            })
        }
    }
}
</script>

<style>
</style>
