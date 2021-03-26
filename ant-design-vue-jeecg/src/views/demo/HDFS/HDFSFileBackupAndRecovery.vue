<template>
  <div>
    <a-layout-content
      :style="{ margin: '10px 15px', padding: '10px 20px', background: '#fff', minHeight: '800px' }"
    >
      <a-tabs defaultActiveKey="1">
        <a-tab-pane key="1">
          <span slot="tab">
            <a-icon type="profile" />
            HDFS文件备份
          </span>
          <span>
            <a-input-search
              style="max-width: 60%;"
              placeholder="input search text"
              @search="onSearch"
              enterButton
              size="large">
            </a-input-search>
            <a-button style="margin-bottom: 20px;float: right;width: 100px;font-size: 15px;" type="primary" size="large" @click="showAddPolicy">添加策略</a-button>
            <a-modal title="添加策略" v-model="addPolicyVisible" @ok="handleOk">
              <label style="font-weight: bold; font-size: initial;">选择文件或目录:</label>
              <a-tree-select
                treeDataSimpleMode
                style="width: 100%;margin-top: 10px;"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="treeData"
                placeholder="Please select"
                :loadData="onLoadData"
                v-model="value"
              />
              <div>
                <label style="font-weight: bold; font-size:initial;margin-right: 15px;">选择备份周期:</label>
                <a-radio-group class="radio" name="backupTimeRadioGroup" @change="onChange" :defaultValue="1" v-model="backupTimeValue">
                  <a-radio :value="1">3天</a-radio>
                  <a-radio :value="2">7天</a-radio>
                  <a-radio :value="3">15天</a-radio>
                  <a-radio :value="4">30天</a-radio>
                </a-radio-group>
              </div>
              <div>
                <label style="font-weight: bold; font-size:initial;margin-right: 15px;">是否立即备份:</label>
                <a-radio-group class="radio" @change="radioGrouponChange" name="radioGroup" :defaultValue="0" v-model="radioGroupValue">
                  <a-radio :value="0">否</a-radio>
                  <a-radio :value="1">是</a-radio>
                </a-radio-group>
              </div>
              <div style="margin-top: 15px;">
                <label style="font-weight: bold; font-size:initial;margin-right: 15px;">描述:</label>
                <a-textarea placeholder="请输入定时备份任务描述" :rows="4" v-model="desc"/>
              </div>
            </a-modal>
          </span>

          <a-table :columns="columns" :dataSource="data" bordered>
            <template slot="name" slot-scope="text">
              <a>{{ text }}</a>
            </template>
            <template slot="title" slot-scope="currentPageData">
              <label class="table_font">HDFS文件备份策略</label>
            </template>
            <template slot="customRenderStatus" slot-scope="status">
              <a-tag v-if="status==0" color="green">已启动</a-tag>
              <a-tag v-if="status==-1" color="orange">已暂停</a-tag>
            </template>
            <template slot="operation" slot-scope="text,record">
              <a-tooltip placement="topLeft" title="编辑" arrowPointAtCenter>
                <a-button
                  style="margin-right: 15px;"
                  type="primary"
                  hape="circle"
                  icon="edit"
                  size="small"
                  @click="edit"/></a-button>
              </a-tooltip>
              <a-tooltip placement="topLeft" title="删除" arrowPointAtCenter>
                <a-button
                  style="margin-right: 15px;"
                  type="danger"
                  shape="circle"
                  icon="delete"
                  size="small"
                  @click="deletePolicy(record)"/></a-button>
              </a-tooltip>

              <a @click="resumeJob(record)" v-if="record.status==-1">启动</a>
              <a @click="pauseJob(record)" v-if="record.status==0">停止</a>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2">
          <span slot="tab">
            <a-icon type="rollback" />
            HDFS文件恢复
          </span>
          nihao
        </a-tab-pane>
      </a-tabs>
      <HDFSBackModal
        ref="collectionForm"
        :visible="visible"
      ></HDFSBackModal>
    </a-layout-content>
  </div>

</template>

<script>
import axios from 'axios'
import HDFSBackModal from './HDFSBackModal.vue'
axios.defaults.timeout = 60000

const columns = [
    {
        title: '文件名/文件',
        dataIndex: 'name',
        scopedSlots: { customRender: 'name' }
    },
    {
        title: '全路径',
        dataIndex: 'value'
    },
    {
        title: '备份周期',
        dataIndex: 'backupCycle'
    },
    {
        title: '时间表达式',
        dataIndex: 'cronExpression'
    },
    {
        title: '创建时间',
        dataIndex: 'createTime'
    },
    {
        title: '描述',
        dataIndex: 'description'
    },
    {
        title: '状态',
        align: 'center',
        dataIndex: 'status',
        scopedSlots: { customRender: 'customRenderStatus' },
        filterMultiple: false,
        filters: [
            { text: '已启动', value: '0' },
            { text: '已暂停', value: '-1' }
        ]
    },
    {
        title: '操作',
        dataIndex: 'action',
        className: 'operation',
        scopedSlots: { customRender: 'operation' }
    }
]

export default {
    components: {
        HDFSBackModal
    },
    data () {
        return {
            data: [],
            columns,
            visible: false,
            addPolicyVisible: false, // 添加策略对话框
            backupTimeValue: 1,
            radioGroupValue: 0,
            desc: '',
            value: undefined,
            treeData: [
                { id: '/', pId: 0, value: 'hdfs://udap69a165/', title: '/' } // 默认的HDFS根路径
            ],
            childTreeData: []
        }
    },
    created () {
        this.HDFSBackPolicy()
    },
    methods: {
        showAddPolicy () {
            this.addPolicyVisible = true
        },
        handleOk () {
            var value = this.value
            var backupTimeValue = this.backupTimeValue
            var radioGroupValue = this.radioGroupValue
            var desc = this.desc
            var name = value.substr(value.lastIndexOf('/') + 1, value.length)
            console.log(name)
            if (backupTimeValue == '1') {
                backupTimeValue = '0 0 0 1/3 * ?'
            } if (backupTimeValue == '2') {
                backupTimeValue = '0 0 0 1/7 * ?'
            } if (backupTimeValue == '3') {
                backupTimeValue = '0 0 0 1/15 * ?'
            } if (backupTimeValue == '4') {
                backupTimeValue = '0 0 0 1/30 * ?'
            }
            if (radioGroupValue == '1') {
                this.HDFSFileBackup(value)
                this.addJob(name, value, backupTimeValue, desc)
            } else {
                this.addJob(name, value, backupTimeValue, desc)
            }
            console.log(value)
            this.addPolicyVisible = false
        },
        onChange (e) {
            console.log('radio checked', e.target.value)
        },
        radioGrouponChange (e) {
            console.log('radio2 checked', e.target.value)
        },
        onSearch (value) {
            console.log(value)
        },
        genTreeNode (parentId, isLeaf = false) {
            const random = Math.random()
                .toString(36)
                .substring(2, 6)
            return {
                id: random,
                pId: parentId,
                value: random,
                status: false,
                title: isLeaf ? 'Tree Node' : 'Expand to load',
                isLeaf
            }
        },
        onLoadData (treeNode) { // 加载根节点方法
            const { value } = treeNode.dataRef
            this.HDFSFileTreeData(value)
            return new Promise(resolve => {
                // const { value } = treeNode.dataRef;
                setTimeout(() => {
                    // this.HDFSFileTreeData(value);
                    resolve()
                    console.log(this.treeData)
                }, 3000)
            })
        },
        HDFSBackPolicy () {
            var result = []
            const that = this
            console.log('fasongqingqiu')
            axios.get(window._CONFIG['domianURL']+'/HDFSbBackup/policy', { params: { pageNo: 1, pageSize: 10 } })
                .then(function (response) {
                    result = response.data.result.records
                    that.data = result
                    console.log(that.data)
                }).catch(function (reason) {
                    // alert("请求错误"+reason);
                })
        },
        changeCheck () {
            this.status = false
        },
        addJob (name, value, backupTimeValue, desc) {
            const that = this
            let data = { 'name': name, 'value': value, 'cronExpression': backupTimeValue, 'status': 0, 'description': desc }
            axios.post(window._CONFIG['domianURL'] + '/HDFSbBackup/policy', data)
                .then(function (response) {
                    if (response.data.success) {
                        that.$message.success(response.data.message)
                        that.HDFSBackPolicy()
                    } else {
                        that.$message.warning(response.data.message)
                    }
                }).catch(function (reason) {
                    // alert("请求错误"+reason);
                })
        },
        resumeJob (record) {
            const that = this
            axios.get(window._CONFIG['domianURL']+'/HDFSbBackup/resume', { params: { id: record.id } })
                .then(function (response) {
                    if (response.data.success) {
                        that.$message.success(response.data.message)
                        that.HDFSBackPolicy()
                    } else {
                        that.$message.warning(response.data.message)
                    }
                }).catch(function (reason) {
                    // alert("请求错误"+reason);
                })
        },
        pauseJob (record) {
            const that = this
            axios.get(window._CONFIG['domianURL'] + '/HDFSbBackup/pause', { params: { id: record.id } })
                .then(function (response) {
                    if (response.data.success) {
                        that.$message.success(response.data.message)
                        that.HDFSBackPolicy()
                    } else {
                        that.$message.warning(response.data.message)
                    }
                }).catch(function (reason) {
                    // alert("请求错误"+reason);
                })
        },
        deletePolicy (record) {
            const that = this
            axios.delete(window._CONFIG['domianURL'] + '/HDFSbBackup/policy', { params: { id: record.id } })
                .then(function (response) {
                    if (response.data.success) {
                        that.$message.success(response.data.message)
                        that.HDFSBackPolicy()
                    } else {
                        that.$message.warning(response.data.message)
                    }
                }).catch(function (reason) {
                    // alert("请求错误"+reason);
                })
        },
        edit () {
            this.visible = true
        },
        HDFSFileBackup (value) {
            var that = this
            axios.get(window._CONFIG['domianURL'] + '/hdfs/backup', { params: { dfspath: value }, setTimeout: 90000 })
                .then(function (response) {
                    if (response.data.success) {
                        that.$message.success(response.data.message)
                    } else {
                        that.$message.warning(response.data.message)
                    }
                }).catch(function (reason) {
                    // alert("请求错误"+reason);
                })
        },
        HDFSFileTreeData (path) {
            console.log(path)
            var that = this
            var result = null
            var TreeData = []
            axios.get(window._CONFIG['domianURL'] + '/hdfs/list', { params: { path: path }, timeout: 90000000 })
                .then(function (response) {
                    result = response.data.result
                    for (var index in result) {
                        if (result[index].file) {
                            TreeData[index] = { id: result[index].path, pId: path, value: result[index].path, title: result[index].name, isLeaf: true }
                        } else {
                            TreeData[index] = { id: result[index].path, pId: path, value: result[index].path, title: result[index].name }
                        }
                    }
                    that.childTreeData = TreeData
                    that.treeData = that.treeData.concat(that.childTreeData)
                    console.log(that.childTreeData)
                }).catch(function (reason) {
                    // alert("请求错误"+reason);
                })
        }
    },
    watch: {
        value (value) {
            console.log(value)
        }
    }
}
</script>

<style>
  .table_font{
    font-size: 20px;
    font-weight: bold;
  }
  th.operation,
  td.operation{
    width: 180px;
  }

  .radio{
    margin-top: 15px;
    font-weight: bold;
  }
</style>
