<template>
  <div>
    <a-layout-content
      :style="{ margin: '10px 15px', padding: '10px 20px', background: '#fff', minHeight: '800px' }"
    >
      <span style="font-size: 15px;margin-right: 10px;">选择数据库连接: </span>
      <a-select
        labelInValue
        placeholder="请选择一个数据连接"
        style="width: 200px"
        @change="handleChange"
      >
        <a-select-option v-for="item in data" :key="item.id">[{{ item.databaseType }}]--{{ item.connectName }}</a-select-option>
      </a-select>
      <span style="font-size: 15px;margin-left: 20px;margin-right: 10px">选择数据库: </span>
      <a-select
        labelInValue
        style="width: 200px"
        placeholder="请选择一个数据库名"
        @change="handleChangeDatabaseName"
      >
        <a-select-option v-for="(item,i) in databaselist" :key="item">{{ item }}</a-select-option>
      </a-select>
      <span style="font-size: 15px;margin-left: 20px;margin-right: 10px">表名: </span>
      <a-select
        labelInValue
        style="width: 200px"
        placeholder="表名"
        @change="changetable"
      >
        <a-select-option v-for="(item,i) in tablelist" :key="item">{{ item }}</a-select-option>
      </a-select>
      <a-button style="margin-left: 10px;" type="primary" @click="search"> 查询 </a-button>
      <div style="margin-top: 15px;width: 950px;">
        <div style="margin-bottom: 20px;">
          <span style="margin-left: 8px">
            <a-button type="primary" :disabled="showDisabledImport" @click="importData"> <a-icon type="vertical-align-top" />导入</a-button>
          </span>
          <span style="margin-left: 8px">
            <a-button type="primary" @click="execute"> <a-icon type="search" />执行 </a-button>
          </span>
          <span style="margin-left: 8px">
            <a-button type="primary" @click="clear"> <a-icon type="close-circle" />清空</a-button>
          </span>
        </div>
        <template>
          <a-textarea v-model="searchQuery" placeholder="请输入自定义查询语句" :rows="6" />
        </template>
      </div>
      <div style="margin-bottom: 40px;margin-top: 20px;">
        <a-tabs v-show="visible" hideAdd v-model="activeKey" type="editable-card" @edit="onEdit">
          <a-tab-pane v-for="pane in panes" :tab="pane.title" :key="pane.key" :closable="pane.closable">
            <template>
              <div>
                <div style="margin-bottom: 16px">
                  <a-button type="primary" @click="start" :disabled="!hasSelected" :loading="loading">
                    Reload
                  </a-button>
                  <span style="margin-left: 8px">
                    <a-button type="primary" @click="execute"> <a-icon type="plus" />添加</a-button>
                  </span>
                  <span style="margin-left: 8px">
                    <a-button type="primary" @click="execute"> <a-icon type="edit" />修改</a-button>
                  </span>
                  <span style="margin-left: 8px">
                    <a-button type="primary" @click="execute"> <a-icon type="delete" />删除</a-button>
                  </span>

                  <span style="margin-left: 8px">
                    <a-button type="primary" @click="execute"> <a-icon type="vertical-align-bottom" />导出</a-button>
                  </span>
                  <span style="margin-left: 8px">
                    <template v-if="hasSelected">
                      {{ `Selected ${selectedRowKeys.length} items` }}
                    </template>
                  </span>
                </div>
                <a-table
                  :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                  :columns="columns"
                  :dataSource="datasource"
                  :pagination="pagination"
                  :loading="loading"
                  :rowKey="(record, index) => index"
                  :scroll="{ x: 1300, y: 500 }"
                  @change="handleTableChange"
                >
                  <a slot="name" slot-scope="text" href="javascript:;">{{ text }}</a>
                </a-table>
              </div>
            </template>
          </a-tab-pane>
        </a-tabs>
        <!-- <a-modal title="Basic Modal" v-model="importDataVisible" >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </a-modal> -->
        <importSqlData
          :modalVisible="importDataVisible"
          :tableName="tableName"
          :databaseName="databaseName"
          :connectId="id"
          @getChildrenStatus="getChildrenStatus"
        >
        </importSqlData>
      </div>
      <!-- <importSqlData
        :visible="importDataVisible"
        >
      </importSqlData> -->
    </a-layout-content>

  </div>
</template>
<script>
import importSqlData from './ImportSqlData.vue'

const columns = [
    {
        title: 'Name',
        dataIndex: 'name'
    },
    {
        title: 'Age',
        dataIndex: 'age'
    },
    {
        title: 'Address',
        dataIndex: 'address'
    }
]

const datasource = []
for (let i = 0; i < 46; i++) {
    datasource.push({
        key: i,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`
    })
}
const panes = [
    { title: '结果 1', content: 'Content of Tab 1', key: '1' },
    { title: '结果 2', content: 'Content of Tab 2', key: '2' }
]
export default {
    components: {
        importSqlData
    },
    data () {
        return {
            data: [],
            databaselist: [],
            tablelist: [],
            id: '',
            databaseName: '',
            tableName: '',
            value: undefined,
            datasource,
            visible: true,
            columns,
            selectedRowKeys: [], // Check here to configure the default column
            loading: false,
            activeKey: panes[0].key,
            panes,
            newTabIndex: 0,
            selectedRows: [],
            selectedRowKeys: [],
            searchQuery: '',
            pagination: {
                total: 0,
                pageSize: 10, // 每页中显示10条数据
                showSizeChanger: true,
                pageSizeOptions: ['10', '20'], // 每页中显示的数据
                showTotal: total => `共有 ${total} 条数据` // 分页中显示总的数据
            },
            queryParam: {
                page: 1, // 第几页
                size: 10// 每页中显示数据的条数
            },
            importDataVisible: false, // 显示数据导入Model
            showDisabledImport: true // 当表名为空，导入按钮不可使用
        }
    },
    computed: {
        hasSelected () {
            return this.selectedRowKeys.length > 0
        }
    },
    created () {
        this.listall()
    },
    methods: {
        listall () {
            this.data = []
            this.tablelist = []
            this.databaselist = []
            const that = this
            this.axios.get(window._CONFIG['domianURL']+'/database/sql/listall')
                .then(res => {
                    var data = res.result
                    console.log(data)
                    if (res.success == true) {
                        that.data = data
                    } else {
                        that.$message.error('查询失败')
                    }
                })
        },
        listdatabase (value) {
            const that = this
            console.log(value)
            that.id = value
            this.axios.get(window._CONFIG['domianURL'] + '/database/sql/jdbc/database', { params: { id: value } })
                .then(res => {
                    var databaselist = res.result
                    console.log(databaselist)
                    if (res.success == true) {
                        that.databaselist = databaselist
                    } else {
                        that.$message.error('查询失败')
                    }
                })
        },
        listtable (id, value) {
            const that = this
            console.log(value)
            this.axios.get(window._CONFIG['domianURL'] + '/database/sql/jdbc/table', { params: { id: id, database: value } })
                .then(res => {
                    var tablelist = res.result
                    console.log(tablelist)
                    if (res.success == true) {
                        that.tablelist = tablelist
                    } else {
                        that.$message.error('查询失败')
                    }
                })
        },
        handleChange (value) {
            console.log(value)
            console.log(value.key)
            var key = value.key
            this.listdatabase(key)
        },
        handleChangeDatabaseName (value) {
            this.tablelist = []
            console.log('databaseName' + value.key)
            var key = value.key
            var id = this.id
            this.databaseName = value.key
            this.listtable(id, key)
        },
        changetable (value) {
            this.tableName = value.key
            console.log('tablename_____' + value.key)
            this.showDisabledImport = false
            this.queryParam.page = 1 // 切换表或库时，将page重置为第一页
        },
        start () {
            this.loading = true
            // ajax request after empty completing
            setTimeout(() => {
                this.loading = false
                this.selectedRowKeys = []
            }, 1000)
        },
        handleTableChange (pagination) {
            this.pagination.current = pagination.current
            this.pagination.pageSize = pagination.pageSize
            this.queryParam.page = pagination.current
            this.queryParam.size = pagination.pageSize
            this.search()
        },
        onSelectChange (selectedRowKeys) {
            this.databaselist = []
            this.tablelist = []
            const that = this
            if (selectedRowKeys == '') {
                that.disableconnect = true
            } else {
                that.disableconnect = false
            }
            console.log('selectedRowKeys changed: ', selectedRowKeys)
            this.selectedRowKeys = selectedRowKeys
        },
        search () {
            const that = this
            var id = that.id
            var databaseName = that.databaseName
            var tableName = that.tableName
            this.searchQuery = 'SELECT * FROM ' + tableName + ';'
            this.axios.get(window._CONFIG['domianURL']+'/database/sql/jdbc/tabledata', { params: { id: id, databasename: databaseName, tablename: tableName, pageNum: this.queryParam.page, pageSize: this.queryParam.size }, timeout: 90000000 })
                .then(res => {
                    var datasource = res.result.list
                    var map = datasource[0]
                    var columns = []
                    for (var key in map) {
                        console.log(key)
                        columns.push({ title: key, dataIndex: key, width: 100 })
                    }

                    console.log(columns)
                    that.columns = columns
                    console.log(datasource)
                    if (res.success == true) {
                        that.datasource = datasource
                        const pagination = { ...this.pagination }
                        pagination.total = res.result.totalRecords
                        this.tableDatas = res.result.list
                        this.pagination = pagination
                    } else {
                        that.$message.error('查询失败')
                    }
                })
        },
        execute () {

        },
        click () {

        },
        callback (key) {
            console.log(key)
        },
        onEdit (targetKey, action) {
            this[action](targetKey)
        },
        add () {
            const panes = this.panes
            const activeKey = `newTab${this.newTabIndex++}`
            panes.push({
                title: `New Tab ${activeKey}`,
                content: `Content of new Tab ${activeKey}`,
                key: activeKey
            })
            this.panes = panes
            this.activeKey = activeKey
        },
        remove (targetKey) {
            let activeKey = this.activeKey
            let lastIndex
            this.panes.forEach((pane, i) => {
                if (pane.key === targetKey) {
                    lastIndex = i - 1
                }
            })
            const panes = this.panes.filter(pane => pane.key !== targetKey)
            if (panes.length && activeKey === targetKey) {
                if (lastIndex >= 0) {
                    activeKey = panes[lastIndex].key
                } else {
                    activeKey = panes[0].key
                }
            }
            this.panes = panes
            this.activeKey = activeKey
        },
        clear () {
            this.searchQuery = ''
        },
        importData () {
            var tableName = this.tableName
            if (tableName != '') {
                this.importDataVisible = true
            }
        },
        getChildrenStatus: function (data) { // 实时更新子组件的变化
            this.importDataVisible = data
        }
    }
}
</script>
