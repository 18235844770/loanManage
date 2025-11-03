<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <div class="flex">
            <div class="flex-item">

              <a-form-item class="flex-item" label="手机号">
                <a-input v-model="query.phone" placeholder="请输入手机号" style="width: 200px" allowClear />
              </a-form-item>
            </div>
            <div class="flex-item">
              <a-form-item class="flex-item" label="审核状态">
                <a-select v-model="query.loansState" placeholder="请选择状态" style="width: 160px">
                  <a-select-option :value="null">全部</a-select-option>
                  <a-select-option v-for="item in loansStateOptions" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div class="flex-item">
              <a-form-item class="flex-item">
              <a-button type="primary" @click="handleSearch">查询</a-button>
                <a-button style="margin-left:8px" @click="handleReset">重置</a-button>
                <a-button style="margin-left:8px" icon="reload" @click="handleRefresh">刷新</a-button>
              </a-form-item>
            </div>
          </div>
        </a-form>
      </div>

      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        rowKey="id"
        @change="handleTableChange"
      >
        <span slot="loanState" slot-scope="text, record">{{ mapLoanState(record.loanState) }}</span>
        <span slot="onlineStatus" slot-scope="text, record">{{ mapOnlineStatus(record.onlineStatus) }}</span>
        <span slot="roles" slot-scope="text, record">{{ (record.roles || []).join(',') || '-' }}</span>
        <span slot="action" slot-scope="text, record">
          <a @click="handleView(record)">查看</a>
          <a-divider type="vertical" />
          <a @click="handleReview(record)">审核</a>
        </span>
      </a-table>
      <!-- 详情弹窗 -->
      <a-modal title="详情" :visible="detailVisible" @ok="closeDetail" @cancel="closeDetail" :width="520">
        <div class="detail-wrapper">
          <p><strong>ID：</strong>{{ detailRecord.id || '-' }}</p>
          <p><strong>手机号：</strong>{{ detailRecord.phone || '-' }}</p>
          <p><strong>昵称：</strong>{{ detailRecord.nickname || '-' }}</p>
          <p><strong>银行卡号：</strong>{{ detailRecord.creditCardNumbers || '-' }}</p>
          <p><strong>身份证：</strong>{{ detailRecord.identitycard || '-' }}</p>
          <p><strong>审核状态：</strong>{{ detailRecord.loanStateText || '-' }}</p>
          <p><strong>贷款额度：</strong>{{ detailRecord.loanLimit != null ? detailRecord.loanLimit : '-' }}</p>
          <p><strong>贷款备注：</strong>{{ detailRecord.loanRemark != null ? detailRecord.loanRemark : '-' }}</p>
          <p><strong>角色：</strong>{{ detailRecord.rolesText || '-' }}</p>
          <p><strong>状态：</strong>{{ detailRecord.status != null ? detailRecord.status : '-' }}</p>
          <p><strong>创建时间：</strong>{{ detailRecord.createtime || '-' }}</p>
          <p><strong>更新时间：</strong>{{ detailRecord.updatetime || '-' }}</p>
        </div>
      </a-modal>
      <!-- 审核弹窗 -->
      <a-modal
        title="贷款审核"
        :visible="reviewVisible"
        :confirm-loading="reviewLoading"
        @ok="submitReview"
        @cancel="closeReview"
        :width="520"
      >
        <a-form :form="reviewForm" layout="vertical">
          <a-form-item label="贷款额度">
            <a-input-number style="width:100%" :min="0" :step="100" v-decorator="['loanLimit', { rules: [{ required: true, message: '请输入贷款额度' }] }]" />
          </a-form-item>
          <a-form-item label="审核状态">
            <a-select v-decorator="['loansSate', { initialValue: 'REVIEW', rules: [{ required: true, message: '请选择审核状态' }] }]">
              <a-select-option value="REVIEW">审核中</a-select-option>
              <a-select-option value="THROUGH">通过</a-select-option>
              <a-select-option value="REJECTED">拒绝</a-select-option>
              <a-select-option value="RELEASE">放款成功</a-select-option>
              <a-select-option value="APPLY_RELEASE">申请放款</a-select-option>
              <a-select-option value="REJECTED_RELEASE">拒绝放款</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="备注">
            <a-textarea :rows="4" placeholder="请输入备注" v-decorator="['loansRemark', { rules: [{ required: true, message: '请输入备注' }] }]" />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { getReviewList, setLoanLimit } from '@/api/business'

const loansStateOptions = [
  { value: 1, code: 'REVIEW', label: '审核中' },
  { value: 2, code: 'THROUGH', label: '通过' },
  { value: 3, code: 'REJECTED', label: '拒绝' },
  { value: 4, code: 'RELEASE', label: '放款成功' },
  { value: 5, code: 'APPLY_RELEASE', label: '申请放款' },
  { value: 6, code: 'REJECTED_RELEASE', label: '拒绝放款' }
]

export default {
  name: 'ReviewList',
  data () {
    return {
      loading: false,
      dataSource: [],
      query: {
        size: 10,
        page: 1,
        phone: '',
        loansState: null
      },
      pagination: {
        current: 1,
        size: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50']
      },
      loansStateOptions,
      detailVisible: false,
      detailRecord: {},
      reviewVisible: false,
      reviewLoading: false,
      reviewTarget: null,
      reviewForm: this.$form.createForm(this, { name: 'reviewForm' }),
      columns: [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: '手机号', dataIndex: 'phone', key: 'phone' },
        { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
        { title: '身份证', dataIndex: 'identitycard', key: 'identitycard' },
        { title: '创建时间', dataIndex: 'createtime', key: 'createtime' },
        { title: '审核状态', dataIndex: 'loanState', key: 'loanState', scopedSlots: { customRender: 'loanState' } },
        { title: '贷款额度', dataIndex: 'loanLimit', key: 'loanLimit' },
        { title: '状态', dataIndex: 'status', key: 'status' },
        { title: '操作', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    mapLoansState (value) {
      const item = loansStateOptions.find(i => i.value === value)
      return item ? item.label : '-'
    },
    mapLoanState (value) {
      if (value === 'REVIEW') return '审核中'
      if (value === 'THROUGH') return '通过'
      if (value === 'REJECTED') return '拒绝'
      if (value === 'RELEASE') return '放款成功'
      if (value === 'APPLY_RELEASE') return '申请放款'
      if (value === 'REJECTED_RELEASE') return '拒绝放款'
      return '-'
    },
    mapOnlineStatus (value) {
      if (value === 1) return '在线'
      if (value === 0) return '离线'
      return '-'
    },
    async fetch () {
      this.loading = true
      try {
        const params = { ...this.query }
        const res = await getReviewList(params)
        // 根据真实返回结构调整，这里假设 res.data.list & res.data.total
        const list = res.data?.records
        const total = res.data?.total
        this.dataSource = list
        this.pagination.total = total
      } catch (e) {
        this.$message.error('加载失败')
      } finally {
        this.loading = false
      }
    },
    handleSearch () {
      this.query.page = 1
      this.pagination.current = 1
      this.fetch()
    },
    handleReset () {
      this.query.phone = ''
      this.query.loansState = null
      this.handleSearch()
    },
    handleRefresh () {
      this.fetch()
      this.$message.success('刷新成功')
    },
    handleTableChange (pager) {
      this.query.page = pager.current
      this.query.size = pager.size
      this.pagination.current = pager.current
      this.pagination.size = pager.size
      this.fetch()
    },
    handleView (record) {
      this.detailRecord = {
        ...record,
        loanStateText: this.mapLoanState(record.loanState),
        onlineStatusText: this.mapOnlineStatus(record.onlineStatus),
        rolesText: (record.roles || []).join(',') || '-'
      }
      this.detailVisible = true
    },
    handleReview (record) {
      this.reviewTarget = record
      this.reviewVisible = true
      this.$nextTick(() => {
        this.reviewForm.resetFields()
        this.reviewForm.setFieldsValue({ loanLimit: record.loanLimit, loansSate: record.loanState, loansRemark: record.loanRemark })
      })
    },
    submitReview () {
      this.reviewForm.validateFields(async (err, values) => {
        if (err) return
        this.reviewLoading = true
        try {
          await setLoanLimit({ ...values, userId: String(this.reviewTarget.id) })
          this.$message.success('审核提交成功')
          this.reviewVisible = false
          this.fetch()
        } catch (e) {
          this.$message.error('审核提交失败')
        } finally {
          this.reviewLoading = false
        }
      })
    },
    closeReview () {
      this.reviewVisible = false
    },
    closeDetail () {
      this.detailVisible = false
    }
  }
}
</script>

<style scoped>
.table-page-search-wrapper { margin-bottom: 16px; }
.detail-wrapper { max-height: 60vh; overflow-y: auto; padding-right: 4px; }
.flex{
  display: flex;
}
.flex-item{
  margin-right: 20px;
}
</style>
