<template>
  <div>
    <a-card>
      <div class="serch_for">
        <span class="flex">
          上传者: <a-input v-model="userName" placeholder="输入上传者名字" style="width:115px"/>
        </span>
        <span class="flex">
          文件名: <a-input v-model="fileName" placeholder="输入文件名" style="width:85px"/>
        </span>
        <span class="flex">
          文件类型:
          <a-select defaultValue="请选择" style="width: 90px" @change="handleChange">
            <a-select-option value="">不限制</a-select-option>
            <a-select-option value="1">群文件</a-select-option>
            <a-select-option value="0">个人文件</a-select-option>
          </a-select>
        </span>
        <span class="flex">
          密级:
          <a-select defaultValue="请选择" style="width: 90px" @change="handleChanges">
            <a-select-option value="">不限制</a-select-option>
            <a-select-option value="30">非密</a-select-option>
            <a-select-option value="40">秘密</a-select-option>
            <a-select-option value="60">机密</a-select-option>
          </a-select>
        </span>
        <span class="flex" style="width: 23%">
          时间: <a-range-picker @change="onChange" style="width: 170px;" />

        </span>
        <span class="flex" style="width: 10%">
          <a-button type="primary" @click="onChangeAll">查询</a-button>
        </span>
      </div>
      <a-table :columns="columns" :loading="spinning" :dataSource="data" :pagination="false">
        <a class="file_name_all" style="" slot="name" slot-scope="text">{{ text }}</a>
        <span slot="customTitle"> 文件名</span>
        <span slot="tags" slot-scope="tags, record">
          <a-tag :color="record.color">{{ tags }}</a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <a :href="genDownLoadPath(record)" v-if="record.levels === '非密'">下载</a>
        </span>
      </a-table>
      <a-pagination style="float: right" @change="onChanges" :total="total" />
    </a-card>
  </div>
</template>
<script>

import { debounce } from '@/utils/util.js'
import api from '@/api/talk.js'
import { fileAll } from '@/api/admin.js'
const columns = [{
  dataIndex: 'fileName',
  key: 'name',
  slots: { title: 'customTitle' },
  scopedSlots: { customRender: 'name' }
}, {
  title: '文件大小',
  dataIndex: 'fileSize',
  key: 'fileSize'
}, {
  title: '上传者',
  dataIndex: 'uploadUserName',
  key: 'uploadUserName'
}, {
  title: '上传时间',
  key: 'uploadTime',
  dataIndex: 'uploadTime'
},
{
  title: '文件类型',
  key: 'isGroup',
  dataIndex: 'isGroup'
},
{
  title: '密级',
  key: 'levels',
  dataIndex: 'levels',
  scopedSlots: { customRender: 'tags' }
}, {
  title: '',
  key: 'action',
  scopedSlots: { customRender: 'action' }
}]
export default {
  data () {
    return {
      data: [],
      columns,
      color: 'tomato',
      userName: '',
      fileName: '',
      values: '',
      value: '',
      dataString: '',
      current: 1,
      dateBegin: '',
      dateEnd: '',
      pageSize: 5,
      total: 5,
      spinning: false
    }
  },
  created () {
    this.getTable()
    this.$watch('userName', debounce((newQuery) => {
      this.$emit('userName', newQuery)
      this.userName = newQuery
    }, 500))
    this.$watch('fileName', debounce((newQuery) => {
      this.$emit('fileName', newQuery)
      this.fileName = newQuery
    }, 500))
  },
  mounted () {
  },
  methods: {
    handleChange (value) {
      this.value = value
    },
    handleChanges (value) {
      this.values = value
    },
    onChange (date, dateString) {
      this.dateBegin = dateString[0]
      this.dateEnd = dateString[1]
    },
    onChanges (current) {
      this.current = current
      this.getTable()
    },
    onChangeAll () {
      if (this.userName === undefined) {
        this.userName = ''
      }
      if (this.fileName === undefined) {
        this.fileName = ''
      }
      if (this.value === undefined) {
        this.value = ''
      }
      if (this.values === undefined) {
        this.values = ''
      }
      if (this.dateBegin === undefined) {
        this.dateBegin = ''
      }
      if (this.dateEnd === undefined) {
        this.dateEnd = ''
      }
      if (this.current === undefined) {
        this.current = 1
      }
      this.current = 1
      this.getTable()
    },
    genDownLoadPath (fileId) {
      return api.fileDownload + '?fileId=' + fileId.fileId
    },
    getTable () {
      this.spinning = true
      const options = {
        userName: this.userName,
        fileName: this.fileName,
        isGroup: this.value,
        level: this.values,
        dateBegin: this.dateBegin,
        dateEnd: this.dateEnd,
        page: this.current,
        size: 10
      }
      fileAll(options).then(res => {
        this.spinning = false
        res.result.data.map(res => {
          if (res.isGroup === '0') {
            res.isGroup = '个人文件'
          } else {
            res.isGroup = '群文件'
          }
          res.fileSize = res.fileSize + 'M'
          if (res.levels === '30') {
            res.levels = '非密'
            res.color = ''
          } else if (res.levels === '40') {
            res.levels = '秘密'
            res.color = 'orange'
          } else if (res.levels === '60') {
            res.levels = '机密'
            res.color = 'tomato'
          }
          this.fileId = res.fileId
        })
        this.total = res.result.totalCount
        this.data = res.result.data
      })
    }
  }
}
</script>
<style lang='less' scoped>
    .flex{
        flex: 1;
        display: inline-block;
        width: 16%;
        margin: auto
    }
    .ant-table-row{
      td{
        width: 25px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .serch_for{
       margin-left: 20px;
       width: 100%;
       display: flex
    }
    .example {
      text-align: center;
      background: rgba(0,0,0,0.05);
      border-radius: 4px;
      margin-bottom: 20px;
      padding: 30px 50px;
      margin: 20px 0;
    }
    .file_name_all{
      max-width: 230px;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
</style>
