<template>
  <div>
    <a-card>
      <div class="serch_for">
        <!-- <span class="flex">
        创建人:<a-input v-model="userName" placeholder="输入上传者名字" style="width:115px"/>
      </span> -->
        <span class="flex">
          群组名称: <a-input v-model="groupName" placeholder="输入文件名" style="width:85px"/>
        </span>
        <span class="flex">
          是否关闭:
          <a-select defaultValue="请选择" v-model="value" style="width: 90px" @change="handleChange">
            <a-select-option value="">不限制</a-select-option>
            <a-select-option value="1">已关闭</a-select-option>
            <a-select-option value="0">未关闭</a-select-option>
          </a-select>
        </span>
        <!-- <span class="flex">
          是否跨越场所:
          <a-select defaultValue="请选择" style="width: 90px" @change="iscrossChange">
            <a-select-option value="">不限制</a-select-option>
            <a-select-option value="1">是</a-select-option>
            <a-select-option value="0">否</a-select-option>
          </a-select>
        </span> -->
        <span class="flex">
          密级:
          <a-select defaultValue="请选择" v-model="values" style="width: 90px" @change="handleChanges">
            <a-select-option value="">不限制</a-select-option>
            <a-select-option value="30">非密</a-select-option>
            <a-select-option value="40">秘密</a-select-option>
            <a-select-option value="60">机密</a-select-option>
          </a-select>
        </span>
        <span class="flex" style="width: 25%">
          时间: <a-range-picker @change="onChange" style="width: 170px;" />

        </span>
        <span class="flex" style="width: 10%">
          <a-button type="primary" @click="onChangeAll">查询</a-button>
          <a-button style="margin-left: 5px" @click="onChangeClear">重置</a-button>
        </span>
      </div>
      <a-table :columns="columns" :loading="spinning" :dataSource="data" :pagination="false">
        <a class="file_name_all" style="" slot="name" slot-scope="text">{{ text }}</a>
        <span slot="customTitle">群组名</span>
        <span slot="tags" slot-scope="tags, record">
          <a-tag :color="record.color">{{ tags }}</a-tag>
        </span>
        <span slot="action" slot-scope="record">
          <a @click="click(record)">详情</a>
          <a-divider type="vertical" />
          <a @click="operation(record)">操作</a>
        </span>
      </a-table>
      <a-pagination style="float: right" @change="onChanges" :total="total" />
      <!-- 详情弹框 -->
      <div id="components-modal-demo-position" >
        <a-modal
          :title="modelName"
          centered
          v-model="modal2Visible"
          @ok="() => modal2Visible = false"
        >
          <div>
            <div>
              <p class="p">密级</p>
              {{ levels }}
            </div>

            <div>
              <p class="p">创建人</p>
              {{ creatorName }}
            </div>
            <div>
              <p class="p">创建时间</p>
              {{ createTime }}
            </div>
            <a-tooltip :title="groupDescribe">
              <div class="group_describe">
                <p class="p">描述</p>
                {{ groupDescribe }}
              </div>
            </a-tooltip>
            <ul class="user_ul">
              <li class="o_li" v-for="item in listData" :key="item.groupId">
                <a-avatar class="group_list_img" shape="square" size="large" :src="item.avartar" >{{ item.name }}</a-avatar>
                <a-tooltip :title="item.name">
                  <span class="group_list_sp"> {{ item.name }}</span>
                </a-tooltip>
              </li>
            </ul>
          </div>
        </a-modal>
      </div>
      <!-- 操作弹框 -->
      <div id="components-modal-demo-position" >
        <a-modal
          title="群组操作"
          centered
          v-model="modal1Visible"
          @ok="() => modal1Visible = false"
        >
          <div>
            <p>占无操作选项</p>
          </div>
        </a-modal>
      </div>
    </a-card>
  </div>

</template>
<script>

import { debounce } from '@/utils/util.js'
import { getGroupMembers } from '@/api/talk.js'
import { groupAll } from '@/api/admin.js'

const columns = [{
  dataIndex: 'groupName',
  key: 'groupName',
  slots: { title: 'customTitle' },
  scopedSlots: { customRender: 'groupName' }
}, {
  title: '群成员人数',
  dataIndex: 'memberNums',
  key: 'memberNums'
}, {
  title: '创建者',
  dataIndex: 'creatorName',
  key: 'creatorName'
},
{
  title: '创建时间',
  key: 'createTime',
  dataIndex: 'createTime'
},
{
  title: '项目名称',
  key: 'pname',
  dataIndex: 'pname'
},
{
  title: '是否关闭',
  key: 'isclose',
  dataIndex: 'isclose'
},
{
  title: '是否跨越场所',
  key: 'iscross',
  dataIndex: 'iscross'
},
{
  title: '密级',
  key: 'tags',
  dataIndex: 'levels',
  scopedSlots: { customRender: 'tags' }
},
{
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
      groupName: '',
      values: '',
      value: '',
      iscross: '',
      current: 1,
      dateBegin: '',
      dateEnd: '',
      pageSize: 5,
      total: 5,
      spinning: false,
      modal2Visible: false,
      modal1Visible: false,
      modelName: '',
      groupDescribe: '',
      createTime: '',
      creatorName: '',
      levels: '',
      listData: []
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
    iscrossChange (value) {
      this.iscross = value
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
      if (this.groupName === undefined) {
        this.groupName = ''
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
    onChangeClear () {
      this.userName = ''
      this.groupName = ''
      this.value = ''
      this.values = ''
      this.dateBegin = ''
      this.dateEnd = ''
      this.iscross = ''
      this.getTable()
    },
    getTable () {
      this.spinning = true
      const options = {
        creator: this.userName,
        group_name: this.groupName,
        isclose: this.value,
        level: this.values,
        dateBegin: this.dateBegin,
        dateEnd: this.dateEnd,
        iscross: this.iscross,
        page: this.current,
        size: 10
      }
      groupAll(options).then(res => {
        this.spinning = false
        this.data = res.result.data
        res.result.data.map(res => {
          if (res.isclose === '0') {
            res.isclose = '未关闭'
          } else {
            res.isclose = '已关闭'
          }
          if (res.iscross === '1') {
            res.iscross = '已跨越'
          } else {
            res.iscross = '未跨越'
          }
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
      }).catch(res => {
        this.spinning = false
      })
    },
    setModal1Visible (modal1Visible) {
      this.modal1Visible = modal1Visible
    },
    click (record) {
      this.modal2Visible = true
      this.modelName = record.groupName
      this.groupDescribe = record.groupDescribe
      this.createTime = record.createTime
      this.creatorName = record.creatorName
      this.levels = record.levels
      getGroupMembers(record.groupId).then(res => {
        this.listData = res.result.data
      })
    },
    operation (record) {
      this.modal1Visible = true
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
    .p{
      display: inline-block;
      width: 100px;
    }
    .user_ul{
      list-style: none;
      padding: 0;
      margin-top: 30px;
      height: 200px;
      overflow: auto;
      .o_li{
        float: left;
        width: 40px;
        margin-left: 10px;
        .group_list_sp{
          width: 40px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          display: block;
          text-align: center
        }
      }
    }
    .group_describe{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      cursor: pointer;
    }
</style>
