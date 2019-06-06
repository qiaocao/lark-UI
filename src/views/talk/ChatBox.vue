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
    console.log('jihainan')
    next(vm => vm.$children[0].getCacheMessage())
  },
  data () {
    return {}
  }
}
</script>
<style lang="less" scoped>
</style>
