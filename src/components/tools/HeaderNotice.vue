<template>
  <a-popover
    v-model="visible"
    trigger="click"
    placement="bottomRight"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    overlayClassName="header-notice-wrapper"
    :overlayStyle="{ width: '300px', top: '50px' }">
    <template slot="content">
      <a-spin :spinning="loadding">
        <a-list>
          <a-list-item v-for="msg in msglist" :key="msg.id">
            <router-link :to="{ name: 'MsgList' }">
              <a-list-item-meta :description="getTimeDiff(msg.crtTime)" :title="msg.title">
                <a-avatar style="background-color: white" slot="avatar" :src="getImgPath(msg.type)"/>
              </a-list-item-meta>
            </router-link>
          </a-list-item>
          <a-list-item key="item-all" style="margin-left:45px;margin-top:10px">
            <router-link :to="{ name: 'MsgList' }">
              <a-list-item-meta title="查看全部">
              </a-list-item-meta>
            </router-link>
          </a-list-item>
        </a-list>
      </a-spin>
    </template>
    <span @click="fetchNotice" class="header-notice">
      <a-badge count="12">
        <a-icon style="font-size: 16px; padding: 4px" type="bell" />
      </a-badge>
    </span>
  </a-popover>
</template>

<script>
import { getMsg } from '@/api/admin'
export default {
  name: 'HeaderNotice',
  data () {
    return {
      loadding: false,
      visible: false,
      msglist: []
    }
  },
  methods: {
    fetchNotice () {
      if (!this.visible) {
        this.loadding = true
        return getMsg().then(res => {
          if (res.status === 200) {
            this.msglist = res.result.data
            this.loadding = false
          }
        })
      } else {
        this.loadding = false
      }
      this.visible = !this.visible
    },
    /**
     * 根据消息类型获取消息图标
     */
    getImgPath (item) {
      if (item === '1') {
        return '/tools/Icon-msg-admin.png'
      } else {
        return '/tools/Icon-msg-sys.png'
      }
    },
    /**
     * 点击消息内容，将当前页刷新为消息管理页
     */
    clickMsg () {

    },
    getTimeDiff (value) {
      var minute = 1000 * 60
      var hour = minute * 60
      var day = hour * 24
      var week = day * 7
      var month = day * 30
      // 获取当前时间
      const nowTime = new Date().getTime()
      const time = nowTime - value
      let result
      if (time < 0) {
        result = ''
      } else if (time / month >= 1) {
        result = '发布于' + parseInt(time / month) + '月前'
      } else if (time / week >= 1) {
        result = '发布于' + parseInt(time / week) + '周前'
      } else if (time / day >= 1) {
        result = '发布于' + parseInt(time / day) + '天前'
      } else if (time / hour >= 1) {
        result = '发布于' + parseInt(time / hour) + '小时前'
      } else if (time / minute >= 1) {
        result = '发布于' + parseInt(time / minute) + '分钟前'
      } else {
        result = '刚刚发布'
      }
      return result
    }
  }
}
</script>

<style lang="css">
  .header-notice-wrapper {
    top: 50px !important;
  }
</style>
<style lang="less" scoped>
  .header-notice{
    display: inline-block;
    transition: all 0.3s;

    span {
      vertical-align: initial;
    }
  }
</style>
