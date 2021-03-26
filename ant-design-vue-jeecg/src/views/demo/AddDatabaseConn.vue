<template>
  <a-modal
    :visible="visible"
    title="新建数据库连接"
    okText="确定"
    @cancel="() => { $emit('cancel') }"
    @ok="() => { $emit('create') }"
  >
    <a-form 
      layout='vertical' 
      :form="form">
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="名称:"
      >
        <a-input
          v-decorator="[
            'connectName',// 给表单赋值或拉取表单时，该input对应的key
            {
              rules: [{ required: true, message: '请填写数据库连接名!' }],
            }
          ]"
          @blur="validateFieldname"
        />
      </a-form-item>
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="数据库类型:"
      >
        <a-select
          v-decorator="[
            'databaseType',
            { rules: [{ required: true, message: '请选择一个数据库类型!' }] },
          ]"
          placeholder="选择数据库类型"
          @change="handleSelectChange"
        >
          <a-select-option v-for="databaseType in databaseTypeData" :key="databaseType">
            {{ databaseType }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="驱动类型:"
      >
        <a-select 
          v-decorator="['databaseDriveType']" 
        >
          <a-select-option v-for="databaseDriveType in databaseDriveTypes" :key="databaseDriveType">
            {{ databaseDriveType }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="默认数据库:"
      >
        <a-input
          v-decorator="[
            'databaseName',
            {
              rules: [{ required: true, message: '请填写默认数据库!' }],
            }
          ]"
          @blur="validateFieldname"
        />
      </a-form-item>
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="IP地址:"
      >
        <a-input
          v-decorator="[
            'ip',
            {
              rules: [{ required: true, message: '请填写数据库IP地址!' }],
            }
          ]"
          @blur="validateFieldname"
        />
      </a-form-item>
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="端口号:"
      >
        <a-input
          v-decorator="[
            'port',
            {
              rules: [{ required: true, message: '请填写数据库端口号!' }],
            }
          ]"
          @blur="validateFieldname"
        />
      </a-form-item>
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="用户名:"
      >
        <a-input
          v-decorator="[
            'username',
            {
              rules: [{ required: true, message: '请填写用户名!' }],
            }
          ]"
          @blur="validateFieldname"
        />
      </a-form-item>
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="密码:"
      >
        <a-input
          v-decorator="[
            'password',
            {
              rules: [{ required: true, message: '请填写数据库密码!' }],
            }
          ]"
          @blur="validateFieldname"
        />
      </a-form-item>
    </a-form>        
  </a-modal>
</template>
<script>
  const databaseTypeData = ['Mysql', 'hive2', '达梦'];
  const databaseDriveTypeData = {
    Mysql: ['JDBC', 'ODBC'],
    hive2: ['JDBC'],
    达梦: ['JDBC', 'ODBC']
  };
      
  export default {
    
    props:{
       visible : Boolean
    },
    data() {
      return {
        form: this.$form.createForm(this),
        databaseTypeModel: "",
        databaseTypeData,
        databaseDriveTypeData,
        databaseDriveTypes: databaseDriveTypeData[databaseTypeData[0]],
        databaseDriveType: databaseDriveTypeData[databaseTypeData[0]][0],
        labelCol: {
        xs: { span: 5 },
        sm: { span: 5 },
        },
        wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        },          
      };
    },
    
    beforeCreate() {
        this.form = this.$form.createForm(this, { name: 'form_in_modal' });
    },
    methods:{
      handleSelectChange(value) {
        console.log(value);
        // this.form.setFieldsValue({
        //   note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
        // });
        this.databaseDriveTypes = databaseDriveTypeData[value];
        this.databaseDriveType = databaseDriveTypeData[value][0];
      },
      validateFieldname(){
        this.form.validateFields(err => {
          if (!err) {
            console.info('success');
          }
        });
      },
    }
    
  }
</script>
<style>
  
</style>