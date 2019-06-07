<template>
  <div style="height: 100%">
    <user-chat :chatInfo="currentTalk"/>
  </div>
</template>
<script>
import { Chat as UserChat } from '@/components/Talk'
export default {
  name: 'ChatBox',
  // eslint-disable-next-line
  props: ['currentTalk'],
  components: {
    UserChat
  },
  beforeRouteEnter (to, from, next) {
    next()
  },
  beforeRouteLeave (to, from, next) {
    // 清除当前联系人信息
    this.$store.commit('SET_CURRENT_TALK', {})
    next()
  },
  data () {
    return {}
  }
}
</script>
<style lang="less" scoped>
</style>
