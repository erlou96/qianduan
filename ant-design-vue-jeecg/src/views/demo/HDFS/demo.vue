<template>
  <div>
    <div style="margin-bottom: 8px">
      <a-input addonBefore="HDFS文件路径" style="width: 400px" v-model="path" disabled />
      <span style="margin-left: 8px">
        <a-button type="primary" @click="returnBack">返回上一级</a-button>
      </span>
    </div>
    <div style="margin-bottom: 8px">
      <a-input-search
        placeholder="按文件名查询"
        style="width: 200px"
        v-model="keyword"
        @search="onSearch"
        @change="search"
      />
      <span style="margin-left: 8px">
        <a-button type="primary" @click="qingkong">清空</a-button>
      </span>
      <span style="margin-left: 8px">
        <a-button type="primary" @click="chongzhi">重置</a-button>
      </span>
      <span style="margin-left: 8px">
        <a-upload
          name="file"
          :multiple="true"
          @change="handleChange"
          :customRequest="customRequest"
        >
          <a-button type="primary"> <a-icon type="upload" />上传文件</a-button>
        </a-upload>
      </span>
    </div>
    <a-table :columns="columns" :rowKey="(record, index) => index" :dataSource="list" :loading="loading" bordered>
      <template slot="name" slot-scope="text,record">
        <a href="javascript:;" @click="clickName(record.file,record.path,record)">{{ text }}</a>
      </template>
      <template slot="operation" slot-scope="text, record">
        <a-popconfirm
          v-if="list.length"
          title="确定删除吗?"
          @confirm="() => onDelete(record.path)"
        >
          <a href="javascript:;">删除  </a>
        </a-popconfirm>
        <a v-show="record.file" href="javascript:;" @click="onDownload(record)">下载</a>
      </template>
    </a-table>
    <a-drawer
      title="HDFS文件详情信息"
      placement="right"
      width="500px"
      :closable="false"
      @close="onClose"
      :visible="visible"
    >
      <a-spin :spinning="confirmLoading" >
        <a-row>
          <a-col :span="6">
            <label>文件类型:</label>
          </a-col>
          <a-col :span="18">
            <a-input
              class="input"
              :disabled="HdfsFiledisabled"
              v-model="HdfsFileName"
            />
          </a-col>
        </a-row>
        <a-row style="margin-top: 16px;">
          <a-col :span="6">
            <label>文件存储池ID:</label>
          </a-col>
          <a-col :span="18">
            <a-input
              class="input"
              :disabled="HdfsFiledisabled"
              v-model="HdfsFile.blockPoolId"
            />
          </a-col>
        </a-row>
        <a-row style="margin-top: 16px;">
          <a-col :span="6">
            <label>blockID:</label>
          </a-col>
          <a-col :span="18">
            <a-select
              class="input"
              @change="testchange"
              defaultValue="文件块id">
              <a-select-option v-for="(item, index) in HdfsFileList" :key="index" :value="item.blockID">{{ item.blockID }}</a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <a-row style="margin-top: 16px;">
          <a-col :span="6">
            <label>blockName:</label>
          </a-col>
          <a-col :span="18">
            <a-input
              class="input"
              :disabled="HdfsFiledisabled"
              v-model="HdfsFile.blockName"
            />
          </a-col>
        </a-row>
        <a-row style="margin-top: 16px;">
          <a-col :span="6">
            <label>文件的存储节点:</label>
          </a-col>
          <a-col :span="18">
            <a-select defaultValue="文件所在节点" class="input">
              <a-select-option v-for="d in HdfsFile.hostName " :key="d.key">{{ d.value }}</a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <a-row style="margin-top: 16px;">
          <a-col :span="6">
            <label>generationStamp:</label>
          </a-col>
          <a-col :span="18">
            <a-input
              class="input"
              :disabled="HdfsFiledisabled"
              v-model="HdfsFile.generationStamp"
            />
          </a-col>
        </a-row>
        <a-row style="margin-top: 16px;">
          <a-col :span="6">
            <label>blockSize:</label>
          </a-col>
          <a-col :span="18">
            <a-input
              class="input"
              :disabled="HdfsFiledisabled"
              v-model="HdfsFile.blockSize"
            />
          </a-col>
        </a-row>
      </a-spin>
    </a-drawer>
  </div>
</template>

<script>
import axios from 'axios'
import JUpload from '@/components/jeecg/JUpload'
axios.defaults.timeout = 60000
const columns = [
    {
        title: '文件',
        dataIndex: 'file',
        width: 40,
        customRender (text) {
            if (text == false) {
                return '否'
            } else {
                return '是'
            }
        }
    },
    {
        title: '文件名',
        dataIndex: 'name',
        scopedSlots: { customRender: 'name' },
        width: 100
    },
    {
        title: 'path',
        dataIndex: 'path'
    },
    {
        title: '拥有者',
        dataIndex: 'owner'
    },
    {
        title: '副本数',
        dataIndex: 'replication'
    },
    {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' }
    }
]
const list = [{}]
const listall = [{}]
const currentlist = [{}]
export default {
    components: {
        JUpload
        // JeecgOrderDMainModal
    },
    data () {
        return {
            list,
            columns,
            loading: true,
            down: false,
            keyword: '',
            path: 'hdfs://udap69a165/',
            visible: false,
            confirmLoading: false,
            HdfsFileName: 'test.sh',
            HdfsFileList: [
            ],
            HdfsFile: {
                blockID: '1',
                blockName: 'block-1',
                blockPoolId: '',
                hostName: [
                    { key: '1', value: 'hanzhe' },
                    { key: '2', value: 'zhangsan' },
                    { key: '3', value: 'wangwu' }
                ],
                blockSize: '1000k',
                generationStamp: ''
            },
            HdfsFiledisabled: true,
            form: '',
            headers: {
                authorization: 'authorization-text'
            }
        }
    },
    created () {
        this.hdfsfilelist('hdfs://udap69a165/')
        console.log('listall')
    },
    methods: {
        hdfsfilelist (path) {
            this.loading = true
            this.path = path
            var that = this
            axios.get(window._CONFIG['domianURL'] + '/hdfs/list', { params: { path: path }, timeout: 90000000 })
                .then(function (response) {
                    var code = response.data.code
                    console.log(code)
                    that.list = response.data.result
                    that.listall = that.list
                    console.log(that.list)
                    that.loading = false
                }).catch(function (reason) {
                    alert('error' + reason)
                })
        },
        onSearch (keyword) {
            var that = this
            // debugger;
            var searchlist = that.listall.filter(item => {
                if (item.name.includes(keyword)) {
                    console.log(item)
                    return item
                }
            })
            that.list = searchlist
            console.log(searchlist.length)
        },
        qingkong () {
            let that = this
            this.keyword = ''
            that.list = that.listall
        },
        chongzhi () {
            this.keyword = ''
            this.hdfsfilelist('hdfs://udap69a165/')
        },
        returnBack () {
            if (this.path == 'hdfs://udap69a165/' || this.path == 'hdfs://hadoop' || this.path == '/') {
                this.$message.success('已经到最上级目录了！')
            } else {
                console.log(this.path)
                var newpath = this.path.substring(0, this.path.length - 1)
                var returnpath = newpath.substring(0, newpath.lastIndexOf('/') + 1)
                console.log(returnpath)
                this.hdfsfilelist(returnpath)
            }
        },
        search () {
            this.onSearch(this.keyword)
        },
        onDelete (key) {
            this.loading = true
            const that = this
            axios.get(window._CONFIG['dohdfs://udap69a165/URL'] + '/hdfs/delete', { params: { dfspath: key } })
                .then(function (response) {
                    var code = response.data.code
                    if (code == '200') {
                        that.$message.success('删除成功！')
                    } else {
                        that.$message.error('删除失败')
                    }
                }).catch(function (reason) {
                    alert('error' + reason)
                })
            this.hdfsfilelist(this.path)
            if (this.list.length == 1) {
                this.returnBack()
            }
        },
        clickName (isfile, hdfspath) {
            if (isfile) {
                console.log(isfile)
                this.clickFile(hdfspath)
            } else {
                this.path = hdfspath + '/'
                this.hdfsfilelist(hdfspath + '/')
                console.log(this.currentlist)
            }
        },
        showDrawer () {
            this.visible = true
        },
        onClose () {
            this.visible = false
        },
        testchange (value) {
            var hdfsfilelist = this.HdfsFileList
            var hdfsfile = this.HdfsFile
            var hostname
            for (let item in hdfsfilelist) {
                if (hdfsfilelist[item].blockID == value) {
                    hdfsfile.blockID = hdfsfilelist[item].blockID
                    hdfsfile.blockPoolId = hdfsfilelist[item].blockPoolId
                    hdfsfile.blockName = hdfsfilelist[item].blockName
                    hdfsfile.blockSize = hdfsfilelist[item].blockSize
                    hdfsfile.generationStamp = hdfsfilelist[item].generationStamp
                    hostname = hdfsfilelist[item].hostName
                }
            }
            for (let i in hostname) {
                hdfsfile.hostName[i].key = hostname[i]
                hdfsfile.hostName[i].value = hostname[i]
            }
        },
        clickFile (filepath) {
            this.showDrawer()
            this.confirmLoading = true
            const that = this
            var filename = filepath.substring(filepath.lastIndexOf('/') + 1, filepath.length)
            this.HdfsFileName = filename
            axios.get(window._CONFIG['domianURL'] + '/hdfs/fileInformation', { params: { path: filepath } })
                .then(function (response) {
                    var code = response.data.code
                    if (code == '200') {
                        that.$message.success('文件信息查询成功！')
                        that.HdfsFileList = response.data.result
                        that.confirmLoading = false
                        console.log(response.data.result)
                    } else {
                        that.$message.error('文件信息查询失败')
                    }
                }).catch(function (reason) {
                    that.$message.error(reason)
                })
        },
        onDownload (key) {
            axios.defaults.timeout = 10000
            var path = key.path
            const that = this
            axios.get(window._CONFIG['domianURL']+'/hdfs/downloadFile', { params: { path: path }, responseType: 'blob' })
                .then(res => {
                    if (res.status == 200) {
                        let url = window.URL.createObjectURL(new Blob([res.data]))
                        let link = document.createElement('a')
                        link.style.display = 'none'
                        link.href = url
                        link.setAttribute('download', key.name) // 自定义下载文件名（如exemple.txt）
                        document.body.appendChild(link)
                        link.click()
                    } else {
                        that.$message.error('下载失败')
                    }
                })
        },
        handleChange (info) {
            console.log(info)
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList)
            }
            if (info.file.status === 'done') {
                this.$message.success(`${info.file.name} file uploaded successfully`)
            } else if (info.file.status === 'error') {
                this.$message.error(`${info.file.name} file upload failed.`)
            }
        },
        customRequest (data) { // 上传提交
            var path = this.path
            this.$message.success('文件正在上传！')
            const formData = new FormData()
            formData.append('file', data.file)
            console.log('data' + data)
            formData.append('token', 'token')
            this.axios({
                method: 'post',
                timeout: 900000,
                url: '/hdfs/saveFile',
                headers: {
                },
                params: {
                    path: path
                },
                data: formData
            }).then((response) => {
                console.log(response)
                data.onSuccess()
                this.hdfsfilelist('hdfs://udap69a165/')
            }).catch(function (error) {
                data.onError()
                console.log(error)
            })
        }
    }
}
</script>

<style>
  th.column-money,
    td.column-money {
      text-align: right !important;
    }
    .editable-cell {
        position: relative;
      }

      .editable-cell-input-wrapper,
      .editable-cell-text-wrapper {
        padding-right: 24px;
      }

      .editable-cell-text-wrapper {
        padding: 5px 24px 5px 5px;
      }

      .editable-cell-icon,
      .editable-cell-icon-check {
        position: absolute;
        right: 0;
        width: 20px;
        cursor: pointer;
      }

      .editable-cell-icon {
        line-height: 18px;
        display: none;
      }

      .editable-cell-icon-check {
        line-height: 28px;
      }

      .editable-cell:hover .editable-cell-icon {
        display: inline-block;
      }

      .editable-cell-icon:hover,
      .editable-cell-icon-check:hover {
        color: #108ee9;
      }

      .editable-add-btn {
        margin-bottom: 8px;
      }

      .ant-btn {
        padding: 0 10px;
        margin-left: 3px;
      }

      .ant-form-item-control {
        line-height: 0px;
      }

      /** 主表单行间距 */
      .ant-form .ant-form-item {
        margin-bottom: 10px;
      }

      /** Tab页面行间距 */
      .ant-tabs-content .ant-form-item {
        margin-bottom: 0px;
      }

      .input{
        margin-left: 10px;
        width: 300px;
      }

</style>
