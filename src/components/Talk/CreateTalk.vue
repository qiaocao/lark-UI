<template>
  <a-modal
    v-model="visible"
    :maskClosable="false"
    :width="650"
    style="top: 20px;"
    destroyOnClose
  >
    <!-- 标题 -->
    <template slot="title">
      <div class="create-talk-title">创建研讨组</div>
    </template>

    <a-form
      :form="form"
      formLayout="horizontal"
    >
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="名称"
      >
        <a-input
          v-decorator="['groupName', {rules: [{
            required: true, message: '研讨组名称不能为空',
          }, {
            max: 20, message: '名字太长了'
          }, {
            whitespace: true, message: '名称不能为空'
          }]}]"
          placeholder="给研讨组起一个名字"
        >
        </a-input>
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="密级"
      >
        <a-select
          v-decorator="['levels', {rules: [{
            required: true, message: '研讨组密级不能为空',
          }]}]"
          @change="handleSecretChange"
          placeholder="设置研讨组密级"
        >
          <a-select-option v-for="item in secretOption" :key="item" :value="item">
            {{ item | fileSecret }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="项目"
      >
        <a-input
          v-decorator="['pname', {rules: [{
            required: true, message: '项目不能为空',
          }]}]"
          placeholder="请填写研讨组所属项目"
        />
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="范围"
      >
        <a-input
          v-decorator="['scop', {}]"
          type="textarea"
          placeholder="填写研讨组讨论范围（可选）"
        />
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="描述"
      >
        <a-input
          v-decorator="['groupDescribe', {}]"
          type="textarea"
          placeholder="研讨组的详细信息（可选）"
        />
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        label="成员"
      >
        <a-transfer
          v-decorator="['userList', {rules: [{
            required: true, message: '请选择研讨组成员',
          }]}]"
          :dataSource="allUsers"
          showSearch
          :listStyle="{
            width: '200px',
            height: '250px',
          }"
          :operations="['添加', '移除']"
          :filterOption="filterOption"
          :targetKeys="selectedUserIds"
          @change="handleChange"
          :render="item=>`${item.title}-${item.org}`"
        >
          <span slot="notFoundContent">
            没数据
          </span>
        </a-transfer>
      </a-form-item>
    </a-form>

    <!-- 操作按键 -->
    <template slot="footer">
      <a-button
        size="small"
        :loading="false"
        class="option-btn"
        @click="handleSubmit"
        type="primary"
        :disabled="hasErrors(form.getFieldsError())"
      >
        确定
      </a-button>

      <a-button
        size="small"
        :loading="false"
        class="option-btn"
        @click="handleCancel"
      >
        取消
      </a-button>
    </template>

  </a-modal>
</template>

<script>
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
  data () {
    return {
      visible: false,
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
    ...mapGetters(['userSecretLevel', 'userId', 'avatar', 'nickname']),
    secretOption () {
      return [60, 70, 80].filter(item => item <= this.userSecretLevel)
    }
  },
  watch: {
    showModal (fuc) {
      if (fuc()) this.visible = true
    }
  },
  methods: {
    /**
     * 根据密级变动获取可选人员列表
     * @param {Number} secretLevel 密级数字
     */
    handleSecretChange (secretLevel) {
      this.getUserFitSecret(secretLevel)
    },
    /** 关闭研讨组创建的弹窗 */
    handleCancel () {
      this.visible = false
    },
    /**
     * 获取符合秘籍要求的用户列表
     * @param {Number} secretLevel 密级数字
     */
    getUserFitSecret (secretLevel) {
      if (!secretLevel) return
      getUserBySecret().then(res => {
        if (res.status === 200) {
          this.allUsers = res.result.data
        }
      })
    },
    /** 人员筛选 */
    filterOption (inputValue, option) {
      return option.title.indexOf(inputValue) > -1 || option.org.indexOf(inputValue) > -1
    },
    /** 人员选择变动处理 */
    handleChange (targetKeys, direction, moveKeys) {
      this.selectedUserList = this.allUsers.filter(item => targetKeys.indexOf(item.key) > -1)
      this.selectedUserIds = targetKeys
    },
    /** 检查是否存在错误 */
    hasErrors (fieldsError) {
      return Object.keys(fieldsError).some(field => fieldsError[field])
    },
    /** 验证并提交表单 */
    handleSubmit  (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          values.userList = this.selectedUserList
          if (!this.selectedUserIds.includes(this.userId)) {
            values.userList.push({
              key: this.userId,
              img: this.avatar,
              title: this.nickname,
              userLevels: this.userSecretLevel
            })
          }
          Object.assign(values, {
            creator: this.userId,
            updator: this.userId,
            type: '6'
          })
          console.log('创建的数据：', values)
          console.log('像后台发送websocket请求:')
          console.log(new SocketMessage({ code: 4, data: values }).toString())
          try {
            this.SocketGlobal.send(new SocketMessage({
              code: 4,
              data: values
            }).toString())
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
