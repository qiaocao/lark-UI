<template>
  <div>
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline" ref="form">
          <a-row :gutter="32" type="flex" justify="end">
            <a-col :span="4">
              <a-form-item label="操作人">
                <a-input v-model="queryParam.crtName"/>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item label="主机ip">
                <a-input v-model="queryParam.crtHost"/>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item label="操作类型">
                <a-select placeholder="请选择" v-model="queryParam.opt">
                  <a-select-option value="GET">查询</a-select-option>
                  <a-select-option value="POST">添加</a-select-option>
                  <a-select-option value="PUT">修改</a-select-option>
                  <a-select-option value="DELETE">删除</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item label="操作时间">
                <a-date-picker @change="onChange"/>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item label="菜单">
                <a-input v-model="queryParam.menu"/>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="search">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
                <a-button type="primary" style="margin-left: 15px" @click="exportData" :loading="loading" v-action:export>导出</a-button>
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
      </s-table>
    </a-card>
  </div>
</template>
<script>
// var fileDownload = require("js-file-download")
import { STable } from '@/components'
import { getGateLog, exportGateLog } from '@/api/admin'
export default {
  name: 'GateLogList',
  components: {
    STable
  },
  data () {
    return {
      queryParam: {},
      // 表头
      columns: [
        {
          title: '菜单',
          dataIndex: 'menu'
        },
        {
          title: '请求',
          dataIndex: 'opt'
        },
        {
          title: 'uri',
          dataIndex: 'uri'
        },
        // {
        //   title: '创建账号',
        //   dataIndex: 'crtUser'
        // },
        {
          title: '操作人',
          dataIndex: 'crtName'
        },
        {
          title: '操作人id',
          dataIndex: 'pid'
        },
        {
          title: '操作时间',
          dataIndex: 'crtTime'
        },
        {
          title: '主机ip',
          dataIndex: 'crtHost'
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
        return getGateLog(Object.assign(parameter, this.queryParam)).then(res => {
          return res.result
        })
      },
      loading: false,
      dataStr: ''
    }
  },
  methods: {
    /**
     * 搜索
     */
    search () {
      this.queryParam.crtTime = this.dataStr
      this.$refs.stable.loadData({}, this.queryParam, {})
    },
    onChange (date, datestr) {
      this.dataStr = datestr
    },
    /**
     * 导出数据
     */
    exportData () {
      this.loading = true
      exportGateLog().then(res => {
        this.download(res)
        this.loading = false
      }).catch(() =>
        this.$notification['error']({
          message: '出现异常，请联系系统管理员',
          duration: 4
        })
      )
    },
    /**
     * 下载
     */
    download (data) {
      if (!data) {
        return
      }
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      // 获取文件名
      // download 属性定义了下载链接的地址而不是跳转路径
      link.setAttribute('download', '日志列表.xls')
      document.body.appendChild(link)
      link.click()
    }
  }
}
</script>
