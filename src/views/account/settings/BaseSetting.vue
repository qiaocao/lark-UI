<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">

        <a-form layout="vertical" :form="form">
          <a-form-item
            label="姓名"
          >
            <a-input v-decorator="['name',{rules: [{ required: true, message: '请输入姓名' }]}]"/>
          </a-form-item>
          <a-form-item
            label="联系方式"
          >
            <a-input v-decorator="['telephone']"/>
          </a-form-item>
          <a-form-item
            label="描述"
          >
            <a-textarea rows="4" v-decorator="['discribe']"/>
          </a-form-item>
          <!--
          <a-form-item
            label="最近状态"
            :required="false"
          >
            <a-select defaultValue="aes-256-cfb">
              <a-select-option value="aes-256-cfb">出差中</a-select-option>
              <a-select-option value="aes-128-cfb">单位忙着呢</a-select-option>
              <a-select-option value="chacha20">累了休息</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="连接密码"
            :required="false"
          >
            <a-input placeholder="h3gSbecd"/>
          </a-form-item> -->
          <!-- <a-form-item
            label="登陆密码"
            :required="false"
          >
            <a-input placeholder="密码"/>
          </a-form-item>
          <a-button style="margin-left: 8px">保存</a-button>
          -->
          <a-form-item>
            <a-button type="primary">提交</a-button>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit(1)" >
          <a-icon type="cloud-upload-o" class="upload-icon"/>
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="option.img"/>
        </div>
      </a-col>
    </a-row>
    <avatar-modal ref="modal">
    </avatar-modal>
  </div>
</template>
<script>
import AvatarModal from './AvatarModal'
import { mapGetters } from 'vuex'
import pick from 'lodash.pick'
import { updateuser } from '@/api/admin'
export default {
  components: {
    AvatarModal
  },
  data () {
    return {
      // cropper
      preview: {},
      option: {
        img: '/avatar2.jpg',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      },
      form: this.$form.createForm(this)
    }
  },
  created () {
    const user = this.userInfo()
    this.$nextTick(() => {
      // 表单中绑定信息项
      this.form.setFieldsValue(pick(user, 'name', 'telephone'))
    })
  },
  methods: {
    // 从登陆时获取的人员信息中读取数据
    ...mapGetters(['userInfo']),
    /**
     * 提交修改内容
     */
    submitInfo () {
      console.log('userInfo', this.userInfo())
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          // TODO 后台保存用户信息调试，暂时使用和用户管理中的接口
          _this.saveInfo(values)
        }
      })
    },
    saveInfo (values) {
      return updateuser(
        values
      ).then(
        res => {
          if (res.status === 200) {
            this.$notification['success']({
              message: '提交成功',
              duration: 2
            })
          } else {
            this.$notification['error']({
              message: res.message,
              duration: 4
            })
          }
        }
      )
    }
    // TODO 上传头像方法 该接口暂未定义
  }
}
</script>
<style lang="less" scoped>
  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }
  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;
    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;
      &:hover {
        opacity: 1;
      }
      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }
    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
