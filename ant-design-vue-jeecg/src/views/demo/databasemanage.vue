<template>
  <div>
    <div style="margin-bottom: 16px">
      <a-button type="primary" @click="showModal"> <a-icon type="plus" />新建连接 </a-button>
      <span style="margin-left: 8px">
        <a-button type="primary" @click="deleteConnect" :disabled="disableconnect"> <a-icon type="delete" />删除连接 </a-button>
      </span>
      <span style="margin-left: 8px">
        <a-button type="primary" @click="reloadConnect" > <a-icon type="reload" />刷新 </a-button>
      </span>
      <addConnect
        ref="collectionForm"
        :visible="visible"
        @cancel="handleCancel"
        @create="handleCreate"
      ></addConnect>
    </div>
    <div>
      <a-table
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :columns="columns"
        :dataSource="data"
        :pagination="pagination"
        :loading="loading"
        :rowKey="data => data.id"
        @change="handleTableChange"
      >
        <a slot="name" slot-scope="text" href="javascript:;">{{ text }}</a>
      </a-table>
    </div>
   
  </div>
  
</template>
<script>
import axios from 'axios'
import addConnect from './AddDatabaseConn.vue'
const columns = [
    {
        title: '数据库连接名',
        dataIndex: 'connectName',
        scopedSlots: { customRender: 'connectName' }
    },
    {
        title: '数据库类型',
        dataIndex: 'databaseType'
    },
    {
        title: '数据库驱动类型',
        dataIndex: 'databaseDriveType'
    },
    {
        title: '数据库名',
        dataIndex: 'databaseName'
    },
    {
        title: 'IP',
        dataIndex: 'ip'
    },
    {
        title: '端口号',
        dataIndex: 'port'
    },
    {
        title: '用户名',
        dataIndex: 'username'
    },
    {
        title: '密码',
        dataIndex: 'password'
    }
]
const data = []

export default {
    components: {
        addConnect
    },
    data () {
        return {
            data,
            columns,
            visible: false,
            pagination: {
                total: 0,
                pageSize: 10, // 每页中显示10条数据
                showSizeChanger: true,
                pageSizeOptions: ['10', '20'], // 每页中显示的数据
                showTotal: total => `共有 ${total} 条数据` // 分页中显示总的数据
            },
            loading: true,
            disableconnect: true,
            selectedRows: [],
            selectedRowKeys: [],
            queryParam: {
                page: 1, // 第几页
                size: 10 // 每页中显示数据的条数
            }
        }
    },
    computed: {
    },
    created () {
        this.listall()
        // this.test2()
        // this.test3()
    },
    methods: {
        test () {
            console.log('test')
            axios.get('/api/v1/cluster', { auth: {
                username: 'admin',
                password: 'admin'
            } }).then((response) => {
                if (response.data) {
                    console.log(response.data)
                }
            }).catch(err => {
                alert('请求失败')
            })
        },
        test2 () {
            axios.get('/api/').then((response) => {
                if (response.data) {
                    console.log(response.data)
                }
            }).catch(err => {
                alert('请求失败')
            })
        },
        test3 () {
            axios.get('/api2/').then((response) => {
                if (response.data) {
                    console.log(response.data)
                }
            }).catch(err => {
                alert('请求失败')
            })
        },
        showModal () {
            this.visible = true
        },
        handleCancel () {
            this.visible = false
        },
        handleCreate () {
            const form = this.$refs.collectionForm.form

            form.validateFields((err, values) => {
                if (err) {
                    return
                }
                const that = this
                console.log('Received values of form: ', values)
                this.axios.post('/database/sql/add', values)
                    .then(function (response) {
                        console.log(response)
                        var code = response.code
                        if (code == '200') {
                            that.$message.success('数据库连接成功！')
                            that.listall()
                        } else {
                            that.$message.error('数据库连接失败')
                        }
                    })
                // form.resetFields();
                this.visible = false
            })
        },
        handleTableChange (pagination) {
            this.pagination.current = pagination.current
            this.pagination.pageSize = pagination.pageSize
            this.queryParam.page = pagination.current
            this.queryParam.size = pagination.pageSize
            this.getTableList()
        },
        onSelectChange (selectedRowKeys) {
            const that = this
            if (selectedRowKeys == '') {
                that.disableconnect = true
            } else {
                that.disableconnect = false
            }
            console.log('selectedRowKeys changed: ', selectedRowKeys)
            this.selectedRowKeys = selectedRowKeys
        },
        getTableList () {
            this.loading = true
            this.axios.get(window._CONFIG['domianURL']+'/database/sql/list', { params: { pageNo: this.queryParam.page, pageSize: this.queryParam.size } }).then(res => {
                if (res.success == true) {
                    const pagination = { ...this.pagination }
                    pagination.total = res.result.total
                    this.tableDatas = res.result.list
                    this.pagination = pagination
                    this.data = res.result.records
                }
                this.loading = false
            })
        },
        deleteConnect () {
            const that = this
            var selectedRowKeys = this.selectedRowKeys
            console.log(selectedRowKeys)
            var idstr = `${selectedRowKeys}`
            console.log(idstr)
            this.axios.delete(window._CONFIG['domianURL']+'/database/sql/connect', { params: { strId: idstr } })
                .then(res => {
                    if (res.success == true) {
                        that.$message.success('删除连接成功')
                    } else {
                        that.$message.error('删除连接失败')
                    }
                })
            this.selectedRowKeys = []
            this.listall()
        },
        reloadConnect () {
            this.loading = true
            this.listall()
        },
        listall () {
            const that = this
            this.axios.get(window._CONFIG['domianURL']+'/database/sql/list', { params: { pageNo: this.queryParam.page, pageSize: this.queryParam.size } })
                .then(res => {
                    var data = res.result.records
                    var paginationtotal = res.result.total
                    that.pagination.total = paginationtotal
                    console.log(paginationtotal)
                    console.log(data)
                    if (res.success == true) {
                        that.data = data
                    } else {
                        that.$message.error('查询失败')
                    }
                })
            this.loading = false
        }
    }
}
</script>
<style>
</style>
