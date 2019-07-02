<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="8" type="flex" justify="end">
          <a-col :md="4" :sm="24">
            <a-form-item label="词汇类型">
              <a-select placeholder="请选择" v-model="queryParam.wordType">
                <a-select-option value="1">涉密</a-select-option>
                <a-select-option value="2">敏感</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="词汇名称">
              <a-input placeholder="请输入" v-model="queryParam.wordName"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="替换词汇">
              <a-input placeholder="请输入" v-model="queryParam.replaceName"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" v-model="queryParam.isUse">
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="0">停用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24" :offset="1">
            <span class="table-page-search-submitButtons">
              <a-row>
                <a-col :md="4">
                  <a-button type="primary" @click="search">查询</a-button>
                </a-col>
                <a-col :md="4">
                  <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
                </a-col>
                <a-col :md="7">
                  <a-button type="primary" style="margin-left: 30px" @click="handleAdd()">新增</a-button>
                </a-col>
                <a-col :md="9">
                  <a-upload name="file" @change="uploadChange" :fileList="fileList" :customRequest="customRequest" :beforeUpload="beforeUpload">
                    <a-button>
                      <a-icon type="upload" />批量导入
                    </a-button>
                  </a-upload>
                </a-col>
              </a-row>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      ref="stable"
      size="default"
      :columns="columns"
      :data="loadData"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="record.isUse==='1'" @click="handleStatus(record,'0')">停用</a>
        <a v-if="record.isUse==='0'" @click="handleStatus(record,'1')">启用</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a @click="handleDetail(record)">详情</a>
            </a-menu-item>
            <a-menu-item>
              <a @click="handleDelete(record)">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>
    <a-modal
      title="操作"
      style="top: 100px;"
      :width="800"
      v-model="editVisible"
      @ok="handleEditOk"
      :confirmLoading="confirmLoading"
    >
      <a-form :form="editForm">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="词汇编码"
        >
          <a-input :disabled="true" v-decorator="['wordCode']"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="词汇类型"
          hasFeedback
        >
          <a-select v-decorator="['wordType',{rules: [{ required: true, message: '请填写词汇类型' }]}]" :disabled="inDetail" @change="typeChange">
            <a-select-option value="1">涉密</a-select-option>
            <a-select-option value="2">敏感</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="词汇名称"
          hasFeedback
        >
          <a-input v-decorator="['wordName',{rules: [{ required: true, message: '请填写词汇名称' }]}]" :disabled="inDetail"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="替换词汇"
          hasFeedback
          v-if="type==='2'"
        >
          <a-input v-decorator="['replaceWord',{rules: [{ required: true, message: '请填写替换词汇' }]}]" :disabled="inDetail"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建人"
          hasFeedback
          v-if="inDetail"
        >
          <a-input v-decorator="['crtUser']" :disabled="inDetail"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建时间"
          hasFeedback
          v-if="inDetail"
        >
          <a-input v-decorator="['crtTime']" :disabled="inDetail"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="修改人"
          hasFeedback
          v-if="inDetail"
        >
          <a-input v-decorator="['updUser']" :disabled="inDetail"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="修改时间"
          hasFeedback
          v-if="inDetail"
        >
          <a-input v-decorator="['updTime']" :disabled="inDetail"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>
<script>
import { STable } from '@/components'
import { getWordList, addWord, updateWord, delWord, importWords } from '@/api/admin'
export default {
  name: 'DictWord',
  components: {
    STable
  },
  data () {
    return {
      // 编辑弹出框
      editVisible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      editForm: this.$form.createForm(this),
      // 查询参数
      queryParam: {},
      inDetail: false,
      inAdd: false,
      inEdit: false,
      // 词汇类型
      type: '',
      // 表头
      columns: [
        {
          title: '词汇编码',
          dataIndex: 'wordCode'
        },
        {
          title: '词汇类型',
          dataIndex: 'wordType'
        },
        {
          title: '词汇名称',
          dataIndex: 'wordName'
        },
        {
          title: '替换词汇',
          dataIndex: 'replaceWord'
        },
        {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getWordList(parameter)
          .then(res => {
            return res.result
          })
      },
      confirmLoading: false,
      id: '',
      fileList: []
    }
  },
  created () {
  },
  methods: {
    /**
     * 搜索
     */
    search () {
      this.$refs.stable.loadData({}, this.queryParam, {})
    },
    /**
     * 新增弹出框
     */
    handleAdd () {
      this.inDetail = false
      this.inEdit = false
      this.inAdd = true
      this.bindForm()
    },
    /**
     * 停用/启用
     */
    handleStatus (record, isUse) {
      this.confirmLoading = true
      updateWord(record).then(
        res => {
          this.handleResult(res)
        }
      ).catch((err) =>
        this.handleCatch(err)
      )
    },
    /**
     * 详情
     */
    handleDetail (record) {
      this.inDetail = true
      this.inEdit = false
      this.inAdd = false
      this.bindForm(record)
    },
    /**
     * 编辑
     */
    handleEdit (record) {
      this.inDetail = false
      this.inEdit = true
      this.inAdd = false
      this.bindForm(record)
    },
    /**
     * 删除
     */
    handleDelete (record) {
      const _this = this
      _this.confirmLoading = true
      this.$confirm({
        title: '警告',
        content: `确认要删除 ${record.name} 的信息吗?`,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          delWord(record.id).then(
            res => {
              _this.handleResult(res)
            }
          ).catch((err) =>
            _this.handleCatch(err)
          )
        },
        onCancel: () => {
          _this.$notification['info']({
            message: '取消删除操作',
            duration: 4
          })
        }
      })
    },
    /**
     * 保存
     */
    handleEditOk () {
      if (this.inDetail) {
        this.editVisible = false
        return
      }
      this.editForm.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          if (this.inAdd) {
            addWord(values).then(
              res => {
                this.handleResult(res)
              }
            ).catch((err) =>
              this.handleCatch(err)
            )
          } else if (this.inEdit) {
            updateWord(values).then(
              res => {
                this.handleResult(res)
              }
            ).catch((err) =>
              this.handleCatch(err)
            )
          }
        }
      })
    },
    /**
     * 绑定表单值
     */
    bindForm (record) {
      if (record) {
        this.id = record.id
      } else {
        this.wordType = ''
      }
      setTimeout(() => {
        this.editForm.setFieldsValue({
          wordType: '',
          wordName: '',
          replaceWord: ''
        })
      }, 0)
      this.editVisible = true
    },
    /**
     * 词汇类型变化
     */
    typeChange (value) {
      this.type = value
    },
    /**
     * 请求接口后返回的结果
     */
    handleResult (res) {
      if (res.status === 200) {
        this.$notification['success']({
          message: '操作成功',
          duration: 2
        })
        // 关闭编辑框
        this.editVisible = false
        // 刷新列表
        this.$refs.stable.refresh(true)
      } else {
        this.$notification['error']({
          message: res.message,
          duration: 4
        })
      }
      this.confirmLoading = false
    },
    /**
     * 请求接口发生异常
     */
    handleCatch (err) {
      if (err || err.response || err.response) {
        this.$notification['error']({
          message: err.response.data.message,
          duration: 4
        })
      }
      this.confirmLoading = false
    },
    uploadChange (info) {
      // 上传的文件不显示在主页
      this.fileList = []
      this.filename = info.file.name
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        this.loading = false
      }
    },

    /**
     * 重写上传action方法
     */
    customRequest (data) {
      const formData = new FormData()
      formData.append('file', data.file)
      data.onProgress()
      importWords(formData).then(res => {
        if (res.status === 200) {
          // const imageUrl = res.result
          // vue-cropper插件img绑定url时，会有跨域问题，图片类型转base64传递到子组件
          this.getBase64(data.file, (imageUrl) => {
            this.$refs.modal.edit(imageUrl)
          })
        }
      })
    },
    /**
     * 上传前文件类型及尺寸的校验
     */
    beforeUpload (file) {
      // 校验上传文件类型
      console.log('file.type', file.type)
      const isExcel = file.type === 'excel'
      if (!isExcel) {
        this.$notification['error']({
          message: '请上传Excel文件',
          duration: 4
        })
      }
      // 校验上传文件尺寸
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$notification['error']({
          message: '请上传尺寸小于10MB的图片',
          duration: 4
        })
      }
      return isExcel && isLt10M
    }
  }
}
</script>
