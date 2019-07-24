<template>
  <a-drawer
    class="unpop-modal"
    title="组成员管理"
    wrapClassName="team-member"
    :width="400"
    @close="onClose"
    :visible="activeOption=='teamMember'"
    :wrapStyle="{overflow: 'auto', marginTop: '64px' }"
    :destroyOnClose="true"
    :closable="false"
  >
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
import { getGroupMembers } from '@/api/talk.js'
export default {
  props: {
    activeOption: {
      type: String,
      default: '',
      required: true
    },
    groupId: {
      type: String,
      default: '',
      required: false
    }
  },
  watch: {
    activeOption (newValue) {
      // const ary = []
      if (newValue === 'teamMember') {
        getGroupMembers(this.groupId).then(res => {
          const data = res.result.data
          this.userList = data
        })
      }
    }
  },
  methods: {
    onClose () {
      this.visible = false
      this.$emit('closeDrawer')
    }
  }
}
</script>
<style lang="less" scoped>
</style>
