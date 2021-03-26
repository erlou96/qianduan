<template>
  <div>
    <a-modal 
      width="800px" 
      title="数据导入" 
      :visible="modalVisible" 
      @cancel="handleCancel">
      <div>
        <a-steps :current="current">
          <a-step v-for="item in steps" :key="item.title" :title="item.title" />
        </a-steps>
        <div class="steps-content" v-if="current == 0">
          <div>
            <span style="margin-left: 8px">
              选择导入数据的文件类型:
            </span>
            <span style="margin-left: 16px">
              <a-select :defaultValue="fileType[0]" style="width: 200px" @change="handleChangeFileType">
                <a-select-option v-for="(item,index) in fileType" :key="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </span>
          </div>
          <div style="margin-top: 20px;margin-bottom: 60px;">
            <a-upload :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload">
              <a-button style="width: 400px;"> <a-icon type="upload" /> 选择文件 </a-button>
            </a-upload>
            
          </div>
        </div>
        <div class="steps-content1" v-if="current == 1">
          <a-radio-group @change="onChange" v-model="value">
            <a-radio :style="radioStyle" :value="1">追加:添加记录到目标表</a-radio>
            <a-radio :style="radioStyle" :disabled="disabledRadio" :value="2">删除:删除目标和原纪录相符的记录</a-radio>
            <a-radio :style="radioStyle" :value="3">复制:删除目标全部记录，并从源重新录入</a-radio>
          </a-radio-group>
        </div>
        <div class="steps-content2" v-if="current == 2">
          <template>
            <a-textarea placeholder="Basic usage" :disabled="true" :autosize="{ minRows: 6, maxRows: 6 }"/>
            <a-button
              type="primary"
              @click="handleUpload"
              :disabled="fileList.length === 0"
              :loading="uploading"
              style="margin-top: 16px"
            >
              {{ uploading ? '数据导入中' : '开始导入' }}
            </a-button>
          </template>
        </div>
        <div class="steps-action">
          <a-button v-if="current < steps.length - 1" type="primary" :disabled="disableNext" @click="next">
            Next
          </a-button>
          <a-button
            v-if="current == steps.length - 1"
            type="primary"
            @click="$message.success('Processing complete!')"
          >
            Done
          </a-button>
          <a-button v-if="current>0" style="margin-left: 8px" @click="prev">
            Previous
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
  
  const fileType = ["Excel文件(*.xls;*.xlsx)","文本文件(*.txt)"]
  
  export default {
      props: {
        modalVisible: Boolean,
        tableName: String,
        databaseName: String,
        connectId: String,
      },
      data() {
        return {
          fileType,
          disableNext: true,
          fileList: [],
          file:{},
          uploading: false,
          SelectfileType: fileType[0],
          value: 1,
          current: 0,
          steps: [
            {
              title: '选择导入的表',
              content: 'First-content',
            },
            {
              title: '选择导入文件',
              content: 'Second-content',
            },
            {
              title: '开始导入',
              content: 'Last-content',
            },
          ],
          disabledRadio: true,
          radioStyle: {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
            'vertical-align' : 'text-top',
          },
        } 
      },
      methods: {
        handleCancel(e) {
          console.log(this.modalVisible);
          this.$emit('getChildrenStatus',false)
        },
        handleChangeFileType(value) {
          console.log("tablename"+this.tableName);
          console.log(`selected ${value}`);
          this.SelectfileType = value;
          this.fileList = [];
          this.disableNext = true;
        },
        next() {
          this.current++;
        },
        prev() {
          this.current--;
        },
        handleRemove(file) {
          this.file = file;
          const index = this.fileList.indexOf(file);
          const newFileList = this.fileList.slice();
          newFileList.splice(index, 1);
          this.fileList = newFileList;
        },
        beforeUpload(file) {
          console.log(file);
          var fileName = file.name;
          var fileType = fileName.substring(fileName.lastIndexOf(".")+1,fileName.length);
          console.log(fileType);
          var SelectfileType = this.SelectfileType;
          var fileTypeList = this.fileType;
          console.log(SelectfileType);
          switch(SelectfileType){
            case fileTypeList[0] :
              if(fileType == "xls" || fileType == "xlsx"){
                this.disableNext = false;
                this.fileList = [...this.fileList, file];
                this.fileList = this.fileList.slice(-1);
                return false;
              }else{
                this.fileList = [];
                this.disableNext = true; 
                this.$message.error("上传文件类型必须是xls或者xlxs!");
                return false;
              }
            case fileTypeList[1]:
              if(fileType == "txt"){
                this.disableNext = false;
                this.fileList = [...this.fileList, file];
                this.fileList = this.fileList.slice(-1);
                return false;
              }else{
                this.fileList = [];
                this.disableNext = true; 
                this.$message.error("上传文件类型必须是txt!");
                return false;
              }
          }
         
        },
        onChange(e) {
          console.log('radio checked', e.target.value);
        },
        handleUpload() {
          const { fileList } = this;
          const formData = new FormData();
          const that = this;
          //fileList.forEach(file => {
            var file = this.file;
          //  console.log()
          //   formData.append('file', fileList);
          // //});
          fileList.forEach(file => {
            formData.append('file', file);
          });
          this.uploading = true;
          var tableName = this.tableName;
          var connectId = this.connectId;
          var databaseName = this.databaseName;
          // You can use any AJAX library you like
          this.axios({
            method: 'post',
            timeout: 900000,
            url: '/database/sql/import/excel',
            headers: {
            },
            params:{
              id:connectId,
              tablename:tableName,
              database:databaseName
            },
            data:formData
          }).then((response) => {
              console.log(response) 
              if(response.code == "200"){
                that.$message.success('导入数据成功!导入了'+response.result+"条");
                that.uploading = false;
              }else{
                that.uploading = false;
              }
            }).catch(function (error) {
              console.log(error)
            });
        },
      }
  }
</script>

<style scoped>
  .steps-content {
    margin-top: 16px;
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    min-height: 200px;
    text-align: center;
    padding-top: 40px;
  }
  .steps-content1 {
    margin-top: 16px;
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    min-height: 200px;
    text-align: left;
    padding-top: 40px;
    padding-left: 60px;
  }
  .steps-content2 {
    margin-top: 16px;
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    min-height: 200px;
    text-align: center;
    padding-top: 20px;
    padding-bottom: 10px;
  }

  .steps-action {
    margin-top: 24px;
  }
</style>

