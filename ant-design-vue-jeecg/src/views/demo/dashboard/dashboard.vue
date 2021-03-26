<template>
  <div id="lineChart" class="chart-container"></div>
</template>

<script type="text/javascript">
import echarts from 'echarts'
export default {
    data () {
        return {
            lineCharts: null,
            lineOption: {
                title: {
                    text: '消费逐月消费趋势'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['差旅', '个人']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                },
                yAxis: {
                    type: 'value',
                    name: '(万)',
                    nameLocation: 'start',
                    nameTextStyle: {
                        fontSize: 14,
                        padding: [0, 50, 0, 0]
                    }
                },
                series: [{
                    name: '差旅',
                    type: 'line',
                    stack: '总量',
                    data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: '个人',
                    type: 'line',
                    stack: '总量',
                    data: [220, 182, 191, 234, 290, 330, 310, 120, 132, 101, 134, 90, 230, 210]
                }
                ]
            }
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.lineCharts = echarts.init(document.getElementById('lineChart'))
            this.lineCharts.setOption(this.lineOption)
            window.addEventListener('resize', this.handleResize)
        })
        // setInterval(() => {
        //     // this.option.xAxis.data.push(xData[i])
        //     this.lineCharts.setOption(this.lineOption)
        //     this.add()
        // }, 10000)
    },
    methods: {
        handleResize () {
            this.lineCharts.resize()
        },
        add () {
          console.log(this.lineOption.series[0].data )
            for (let i = 0; i < 12; i++) { this.lineOption.series[0].data[i] = Math.ceil(Math.random() * 100) }
        }
    }
}
</script>

<style>
  .chart-container {
    border-radius: 4px;
    height: 400px;
    background: #fff;
    box-shadow: 0 1px 10px 2px rgba(182, 191, 196, 0.5);
    padding: 20px;
  }
</style>
