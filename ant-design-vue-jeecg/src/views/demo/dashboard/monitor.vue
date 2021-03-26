<template>
  <div id="app">
    <a-row>
      <a-col :span="6">
        <a-layout>
          <a-layout-content
            style="border-radius: 10px;margin-right: 6px;"
            :style="{ background: '#fff', padding: '0px', margin: 0, minHeight: '200px' }"
          >
            <pie id="pie" :option="option2"/>
          </a-layout-content>
        </a-layout>
      </a-col>
      <a-col :span="6">
        <a-layout>
          <a-layout-content
            style="border-radius: 10px;margin-right: 6px;"
            :style="{ background: '#fff', padding: '0px', margin: 0, minHeight: '200px' }"
          >
            <Bar id="bar" :option="option3"/>
          </a-layout-content>
        </a-layout>
      </a-col>
      <a-col :span="6">
        <a-layout>
          <a-layout-content
            style="border-radius: 10px;margin-right: 6px;"
            :style="{ background: '#fff', padding: '0px', margin: 0, minHeight: '200px' }"
          >
            <Chart id="test" :option="option"/>
          </a-layout-content>
        </a-layout>
      </a-col>
      <a-col :span="6">
        <a-layout>
          <a-layout-content
            style="border-radius: 10px;"
            :style="{ background: '#fff', padding: '0px', margin: 0, minHeight: '200px' }"
          >
            <Bar id="bar" :option="option3"/>
          </a-layout-content>
        </a-layout>
      </a-col>
    </a-row>
    <a-layout style="border-radius: 10px;">
      <a-layout-content
        style="border-radius: 10px;"
        :style="{ margin: '12px 3px', padding: '12px', background: '#fff', minHeight: '280px'}"
      >
        <template>
          <div>
            <a-tabs default-active-key="1" @change="callback">
              <a-tab-pane key="1" tab="CPU">
                <Line-echarts id="line" :option="option4"></Line-echarts>
              </a-tab-pane>
              <a-tab-pane key="2" tab="内存">
                <MemoryLine></MemoryLine>
              </a-tab-pane>
              <a-tab-pane key="3" tab="网络">
                <NetworkLine></NetworkLine>
              </a-tab-pane>
            </a-tabs>
          </div>
        </template>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import Chart from './chart.vue'
import Pie from './pie.vue'
import Bar from './bar.vue'
import LineEcharts from './line.vue'
import echarts from 'echarts'
import axios from 'axios'
import MemoryLine from './memoryLine.vue'
import NetworkLine from './networkLine.vue'
import Mychart from './hdfs.vue'
export default {
    name: 'App',
    data () {
        return {
            HDFSCapacityUsed: 0,
            HDFSCapacityTotal: 0,
            HDFSCapacityRemaining: 0,
            lineOptionXdata: [], // 折线图x轴坐标
            CPUMetrics: 'metrics/cpu/Nice._avg[1589781782,1589785382,15],metrics/cpu/System._avg[1589781782,1589785382,15],metrics/cpu/User._avg[1589781782,1589785382,15],metrics/cpu/Idle._avg[1589781782,1589785382,15]',
            nowStamp: Date.parse(new Date()), // 当前时间戳
            lineOptionYdata: [],
            lineOptionYsystemAVGdata: [],
            // 笔者使用了mock数据代表从服务器获取的数据
            chartData: {
                xData: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
                sData: [5, 20, 36, 10, 10, 70]
            },
            option: {
                title: {
                    text: 'vue-Echarts'
                },
                legend: {
                    data: ['销量']
                },
                xAxis: {
                    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                },
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '销量',
                        type: 'line',
                        data: [5, 20, 36, 10, 10, 70]
                    }
                ]
            },
            option2: {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 10,
                    data: ['HDFS已使用', '非HDFS已使用', 'HDFS未使用']
                },
                series: [
                    {
                        name: 'HDFS容量使用情况',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        hverAnimation: true,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '20',
                                fontWeight: 'bold',
                                formatter: '{a} ({d}%)'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: 306170743302, name: 'HDFS已使用' },
                            { value: 1139293171997, name: '非HDFS已使用' },
                            { value: 8890472219869, name: 'HDFS未使用' }
                        ]
                    }
                ]
            },
            option3: {
                title: {
                    text: '统计总量',
                    textStyle: {
                        fontSize: 16,
                        padding: '10px'
                    }
                },
                legend: {
                    data: ['总量', '分量']
                },
                tooltip: {},
                xAxis: {
                    axisLabel: { show: false }

                },
                yAxis: {
                    splitArea: { show: true },
                    data: ['a', 'b', 'c', 'd']
                },

                series: [
                    {
                        barGap: '-100%', /* 这里设置包含关系，只需要这一句话 */
                        barWidth: 20,
                        data: ['25', '50', '0', '0' ],
                        name: '分量',
                        z: 2, /* 层级提高 */
                        itemStyle: {
                            normal: {
                                color: function (params) {
                                    var colorlist = ['#e5cf0d', '#ff4b54', '#b6a2de', '#5ab1ef']
                                    return colorlist[params.dataIndex]
                                },
                                label: {
                                    show: true,
                                    position: ['600px', '25%'],
                                    distance: 0,
                                    align: 'right',
                                    color: '#fff'
                                }
                            }
                        },
                        type: 'bar'
                    },
                    {
                        barWidth: 20,
                        data: ['100', '60', '30', '10' ],
                        name: '总量',
                        z: 1,
                        itemStyle: {
                            normal: {
                                color: '#dc69aa',
                                label: {
                                    show: false,
                                    position: 'top'
                                }
                            }
                        },
                        type: 'bar'
                    }
                ]
            },
            option4: {
                title: {
                    text: 'CPU使用情况',
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
                    data: ['user', 'system']
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
                    name: 'user',
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
                    name: 'system',
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
    components: {
        Chart,
        Pie,
        Bar,
        LineEcharts,
        MemoryLine,
        NetworkLine,
        Mychart
    },
    mounted () {
        this.refreshData()
        this.hdfsmonitor()
        this.initOneHourDate()
        this.changeOneHourDate()
        this.cpuclust()
        this.yarnApplication()
    },
    methods: {
        hdfsmonitor () {
            axios.get('/hdfs/jmx?qry=Hadoop:service=NameNode,name=FSNamesystemState').then((response) => {
                if (response.data) {
                    this.HDFSCapacityUsed = response.data.beans[0].CapacityUsed
                    this.HDFSCapacityTotal = response.data.beans[0].HDFSCapacityTotal
                    this.HDFSCapacityRemaining = response.data.beans[0].HDFSCapacityRemaining
                    this.option2.series[0].data.value = [this.HDFSCapacityUsed, this.HDFSCapacityTotal, this.HDFSCapacityRemaining]
                }
            }).catch(err => {
                // alert(err + '请求失败')
            })
        },
        callback (key) {
            console.log(key)
        },
        // 添加refreshData方法进行自动设置数据
        refreshData () {
            setInterval(() => {
                this.add()
                this.hdfsmonitor()
            }, 100000)
        },
        add () {
            let data = []
            for (let i = 0; i < 6; i++) { data[i] = Math.ceil(Math.random() * 100) }
            this.option.series[0].data = data
        },
        initOneHourDate () { // 初始化cpu监控的x轴
            this.nowStamp = Date.parse(new Date()) // 毫秒级别的数值被转化为000
            var nowStamp = this.nowStamp
            var lineOptionXdata = this.lineOptionXdata
            for (let i = 0; i < 20; i++) {
                lineOptionXdata.unshift(new Date(nowStamp).getHours() + ':' + new Date(nowStamp).getMinutes())
                nowStamp = nowStamp - 180000
            }
            this.lineOptionXdata = lineOptionXdata
            this.option4.xAxis.data = this.lineOptionXdata
        },
        changeOneHourDate () { // 添加一个最新的时间，并将最早的时间移除
            setInterval(() => {
                this.lineOptionXdata.push(new Date().getHours() + ':' + new Date().getMinutes())
                this.lineOptionXdata.shift()
                this.option4.xAxis.data = this.lineOptionXdata
                this.cpuclust()
            }, 180000)
        },
        cpuclust () { // 初始化CPU集群整体情况
            this.nowStamp = Date.parse(new Date())
            var CPUMetrics = this.CPUMetrics
            var dateString = '[' + (this.nowStamp / 1000 - 3600) + ',' + (this.nowStamp / 1000) + ']'
            console.log(dateString)
            CPUMetrics = 'metrics/cpu/User._avg' + dateString + ',' + 'metrics/cpu/System._avg' + dateString
            axios.get('/ambari/api/v1/clusters/HT706',
                {
                    params: {
                        // metrics/cpu/Nice._avg[1589781782,1589785382,15],metrics/cpu/System._avg[1589781782,1589785382,15],metrics/cpu/User._avg[1589781782,1589785382,15],metrics/cpu/Idle._avg[1589781782,1589785382,15]
                        fields: CPUMetrics
                    },
                    auth: {
                        username: 'admin',
                        password: 'admin'
                    }
                }).then((response) => {
                var userAVGdata = response.data.metrics.cpu['User._avg']
                var systemAVGdata = response.data.metrics.cpu['System._avg']
                var lineYdata = userAVGdata.map(function (item) {
                    return item[0]
                })
                var lineYsystemAVGdata = systemAVGdata.map(function (item) {
                    return item[0]
                })
                var step = parseInt((lineYdata.length / 20))
                for (let i = 0; i < 20; i++) {
                    this.lineOptionYdata[i] = lineYdata[i * step + 1]
                    this.lineOptionYsystemAVGdata[i] = lineYsystemAVGdata[i * step + 1]
                }
                this.option4.series[0].data = this.lineOptionYdata
                this.option4.series[1].data = this.lineOptionYsystemAVGdata
            }).catch(err => {
                // alert(err + '请求失败')
            })
        },
        yarnApplication () {
            axios.get('/yarn/ws/v1/cluster/apps').then((response) => {
                if (response.data) {
                    console.log(response.data.apps)
                    var apps = response.data.apps.app
                    var appSpark = []
                    for (let i = 0; i < apps.length; i++) {
                        if (apps[i].applicationType == 'SPARK') {
                            appSpark.push(apps[i])
                        }
                    }
                    console.log(appSpark)
                }
            }).catch(err => {
                // alert(err + '请求失败')
            })
        }
    }
}
</script>
