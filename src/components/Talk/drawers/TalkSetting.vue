<template>
  <a-drawer
    class="unpop-modal"
    title="研讨组设置"
    wrapClassName="talk-setting"
    :width="400"
    @close="onClose"
    :visible="activeOption=='moreInfo'"
    :wrapStyle="{overflow: 'auto', marginTop: '64px' }"
    :destroyOnClose="true"
    :closable="false"
  >
    <div class="talk-setting" ref="settingDrawer">
      <a-form :form="form" @submit="handleSubmit" class="group-setting">
        <a-form-item label="名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-input :defaultValue="setting.name" disabled />
        </a-form-item>
        <a-form-item label="密级" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-tag color="orange" v-if="setting.securityClass === '40'">秘密</a-tag>
          <a-tag color="tomato" v-if="setting.securityClass === '60'">机密</a-tag>
          <a-tag color v-if="setting.securityClass === '30'">非密</a-tag>
        </a-form-item>
        <a-form-item label="创建时间" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-input :defaultValue="setting.createTime" disabled />
        </a-form-item>
        <a-form-item label="管理员" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-input :defaultValue="setting.creatorName" disabled />
        </a-form-item>
        <a-form-item label="主题" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-textarea
            :defaultValue="setting.subject"
            placeholder="在这输入研讨主题..."
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
        </a-form-item>
        <a-form-item label="描述" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-textarea
            :defaultValue="setting.description"
            placeholder="在这输入研讨组描述信息..."
            :autosize="{ minRows: 4, maxRows: 8 }"
          />
        </a-form-item>
      </a-form>
      <element-footer>
        <a-button type="default" html-type="submit" block>保存修改</a-button>
        <a-button type="danger" html-type="submit" block>退出研讨组</a-button>
      </element-footer>
    </div>

    <!-- <div
      :style="{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
      }"
    >
      <a-button type="danger" @click="onClose" block>退出研讨组</a-button>
    </div>-->
    <!-- <ul class="setting_ul">
      <li v-for="(item) in userList" :key="item.key">
        <a-avatar
          shape="square"
          :src="item.avartar"
          style="height: 50px; line-height: 50px"
        >{{ item.name }}</a-avatar>
        <a-tooltip :title="item.name">
          <span class="setting_ul_sp">{{ item.name }}</span>
        </a-tooltip>
      </li>
    </ul>-->
  </a-drawer>
</template>
<script>
import { getTalksetting } from '@/api/talk.js'
import ElementFooter from '@/components/FooterToolbar/ElementFooter'
const data = ['1', '2', '1', '2', '1', '2']
export default {
  name: 'MoreInfo',
  components: {
    ElementFooter
  },
  props: {
    activeOption: {
      type: String,
      default: '',
      required: true
    },
    groupId: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      showMask: false,
      editable: false,
      data,
      // visible: false,
      setting: [],
      items: [],
      userList: []
    }
  },
  watch: {
    activeOption (newValue) {
      // const ary = []
      if (newValue === 'moreInfo') {
        getTalksetting(this.groupId).then(res => {
          const datas = res.result
          this.setting = datas
        })
        // getGroupMembers(this.groupId).then(res => {
        //   const data = res.result.data
        //   this.userList = data
        // })
      }
    }
  },
  methods: {
    handleChange (value) {
      console.log(value)
      this.text = value
    },
    edit () {
      this.editable = true
      // row = Object.assign({}, row)
    },
    save () {
      this.editable = false
    },
    cancel () {
      this.editable = false
    },
    onClose () {
      this.visible = false
      this.$emit('closeDrawer')
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('修改成功 ', values)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.group-setting {
  line-height: 16px;
}
.float {
  width: 65px;
  float: left;
  // margin-right: 20px;
  margin-bottom: 0;
}
.line_height {
  display: inline-block;
  text-align: left;
  text-indent: 2em;
  width: 320px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.setting_name {
  display: inline-block;
  width: 200px;
  margin-right: 50px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.secret {
  // width: 30px
  float: right;
  display: inline-block;
}
.one-line {
  display: inline;
}
.group-setting-title {
  display: inline-block;
  width: 65px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}
.group-setting-row {
  position: relative;
  padding: 16px 0 0;
  min-height: 18px;
}
.group-setting-person {
  clear: both;
  padding: 20px 9.5px;
}
.group-setting-people {
  position: relative;
  margin-right: 8px;
  margin-left: 7px;
  margin-bottom: 1em;
  float: left;
  text-align: center;
  cursor: pointer;
  width: 48px;
  height: 64px;
  overflow: hidden;
  .user-name {
    display: block;
    max-width: 40px;
    margin: 2px auto 0;
    font-size: 12px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 16px;
  }
}
.setting_ul {
  width: 360px;
  margin: 50px auto 100px;
  box-sizing: border-box;
  overflow: hidden;
  li {
    list-style: none;
    float: left;
    padding-right: 10px;
    img {
      width: 60px;
      height: 60px;
    }
    span {
      display: block;
      text-align: center;
      margin-bottom: 5px;
      width: 50px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .setting_ul_sp {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
    width: 50px;
  }
}
.number_of {
  display: inline-block;
  display: inline-block;
  text-align: left;
  text-indent: 2em;
}
.setting_list {
  margin-top: 10px;
  height: 40px;
}
</style>
