<template>
  <div id="myChart" :style="{width: '1000px', height: '1000px'}"></div>
</template>

<script>
import echarts from 'echarts'
import axios from 'axios'
import hdfs from './hdfs.js'
export default {

    name: 'Hello',
    data () {
        return {
            msg: 'Welcome to Your Vue.js App',
            options: {},
            total: 0,
            hdf: {}
        }
    },
    created () {
        this.getHDFS()
    },
    mounted () {

    },
    methods: {
        async getHDFS () {
            //this.hdf = await hdfs.methods.getJournalAndHA()
            this.op()
            this.drawLine()
        },

        op () {
            var that = this
            var hdfs = this.hdf
            console.log(hdfs)
            var data = [{
                value: hdfs.CapacityUsedGB,
                name: '分布式已用磁盘'
            },
            {
                value: hdfs.CapacityNonDFSUsed,
                name: '本地已用磁盘'
            },
            {
                value: hdfs.CapacityRemainingGB,
                name: '磁盘剩余空间'
            },
            {
                value: 0,
                name: '磁盘总空间'
            }
            ]
            var center = ['50%', '50%']
            var radius = {
                '内': ['54%', '60%'],
                'pie': ['60%', '70%'],
                '中': ['70%', '76%'],
                '外': ['70%', '85%']
            }
            var total = this.total
            var count = 100
            var legenddata = data.map(item => item.name)
            var option = {
                backgroundColor: '#fff',
                tooltip: {
                    trigger: 'item',
                    // formatter: "{a} <br/>{b}:{c} ({d}%)",
                    formatter: function (params, ticket, callback) {
                        var num = 0
                        for (var i = 0; i < data.length; i++) {
                            num = num + data[i].value
                        }
                        var res = '磁盘使用概要<br/>' + params.data.name + ':' + that.formatDisk(params.data.value) + '/' +
                parseFloat(params.data.value / num * 100).toFixed(2) + '%'
                        return res
                    }
                },

                legend: {
                    type: 'plain',

                    orient: 'vertical',
                    // x: 'right',
                    x: 'center',
                    y: 'center',
                    // center: center,
                    // left:"10%",
                    icon: 'circle',
                    data: ['磁盘总空间', '分布式已用磁盘', '本地已用磁盘', '磁盘剩余空间'],
                    formatter: function (name) {
                        var oa = option.series[0].data
                        var num = oa[0].value + oa[1].value + oa[2].value
                        // var num = parseFloat(oa[0].value)+parseFloat(oa[1].value)+parseFloat(oa[2].value)
                        for (var i = 0; i < option.series[0].data.length; i++) {
                            if (name == oa[i].name && name != '磁盘总空间') {
                                return '{name|' + name + '}{rate|' + (oa[i].value / num * 100).toFixed(2) + '%}{value|' + that.formatDisk(
                                    oa[i].value) + '}'
                            } else if (name == oa[i].name && name == '磁盘总空间') {
                                return '{name|' + name + '}{rate|100.00%}{value|' + that.formatDisk(hdfs.CapacityTotalGB) + '}'
                            }
                        }
                    },
                    width: 150,
                    height: 300,
                    padding: [15, 20, 15, 20],
                    borderColor: 'rgba(0,0,0,0.08)',
                    borderWidth: 1,
                    borderRadius: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.3)',
                    shadowBlur: 20,
                    backgroundColor: '#fff',
                    textStyle: {
                        rich: {
                            name: {
                                fontSize: 17,
                                fontWeight: 550,
                                fontFamily: '-webkit-pictograph',
                                width: 130,
                                height: 50
                                // padding: [4,0,4,0]
                            },
                            rate: {
                                fontSize: 17,
                                fontFamily: '-webkit-pictograph',
                                fontWeight: 550,
                                height: 50,
                                width: 80
                                // padding: [0,0,0,0]

                            },
                            value: {
                                fontSize: 17,
                                fontWeight: 550,
                                fontFamily: '-webkit-pictograph',
                                height: 50,
                                width: 60
                                // padding: [0,0,0,0]

                            }
                        }
                    }

                },
                series: [{
                    name: '磁盘使用概要',
                    type: 'pie',
                    radius: radius['pie'],
                    center: center,
                    // left:"10%",
                    avoidLabelOverlap: false,
                    color: ['#4c84ff', '#5b6378', '#ffc400', '#29cb97', '#ff86ad', '#815eff'],
                    label: {
                        normal: {
                            show: false,
                            position: 'center',
                            formatter: '{b}\n\n{c}'
                        },
                        emphasis: {
                            show: false,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data
                    // data2:data
                }, {
                    name: '背景中圆环',
                    type: 'pie',
                    // left:"10%",
                    radius: radius['中'],
                    center: center,
                    color: '#f4f5f6',
                    silent: true,
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [{
                        name: '',
                        value: 100
                    }]
                }, {
                    name: '背景内圆环',
                    type: 'pie',
                    radius: radius['内'],
                    // left:"10%",
                    center: center,
                    color: 'rgba(0,0,0,.1)',
                    silent: true,
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [{
                        name: '',
                        value: 100
                    }]
                }]
            }
            this.options = option
        },

        drawLine () {
        // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById('myChart'))
            // 绘制图表
            myChart.setOption(this.options)
        },

        // 将字节数转换为可读
        formatDisk (value) {
            if (value / 1024 / 1024 / 1024 / 1024 > 1) {
                return parseFloat(value / 1024 / 1024 / 1024 / 1024).toFixed(2) + 'TB'
            } else if (value / 1024 / 1024 / 1024 > 1) {
                return parseFloat(value / 1024 / 1024 / 1024).toFixed(2) + 'GB'
            } else if (value / 1024 / 1024 > 1) {
                return parseFloat(value / 1024 / 1024).toFixed(2) + 'MB'
            } else return value + 'B'
        },
        yarnApplication () {
          axios.get('/yarn/ws/v1/cluster/apps').then((response) => {
              if (response.data) {
                  this.HDFSCapacityUsed = response.data.beans[0].CapacityUsed
                  this.HDFSCapacityTotal = response.data.beans[0].HDFSCapacityTotal
                  this.HDFSCapacityRemaining = response.data.beans[0].HDFSCapacityRemaining
                  this.option2.series[0].data.value = [this.HDFSCapacityUsed, this.HDFSCapacityTotal, this.HDFSCapacityRemaining]
              }
          }).catch(err => {
              // alert(err + '请求失败')
          })
        } 
    }
}
</script>

<style>
</style>

