<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-form-item>
            <a-input
              v-model="searchPhone"
              placeholder="请输入手机号"
              allowClear
              @pressEnter="handleSearch"
              style="width: 200px"
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleSearch">查询</a-button>
          </a-form-item>
          <a-form-item>
            <a-button @click="handleResetSearch">重置</a-button>
          </a-form-item>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
      </div>
      <a-table :columns="columns" :data-source="dataList" :rowKey="record => record.id">
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDelete(record)">删除</a>
          <a-divider type="vertical" />
          <a @click="handleSetRole(record)">设置角色</a>
        </span>
      </a-table>
    </a-card>
    <a-modal
      title="创建角色"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form">
        <a-form-item
          label="昵称"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            v-decorator="[
              'nickname',
              {rules: [{ required: true, message: '请输入昵称' }]}
            ]"
            name="nickname"
            placeholder="请输入昵称" />
        </a-form-item>
        <a-form-item
          label="区号"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            v-decorator="['countyCode', { initialValue: '86', rules: [{ required: true, message: '请输入区号' }] }]"
            placeholder="请输入区号，如 86" />
        </a-form-item>
        <a-form-item
          label="国家缩写"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            v-decorator="['countryAbbr', { initialValue: 'CN', rules: [{ required: true, message: '请输入国家缩写' }] }]"
            placeholder="请输入国家缩写，如 CN" />
        </a-form-item>
        <a-form-item
          label="手机号"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            v-decorator="[
              'phone',
              {rules: [{ required: true, message: '请输入手机号' }]}
            ]"
            name="phone"
            placeholder="请输入手机号" />
        </a-form-item>
        <a-form-item
          label="密码"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            v-decorator="[
              'password',
              {
                rules: isEdit
                  ? [{ min: 6, message: '密码不能少于6位' }]
                  : [{ required: true, message: '请输入密码' }, { min: 6, message: '密码不能少于6位' }]
              }
            ]"
            type="password"
            name="password"
            placeholder="请输入密码" />
        </a-form-item>
        <a-form-item
          label="确认密码"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            v-decorator="[
              'confirmPassword',
              {
                rules: isEdit
                  ? [{ validator: validateConfirmPassword }]
                  : [{ required: true, message: '请再次输入密码' }, { validator: validateConfirmPassword }]
              }
            ]"
            type="password"
            name="confirmPassword"
            placeholder="请再次输入密码" />
        </a-form-item>
        <!-- <a-form-item
          label="选择角色"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-select
            v-decorator="[
              'roleId',
              { rules: [{ required: true, message: '请选择用户角色类型!' }] },
            ]"
            placeholder="请选择用户角色类型"
          >
            <a-select-option name="roleId" v-for="(item, i) in roleOption" :key="i" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item> -->
        <a-form-item
          label="验证码"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            v-decorator="[
              'smsCode',
              { rules: [{ required: true, message: '请输入验证码' }] }
            ]"
            name="smsCode"
            placeholder="请输入验证码"
            style="width: 60%; margin-right: 8px;" />
          <a-button
            :disabled="captchaBtnDisabled || !form.getFieldValue('phone')"
            @click="handleSendCode"
          >
            {{ captchaBtnText }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      title="设置角色"
      :visible="setRoleVisible"
      :confirm-loading="setRoleLoading"
      @ok="handleSetRoleOk"
      @cancel="handleSetRoleCancel"
    >
      <a-form :form="setRoleForm">
        <a-form-item label="角色类型" :labelCol="{lg: {span: 7}, sm: {span: 7}}" :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-select v-decorator="['roleId', { rules: [{ required: true, message: '请选择角色类型' }] }]" placeholder="请选择角色类型">
            <a-select-option v-for="item in roleOption" :key="item.value" :value="item.value">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { Ellipsis } from '@/components'
import { getUserList, addUser, updateUser, deleteUser, sendCode, setUserRole } from '@/api/business'

const columns = [
  {
    title: '用户名',
    dataIndex: 'nickname',
    key: 'nickname'
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone'
  },
  {
    title: '角色',
    dataIndex: 'roleName',
    key: 'roleName'
  },
  {
    title: '创建时间',
    dataIndex: 'createtime',
    key: 'createtime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
     scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'TableList',
  components: {
    Ellipsis
  },
  data () {
    this.columns = columns
    return {
      form: this.$form.createForm(this),
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      isEdit: false, // 新增
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      dataList: [],
      roleOption: [{
        name: '超级管理员',
        value: 'ADMIN'
      }, {
        name: '客服',
        value: 'CUSTOMER_SERVICE'
      }, {
        name: '普通用户',
        value: 'USER'
      }],
      searchPhone: '', // 新增：手机号筛选
      captchaBtnText: '获取验证码',
      captchaBtnDisabled: false,
      captchaCountdown: 60,
      setRoleVisible: false,
      setRoleLoading: false,
      setRoleUser: null,
      setRoleForm: this.$form.createForm(this, { name: 'setRoleForm' })
    }
  },
  created () {
    this.getDataList()
    // this.getRoleDataList()
  },
  computed: {
  },
  methods: {
    // 校验确认密码
    validateConfirmPassword (rule, value, callback) {
      const password = this.form.getFieldValue('password')
      if (value && value !== password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    },
    async getDataList () {
      const res = await getUserList()
      res.data.forEach(item => {
        if (item.roles.includes('ADMIN')) {
          item.roleName = '超级管理员'
        } else if (item.roles.includes('CUSTOMER_SERVICE')) {
          item.roleName = '客服'
        } else {
          item.roleName = '普通用户'
        }
      })
      this.dataList = res.data
    },
    handleAdd () {
      this.mdl = null
      this.isEdit = false
      this.visible = true
      this.form.resetFields()
    },
    handleEdit (record) {
      this.visible = true
      this.isEdit = true
      this.mdl = { ...record }
      // 回显数据
      this.$nextTick(() => {
        this.form.setFieldsValue({
          phone: record.phone,
          password: '', // 编辑时密码一般不回显
          confirmPassword: '',
          roleId: record.roleId,
          smsCode: ''
        })
      })
    },
    handleDelete (record) {
      this.$confirm({
        title: '确定要删除该用户吗？',
        content: `用户名：${record.username}`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          deleteUser(record.id).then(() => {
            this.$message.success('删除成功')
            this.getDataList()
          }).catch(() => {
            this.$message.error('删除失败')
          })
        }
      })
    },
    handleOk (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // 组装 phone 字段
          const { countyCode, phone, countryAbbr, smsCode, password, nickname } = values
          const submitData = {
            smsCode,
            nickname,
            password,
            countyCode: countryAbbr,
            phone: countyCode + phone
          }
          if (this.mdl && this.mdl.id) {
            // 编辑
            updateUser(this.mdl.id, submitData).then(() => {
              this.$message.success('编辑成功')
              this.visible = false
              this.getDataList()
              this.form.resetFields()
            }).catch(() => {
              this.$message.error('编辑失败')
            })
          } else {
            // 新增
            addUser(submitData).then(() => {
              this.$message.success('添加成功')
              this.visible = false
              this.getDataList()
              this.form.resetFields()
            }).catch(() => {
              this.$message.error('添加失败')
            })
          }
        }
      })
    },
    handleCancel (e) {
      this.visible = false
      this.form.resetFields()
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    async handleSendCode () {
      const phone = this.form.getFieldValue('phone')
      const countyCode = this.form.getFieldValue('countyCode')
      const countryAbbr = this.form.getFieldValue('countryAbbr')
      if (!phone) {
        this.$message.error('请先输入手机号')
        return
      }
      if (!countyCode) {
        this.$message.error('请先选择区号')
        return
      }
      this.captchaBtnDisabled = true
      this.captchaBtnText = `${this.captchaCountdown}s后重试`
      const timer = setInterval(() => {
        this.captchaCountdown--
        this.captchaBtnText = `${this.captchaCountdown}s后重试`
        if (this.captchaCountdown <= 0) {
          clearInterval(timer)
          this.captchaBtnText = '获取验证码'
          this.captchaBtnDisabled = false
          this.captchaCountdown = 60
        }
      }, 1000)
      try {
        const res = await sendCode({ phone: countyCode + phone, countyCode: countryAbbr })
        if (res.success) {
          this.$message.success('验证码已发送')
        } else {
          this.$message.error('验证码发送失败')
          clearInterval(timer)
          this.captchaBtnText = '获取验证码'
          this.captchaBtnDisabled = false
          this.captchaCountdown = 60
        }
      } catch (e) {
        this.$message.error('验证码发送失败')
        clearInterval(timer)
        this.captchaBtnText = '获取验证码'
        this.captchaBtnDisabled = false
        this.captchaCountdown = 60
      }
    },
    handleSetRole (record) {
      this.setRoleUser = record
      this.setRoleVisible = true
      this.setRoleForm.resetFields()
      this.$nextTick(() => {
        this.setRoleForm.setFieldsValue({ roleId: record.roleId })
      })
    },
    handleSetRoleOk () {
      this.setRoleForm.validateFields(async (err, values) => {
        if (!err) {
          this.setRoleLoading = true
          try {
            await setUserRole({ userId: this.setRoleUser.id, roles: [values.roleId] })
            this.$message.success('设置角色成功')
            this.setRoleVisible = false
            this.getDataList()
          } catch (e) {
            this.$message.error('设置角色失败')
          } finally {
            this.setRoleLoading = false
          }
        }
      })
    },
    handleSetRoleCancel () {
      this.setRoleVisible = false
    },
    handleSearch () {
      this.getDataList()
    },
    handleResetSearch () {
      this.searchPhone = ''
      this.getDataList()
    }
  }
}
</script>
