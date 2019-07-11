<template>
  <div>
    <div class="serch_for">
      <span class="flex">
        上传者:<a-input v-model="userName" placeholder="输入上传者名字" style="width:115px"/>
      </span>
      <span class="flex">
        文件名:<a-input v-model="fileName" placeholder="输入文件名" style="width:85px"/>
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
        密集:
        <a-select defaultValue="请选择" style="width: 90px" @change="handleChanges">
          <a-select-option value="">不限制</a-select-option>
          <a-select-option value="30">非密</a-select-option>
          <a-select-option value="40">秘密</a-select-option>
          <a-select-option value="60">机密</a-select-option>
        </a-select>
      </span>
      <span class="flex" style="width: 23%">
        时间:<a-range-picker @change="onChange" style="width: 170px;" />

      </span>
      <span class="flex" style="width: 10%">
        <a-button type="primary" @click="onChangeAll">查询</a-button>
      </span>
    </div>
    <a-table :columns="columns" :dataSource="data" :pagination="false">
      <a slot="name" slot-scope="text" href="javascript:;">{{ text }}</a>
      <span slot="customTitle"> 文件名</span>
      <span slot="tags" slot-scope="tags, record">
        <a-tag :color="record.color">{{ tags }}</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a :href="genDownLoadPath(record)" v-if="record.levels === '非密'">下载</a>
      </span>
    </a-table>
    <a-pagination style="float: right" @change="onChanges" :total="total" />
  </div>
</template>
<script>

import { debounce } from '@/utils/util.js'
import { fileAll } from '@/api/admin.js'
import api from '@/api/talk'

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
  key: 'address'
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
  title: '密集',
  key: 'tags',
  dataIndex: 'levels',
  scopedSlots: { customRender: 'tags' }
}, {
  title: '',
  key: 'fileId',
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
      total: 5
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
      this.current = current
      this.getTable(this.userName, this.fileName, this.value, this.values, this.dateBegin, this.dateEnd, this.current)
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
      this.getTable(this.userName, this.fileName, this.value, this.values, this.dateBegin, this.dateEnd, this.current)
    },
    genDownLoadPath (fileId) {
      return api.fileDownload + '?fileId=' + fileId.fileId
    },
    getTable (userName, fileName, value, values, dateBegin, dateEnd, current) {
      const options = {
        userName: this.userName,
        fileName: this.fileName,
        value: this.value,
        values: this.values,
        dateBegin: this.dateBegin,
        dateEnd: this.dateEnd,
        page: this.current,
        size: 9
      }
      fileAll(options).then(res => {
        res.result.data.map(res => {
          if (res.isGroup === 1) {
            res.isGroup = '群文件'
          } else {
            res.isGroup = '个人文件'
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
</style>
