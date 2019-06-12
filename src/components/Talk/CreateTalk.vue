<template>
  <a-modal
    v-model="visible"
    :maskClosable="false"
    :width="800"
    destroyOnClose
  >
    <!-- 标题 -->
    <template slot="title">
      <div class="create-talk-title">创建研讨组</div>
    </template>

    <a-form :form="form" formLayout="horizontal">
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="名称"
        help="请填写群组名称"
      >
        <a-input
          v-decorator="['groupName', {rules: [{
            required: true, message: '请填写群组名称',
          }]}]"
          placeholder="群组名称">
        </a-input>
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="密级"
        help="请选择群组密级"
      >
        <a-select
          v-decorator="['levels', {rules: [{
            required: true, message: '请选择群组密级',
          }]}]"
          @change="handleSecretChange">
          <a-select-option v-for="item in secretOption" :key="item" :value="item">
            {{ item | fileSecret }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="项目名称"
        help="请填写项目名称"
      >
        <a-input
          v-decorator="['pname', {rules: [{
            required: true, message: '请填写项目名称',
          }]}]" />
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="参与范围"
        help="请填写群组主题"
      >
        <a-input
          v-decorator="['scop', {}]"
          type="textarea" />
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="描述"
        help="请填写群组描述"
      >
        <a-input
          v-decorator="['groupDescribe', {}]"
          type="textarea" />
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="成员"
        help="请选择成员"
      >
        <a-transfer
          v-decorator="['userList', {rules: [{
            required: true, message: '请选择成员',
          }]}]"
          :dataSource="allUsers"
          showSearch
          :listStyle="{
            width: '250px',
            height: '300px',
          }"
          :operations="['添加', '移除']"
          :filterOption="filterOption"
          :targetKeys="selectedUserIds"
          @change="handleChange"
          :render="item=>`${item.title}-${$options.filters.peopleSecret(item.userLevels)}`"
        >
          <a-button
            size="small"
            style="float:right;margin: 5px"
            @click="getUserFitSecret"
            slot="footer"
          >
            reload
          </a-button>
          <span
            slot="notFoundContent"
          >
            没数据
          </span>
        </a-transfer>
      </a-form-item>
    </a-form>

    <!-- 操作按键 -->
    <template slot="footer">
      <a-button size="small" :loading="false" class="option-btn" @click="handleSubmit" type="primary">确定</a-button>
      <a-button size="small" :loading="false" class="option-btn" @click="handleCancel">取消</a-button>
    </template>

    <!-- 人员选择框 -->
    <UserTransfer ref="userSelector" />
  </a-modal>
</template>

<script>
import UserTransfer from '@/components/admin/UserTransfer'
import { getUserBySecret } from '@/api/admin'
import { SocketMessage } from '@/utils/talk'
import { mapGetters } from 'vuex'
export default {
  name: 'CreateTalk',
  props: {
    // 显示显示模态框,需要一个返回true或者false的方法
    showModal: {
      type: Function,
      required: true
    }
  },
  components: { UserTransfer },
  data () {
    return {
      visible: false,
      secretOption: [60, 70, 80],

      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 }
      },
      allUsers: [],
      selectedUserIds: [],
      selectedUserList: [],
      form: this.$form.createForm(this)
    }
  },
  computed: {
    ...mapGetters(['userSecretLevel', 'userId', 'avatar', 'nickname'])
  },
  watch: {
    showModal (fuc) {
      if (fuc()) this.visible = true
    }
  },
  methods: {
    handleSecretChange (secretLevel) {
      this.getUserFitSecret(secretLevel)
    },
    handleCancel () {
      this.visible = false
    },
    getUserFitSecret (secretLevel) {
      if (!secretLevel) return
      getUserBySecret().then(res => {
        if (res.status === 200) {
          this.allUsers = res.result.data
        }
      })
    },
    filterOption (inputValue, option) {
      return option.title.indexOf(inputValue) > -1
    },
    handleChange (targetKeys, direction, moveKeys) {
      this.selectedUserList = this.allUsers.filter(item => targetKeys.indexOf(item.key) > -1)
      this.selectedUserIds = targetKeys
    },
    handleSubmit  (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          values.userList = this.selectedUserList
          values.userList.push({
            key: this.userId,
            img: this.avatar,
            title: this.nickname,
            userLevels: this.userSecretLevel
          })
          Object.assign(values, {
            creator: this.userId,
            updator: this.userId,
            type: '6'
          })
          console.log('创建的数据：', values)
          console.log('像后台发送websocket请求:')
          console.log(new SocketMessage({ code: 4, data: values }).toString())
          try {
            this.SocketGlobal.send(new SocketMessage({ code: 4, data: values }).toString())
          } catch (error) {
            this.$message.error('创建失败，请稍后再试', 3)
          }

          this.visible = false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .create-talk-title {
    text-align: center;
  }

  .option-btn {
    padding: 0 20px;
  }
</style>
