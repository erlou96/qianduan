import axios from 'axios'
export default {

    data () {
        return {
            // 存放zkfc的信息
            ZKFCarr: [],
            // datanode的集合
            datanode: [],
            // 已经启动的datanode数量
            datanodeStarted: 0,
            // datanode总数量
            datanodeCount: 0,
            // active Namenode节点状态（是否启动）
            namenodeStateA: '已经停止',
            // standby Namenode节点状态
            namenodeStateB: '已经停止',
            // active节点host
            activeNamenodeHost: '',
            // standby节点host
            standbyNamenodeHost: '',
            // unknown状态的datanode数量
            datanodeUnknown: 0,
            // 死掉状态的datanode数量
            datanodeDied: 0,
            // jour已经启动的数量
            jourStartedCount: 0,
            // jour的总数量
            jourCount: 0,
            // namenode堆总量
            HeapMemoryMax: 'a',
            // namenode堆的使用数
            HeapMemoryUsed: 'n',
            // namenode堆的使用率
            HeapMemoryPercent: '0.0%',
            // 磁盘总量
            CapacityTotalGB: 'a',
            // dfs磁盘使用量
            CapacityUsedGB: 'n',
            // dfs磁盘使用率
            CapacityUsedPercent: '0.0%',
            // 非dfs（本地）磁盘使用量
            CapacityNonDFSUsed: 'n',
            // 非dfs（本地）磁盘使用率
            CapacityNonDFSUsedPercent: '0.0%',
            // 磁盘总空余空间
            CapacityRemainingGB: 'n',
            // 磁盘空余率
            CapacityRemainingGBPercent: '0.0%',
            // 文件块的总数
            BlocksTotal: 'n/a',
            /// /损坏的文件块
            CorruptBlocks: 'n/a',
            // 丢失的文件块
            MissingBlocks: 'n/a',
            // 低于配置副本数的文件块
            UnderReplicatedBlocks: 'n/a',
            // Namenode启动时间
            NamenodeStartTime: '没有启动',
            // 总计文件+目录数
            TotalFiles: 'n/a',
            // 升级状态
            UpgradeFinalized: 'n/a',
            // 安全模式状态
            Safemode: 'n/a',

            // 查询高可用（hdfs、hbase、yarn）的active、standby，以及ZKFC、journalNodes
            HAurl: '/api/v1/clusters/HT706/components/?ServiceComponentInfo/component_name=APP_TIMELINE_SERVER|,' +
        'ServiceComponentInfo/component_name=JOURNALNODE|ServiceComponentInfo/component_name=ZKFC|ServiceComponentInfo/category=MASTER' +
        '&fields=ServiceComponentInfo/service_name,host_components/HostRoles/display_name,host_components/HostRoles/host_name,' +
        'host_components/HostRoles/public_host_name,host_components/HostRoles/state,host_components/HostRoles/maintenance_state,' +
        'host_components/HostRoles/stale_configs,host_components/HostRoles/ha_state,host_components/HostRoles/desired_admin_state,' +
        'host_components/metrics/jvm/memHeapUsedM,host_components/metrics/jvm/HeapMemoryMax,host_components/metrics/jvm/HeapMemoryUsed,' +
        'host_components/metrics/jvm/memHeapCommittedM,host_components/metrics/mapred/jobtracker/trackers_decommissioned,' +
        'host_components/metrics/cpu/cpu_wio,host_components/metrics/rpc/client/RpcQueueTime_avg_time,' +
        'host_components/metrics/dfs/FSNamesystem/*,host_components/metrics/dfs/namenode/Version,' +
        'host_components/metrics/dfs/namenode/LiveNodes,host_components/metrics/dfs/namenode/DeadNodes,' +
        'host_components/metrics/dfs/namenode/DecomNodes,host_components/metrics/dfs/namenode/TotalFiles,' +
        'host_components/metrics/dfs/namenode/UpgradeFinalized,host_components/metrics/dfs/namenode/Safemode,' +
        'host_components/metrics/runtime/StartTime,host_components/metrics/hbase/master/IsActiveMaster,' +
        'host_components/metrics/hbase/master/MasterStartTime,host_components/metrics/hbase/master/MasterActiveTime,' +
        'host_components/metrics/hbase/master/AverageLoad,host_components/metrics/master/AssignmentManger/ritCount,' +
        'host_components/metrics/yarn/Queue,host_components/metrics/yarn/ClusterMetrics/NumActiveNMs,' +
        'host_components/metrics/yarn/ClusterMetrics/NumLostNMs,host_components/metrics/yarn/ClusterMetrics/NumUnhealthyNMs,' +
        'host_components/metrics/yarn/ClusterMetrics/NumRebootedNMs,' +
        'host_components/metrics/yarn/ClusterMetrics/NumDecommissionedNMs&minimal_response=true',
            // 高可用结果集合
            HAnode: []
        }
    },
    methods: {
    // 获取jour,HA等信息
        async getJournalAndHA() {
            var that = this
            // 将ZKFCarr重置
            this.ZKFCarr = []
            this.HAurl = '/api/v1/clusters/HT706/components/?ServiceComponentInfo/component_name=APP_TIMELINE_SERVER|,' +
        'ServiceComponentInfo/component_name=JOURNALNODE|ServiceComponentInfo/component_name=ZKFC|ServiceComponentInfo/category=MASTER' +
        '&fields=ServiceComponentInfo/service_name,host_components/HostRoles/display_name,host_components/HostRoles/host_name,' +
        'host_components/HostRoles/public_host_name,host_components/HostRoles/state,host_components/HostRoles/maintenance_state,' +
        'host_components/HostRoles/stale_configs,host_components/HostRoles/ha_state,host_components/HostRoles/desired_admin_state,' +
        'host_components/metrics/jvm/memHeapUsedM,host_components/metrics/jvm/HeapMemoryMax,host_components/metrics/jvm/HeapMemoryUsed,' +
        'host_components/metrics/jvm/memHeapCommittedM,host_components/metrics/mapred/jobtracker/trackers_decommissioned,' +
        'host_components/metrics/cpu/cpu_wio,host_components/metrics/rpc/client/RpcQueueTime_avg_time,' +
        'host_components/metrics/dfs/FSNamesystem/*,host_components/metrics/dfs/namenode/Version,' +
        'host_components/metrics/dfs/namenode/LiveNodes,host_components/metrics/dfs/namenode/DeadNodes,' +
        'host_components/metrics/dfs/namenode/DecomNodes,host_components/metrics/dfs/namenode/TotalFiles,' +
        'host_components/metrics/dfs/namenode/UpgradeFinalized,host_components/metrics/dfs/namenode/Safemode,' +
        'host_components/metrics/runtime/StartTime,host_components/metrics/hbase/master/IsActiveMaster,' +
        'host_components/metrics/hbase/master/MasterStartTime,host_components/metrics/hbase/master/MasterActiveTime,' +
        'host_components/metrics/hbase/master/AverageLoad,host_components/metrics/master/AssignmentManger/ritCount,' +
        'host_components/metrics/yarn/Queue,host_components/metrics/yarn/ClusterMetrics/NumActiveNMs,' +
        'host_components/metrics/yarn/ClusterMetrics/NumLostNMs,host_components/metrics/yarn/ClusterMetrics/NumUnhealthyNMs,' +
        'host_components/metrics/yarn/ClusterMetrics/NumRebootedNMs,' +
        'host_components/metrics/yarn/ClusterMetrics/NumDecommissionedNMs&minimal_response=true',

            // 发送请求，带用户名和密码

          await  axios.get('/api/' + this.HAurl, {
                auth: {
                    username: 'admin',
                    password: 'admin'
                }
            }).then(function (res) {
                console.log(res.data)
                // 设置变量arr，值为请求回的数据的items属性，这是一个数组
                // var arr = res.data.items
                // 对arr数组进行map遍历
                res.data.items.map(x => {
                    var ZKFCcount = 1

                    // arr数组中每个元素的host_components是一个数组，对该数组进行遍历
                    x.host_components.map(y => {
                        // 创建变量hostroles，接收元素的HostRoles属性
                        var hostroles = y.HostRoles
                        // 判断如果属性的components_name字段是ZKFC，则进行下面操作
                        if (hostroles.component_name == 'ZKFC') {
                            // alert("hbase"+hostroles.host_name+":"+hostroles.state+":"+y.metrics.hbase.master.IsActiveMaster)
                            // 将相应的数据封装成一个类加入到ZKFC的数组中
                            var ZKFCstart = ''
                            if (hostroles.state == 'STARTED') {
                                ZKFCstart = '已经启动'
                            } else if (hostroles.state == 'INSTALLED') {
                                ZKFCstart = '已经停止'
                            } else {
                                ZKFCstart = hostroles.state
                            }
                            that.ZKFCarr.push({
                                // name:"自动故障转移",
                                name: '自动故障转移' + ZKFCcount + '节点',
                                host: hostroles.host_name,
                                state: ZKFCstart
                            })
                            ZKFCcount += 1

                            // 如果是NAMENODE，则进行下面的操作
                        } else if (hostroles.component_name == 'NAMENODE') {
                            // alert("namenode"+hostroles.host_name+":"+hostroles.state+":"+y.metrics.dfs.FSNamesystem.HAState)
                            // 获取active节点的节点名称和启动状态(该条件必须保证state是启动状态，否则返回的数据里面没有FSNamesystem属性，会报错)
                            if (hostroles.state == 'STARTED' && y.metrics.dfs.FSNamesystem.HAState == 'active') {
                                that.activeNamenodeHost = hostroles.host_name
                                that.namenodeStateA = '已经启动'
                                // 获取namenode堆内存总数和已经使用的堆内存，以及使用比例
                                that.HeapMemoryMax = y.metrics.jvm.HeapMemoryMax
                                that.HeapMemoryUsed = y.metrics.jvm.HeapMemoryUsed
                                // 获取dfs分布式数据存储使用的空间以及磁盘总空间
                                var fsName = y.metrics.dfs.FSNamesystem
                                // 磁盘总量
                                that.CapacityTotalGB = fsName.CapacityTotalGB*1024*1024*1024
                                // dfs使用量GB，
                                    that.CapacityUsedGB = fsName.CapacityUsedGB*1024*1024*1024                            
                                // 非dfs磁盘使用量
                                    that.CapacityNonDFSUsed = fsName.CapacityNonDFSUsed
                                // 磁盘总空余空间
                                    that.CapacityRemainingGB = fsName.CapacityRemainingGB*1024*1024*1024
                                
                                // 文件块的总数
                                that.BlocksTotal = fsName.BlocksTotal
                                // 损坏的、丢失的、低于配置副本数的文件块
                                that.CorruptBlocks = fsName.CorruptBlocks
                                that.MissingBlocks = fsName.MissingBlocks
                                that.UnderReplicatedBlocks = fsName.UnderReplicatedBlocks
                                // 总共的文件+目录数
                                that.TotalFiles = fsName.TotalFiles
                                // 获取安全模式和升级状态
                                if (y.metrics.dfs.namenode.UpgradeFinalized) {
                                    that.UpgradeFinalized = '无待升级'
                                } else {
                                    that.UpgradeFinalized = '组件需要升级'
                                }

                                if (y.metrics.dfs.namenode.Safemode == '') {
                                    that.Safemode = '没有处于安全模式'
                                } else {
                                    that.Safemode = '处于安全模式'
                                }
                                // 获取namenode启动时间，并调用formartDate方法（自己编写）转换为正常查看的模式 yyyy-MM-dd hh:mm:ss
                                that.NamenodeStartTime = that.formartDate(y.metrics.runtime.StartTime)
                            } else if (hostroles.state == 'STARTED') {
                                // 获取standby节点的节点名称和启动状态
                                that.standbyNamenodeHost = hostroles.host_name
                                that.namenodeStateB = '已经启动'
                            }
                        }
                    })
                })
            })

          await  axios.get('/api/' + '/api/v1/clusters/HT706/hosts?fields=host_components/HostRoles/state', {
                auth: {
                    username: 'admin',
                    password: 'admin'
                }
            }).then(function (res) {
                // 计数器重置
                that.datanodeCount = 0
                that.datanodeStarted = 0
                that.jourCount = 0
                that.jourStartedCount = 0
                that.datanodeDied = 0
                that.datanodeUnknown = 0
                // 根据返回的数据，设定datanode为返回数据的items属性（是个数组，数组里面包含各种信息）
                that.datanode = res.data.items
                // 打印集群的主机个数
                // alert(that.datanode.length)
                // 对datanode进行遍历，获取需要的信息
                that.datanode.map(x => {
                    // 对items元素x的host-components属性进行遍历
                    x.host_components.map(y => {
                        var hostroles = y.HostRoles
                        // 如果y元素的HostRoles属性的componets_name属性为DATANODE
                        if (hostroles.component_name == 'DATANODE') {
                            // 则Datanode节点计数器+1
                            that.datanodeCount += 1
                            // 如果属性为STATED
                            if (hostroles.state == 'STARTED') {
                                // 则datanodeStarted计数器+1
                                that.datanodeStarted += 1
                            } else if (hostroles.state == 'UNKNOWN') {
                                that.datanodeUnknown += 1
                            } else {
                                that.datanodeDied += 1
                            }
                            // 打印主机名和主机datanode状态
                            // alert(hostroles.host_name+":"+hostroles.state)
                        }
                        if (hostroles.component_name == 'JOURNALNODE') {
                            that.jourCount += 1
                            if (hostroles.state == 'STARTED') {
                                that.jourStartedCount += 1
                            }
                        }
                    })
                })
            })

            return {
                ZKFCarr: this.ZKFCarr,
                datanode: this.datanode,
                datanodeStarted: this.datanodeStarted,
                datanodeCount: this.datanodeCount,
                namenodeStateA: this.namenodeStateA,
                namenodeStateB: this.namenodeStateB,
                activeNamenodeHost: this.activeNamenodeHost,
                standbyNamenodeHost: this.standbyNamenodeHost,
                datanodeUnknown: this.datanodeUnknown,
                datanodeDied: this.datanodeDied,
                jourStartedCount: this.jourStartedCount,
                jourCount: this.jourCount,
                HeapMemoryMax: this.HeapMemoryMax,
                HeapMemoryUsed: this.HeapMemoryUsed,
                HeapMemoryPercent: this.HeapMemoryPercent,
                CapacityTotalGB: this.CapacityTotalGB,
                CapacityUsedGB: this.CapacityUsedGB,
                CapacityUsedPercent: this.CapacityUsedPercent,
                CapacityNonDFSUsed: this.CapacityNonDFSUsed,
                CapacityNonDFSUsedPercent: this.CapacityNonDFSUsedPercent,
                CapacityRemainingGB: this.CapacityRemainingGB,
                CapacityRemainingGBPercent: this.CapacityRemainingGBPercent,
                BlocksTotal: this.BlocksTotal,
                CorruptBlocks: this.CorruptBlocks,
                MissingBlocks: this.MissingBlocks,
                UnderReplicatedBlocks: this.UnderReplicatedBlocks,
                NamenodeStartTime: this.NamenodeStartTime,
                TotalFiles: this.TotalFiles,
                UpgradeFinalized: this.UpgradeFinalized,
                Safemode: this.Safemode
            }
        },

        getDatanode: function () {
            var that = this
            // 访问该页面，页面中有关于state状态的信息
            axios.get('/api/' + '/api/v1/clusters/HT706/hosts?fields=host_components/HostRoles/state', {
                auth: {
                    username: 'admin',
                    password: 'admin'
                }
            }).then(function (res) {
                // 计数器重置
                that.datanodeCount = 0
                that.datanodeStarted = 0
                that.jourCount = 0
                that.jourStartedCount = 0
                that.datanodeDied = 0
                that.datanodeUnknown = 0
                // 根据返回的数据，设定datanode为返回数据的items属性（是个数组，数组里面包含各种信息）
                that.datanode = res.data.items
                // 打印集群的主机个数
                // alert(that.datanode.length)
                // 对datanode进行遍历，获取需要的信息
                that.datanode.map(x => {
                    // 对items元素x的host-components属性进行遍历
                    x.host_components.map(y => {
                        var hostroles = y.HostRoles
                        // 如果y元素的HostRoles属性的componets_name属性为DATANODE
                        if (hostroles.component_name == 'DATANODE') {
                            // 则Datanode节点计数器+1
                            that.datanodeCount += 1
                            // 如果属性为STATED
                            if (hostroles.state == 'STARTED') {
                                // 则datanodeStarted计数器+1
                                that.datanodeStarted += 1
                            } else if (hostroles.state == 'UNKNOWN') {
                                that.datanodeUnknown += 1
                            } else {
                                that.datanodeDied += 1
                            }
                            // 打印主机名和主机datanode状态
                            // alert(hostroles.host_name+":"+hostroles.state)
                        }
                        if (hostroles.component_name == 'JOURNALNODE') {
                            that.jourCount += 1
                            if (hostroles.state == 'STARTED') {
                                that.jourStartedCount += 1
                            }
                        }
                    })
                })
            })
        },

        ht: function () {
            axios.get('/hbase' + '/jmx', {
                auth: {
                    username: 'admin',
                    password: 'admin'
                }
            }).then(function (res) {
                alert(700)
                console.log('----------------------56878gsdfghgjjhgfd--------------------')
                console.log(res.data)
            })
        },
        formartDate (param) {
            let date = new Date(param)
            var Y = date.getFullYear() + '-'
            var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-'
            var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
            var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
            var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
            var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
            return Y + M + D + h + m + s
        }

    }

}
