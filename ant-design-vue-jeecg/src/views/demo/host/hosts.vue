<template>
  <div>
    <a-layout-content
      :style="{ margin: '10px 8px', padding: '10px 20px', background: '#fff', minHeight: '800px' }"
    >
      <a-tabs defaultActiveKey="1">
        <a-tab-pane key="1">
          <span slot="tab">
            <a-icon type="profile" />
            主机列表
          </span>
          <span>
            <a-input-search
              style="max-width: 60%;"
              placeholder="输入主机名"
              @search="onSearch"
              enterButton
              size="large">
            </a-input-search>
            <a-button style="margin-bottom: 20px;float: right;width: 100px;font-size: 15px;" type="primary" size="large" @click="showAddPolicy">刷新列表</a-button>
          </span>

          <a-table :columns="columns" :dataSource="data" bordered>
            <template slot="name" slot-scope="text">
              <a>{{ text }}</a>
            </template>
            <template slot="title" slot-scope="currentPageData">
              <label class="table_font">天熠大数据平台主机列表</label>
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
      </a-tabs>
    </a-layout-content>
  </div>

</template>

<script>
import axios from 'axios'
axios.defaults.timeout = 60000

const columns = [
    {
        title: '主机名',
        dataIndex: 'name',
        scopedSlots: { customRender: 'name' }
    },
    {
        title: 'IP地址',
        dataIndex: 'value'
    },
    {
        title: '机架',
        dataIndex: 'backupCycle'
    },
    {
        title: 'CPU核数',
        dataIndex: 'cronExpression'
    },
    {
        title: '内存',
        dataIndex: 'createTime'
    },
    {
        title: '版本',
        dataIndex: 'description'
    },
    {
        title: '组件',
        align: 'center',
        dataIndex: 'status',
        scopedSlots: { customRender: 'customRenderStatus' },
        filterMultiple: false,
        filters: [
            { text: '已启动', value: '0' },
            { text: '已暂停', value: '-1' }
        ]
    }
]

export default {
    components: {
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
    },
    methods: {
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
