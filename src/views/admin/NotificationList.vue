<template>
  <div>
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="32" type="flex" justify="end">
            <a-col :span="4">
              <a-form-item label="标题">
                <a-input v-model="queryParam.titile"/>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="发布时间">
                <a-range-picker @change="onChange" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="search">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
                <a-button type="primary" style="margin-left: 30px" @click="openModal('1')">发布消息</a-button>
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
        :alert="false"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="openModal('2', record)">查看</a>
          </template>
        </span>
      </s-table>
    </a-card>
    <a-modal
      title="消息发布"
      style="top: 100px;"
      width="800px"
      v-model="visiable"
      :closable="false"
      :destroyOnClose="true"
      :okText="okText"
      @ok="handleOk"
    >
      <a-form :form="detailForm">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="标题"
        >
          <a-input v-decorator="['title']" :disabled="inView"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="附件"
          v-show="inView"
        >
          <a>文件名|支持点击下载</a>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="附件"
          v-show="inEdit"
        >
          <a-upload
            name="file"
            :multiple="true"
            action="https://www.easy-mock.com/mock/5cd3d62bd0717344110ebfb4/lark/api/admin/fileupload"
            :headers="headers"
            @change="uploadChange"
            @beforeUpload="beforeUpload"
          >
            <a-button>
              <a-icon type="upload" />上传
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="发布人"
          v-show="inView"
        >
          <a-input v-decorator="['crtUser']" :disabled="inView"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="发布时间"
          v-show="inView"
        >
          <a-input v-decorator="['crtTime']" :disabled="inView"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="内容"
        >
          <a-textarea :rows="5" v-decorator="['content']" :disabled="inView"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import STable from '@/components/table/'
import { getMsgPage, saveMsg } from '@/api/admin'
import pick from 'lodash.pick'
export default {
  name: 'NotificationList',
  components: {
    STable
  },
  data () {
    return {
      queryParam: {},
      visiable: false,
      disabled: true,
      inEdit: true,
      inView: true,
      detailForm: this.$form.createForm(this),
      // 设置上传的请求头部，IE10 以上有效
      headers: {
        authorization: 'authorization-text'
      },
      // 表头
      columns: [
        {
          title: '标题',
          dataIndex: 'title'
        },
        {
          title: '内容',
          dataIndex: 'content'
        },
        {
          title: '发布人',
          dataIndex: 'crtUser'
        },
        {
          title: '发布时间',
          dataIndex: 'crtTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getMsgPage(Object.assign(parameter, this.queryParam)).then(res => {
          return res.result
        })
      },
      fileList: [],
      okText: '确认'
    }
  },
  methods: {
    /**
     * 日期选择框 change事件
     */
    onChange (data, dataStr) {
      console.log('data', data, dataStr)
    },
    /**
     * 搜索
     * TODO 时间控件支持时间区间的查询，后台联调注意
     */
    search () {
      this.$refs.stable.loadData({}, this.queryParam, {})
    },
    /**
     * 发布消息弹出框
     */
    openModal (type, record) {
      this.visiable = true
      if (type === '1') {
        this.inEdit = true
        this.inView = false
        this.okText = '确认发布'
        this.$nextTick(() => {
          // 表单中绑定信息项
          this.detailForm.setFieldsValue({})
        })
      } else {
        this.inEdit = false
        this.inView = true
        this.$nextTick(() => {
          // 表单中绑定信息项
          this.detailForm.setFieldsValue(pick(record, 'title', 'content', 'crtUser', 'crtTime'))
        })
      }
    },
    /**
     * 上传文件change事件
     * TODO 后台联调
     * 如需支持点击超链接查看上传内容，需返回url（file.response.url）
     * uploadFile
     */
    uploadChange (info) {
      // TODO 如果上传文件数量有限制
      if (info.fileList.length > 1) {
        this.$notification['error']({
          message: '只能上传n个文件',
          duration: 4
        })
        return
      }
      this.fileList = info.fileList
      if (info.file.status !== 'uploading') {
        console.log('info.file', info.file)
        console.log('info.fileList', info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} 上传成功`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败`)
      }
    },
    /**
     * 在这添加上传限制 TODO
     * 限制文件大小
     * 限制文件类型
     */
    beforeUpload (file) {
      console.log('file', file)
      // const isJPG = file.type === 'image/jpeg'
      // if (!isJPG) {
      //   this.$message.error('You can only upload JPG file!')
      // }
      // const isLt2M = file.size / 1024 / 1024 < 2
      // if (!isLt2M) {
      //   this.$message.error('Image must smaller than 2MB!')
      // }
      // return isJPG && isLt2M
    },
    /**
     * 发布消息
     * TODO 后台调试
     */
    handleOk () {
      // this.fileList
      if (this.inEdit === true) {
        return saveMsg().then(res => {
          if (res.status === 200) {
            this.$notification['success']({
              message: '发布成功',
              duration: 2
            })
          } else {
            this.$notification['error']({
              message: res.message,
              duration: 4
            })
          }
        })
      } else {
        this.visiable = false
      }
    }
  }
}
</script>
<style>

</style>
