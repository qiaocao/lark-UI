<template>
  <div style="height: 100%">
    <user-chat :chatInfo="currentChat"/>
  </div>
</template>
<script>
import { Chat as UserChat } from '@/components/Talk'
export default {
  name: 'ChatBox',
  components: {
    UserChat
  },
  data () {
    return {
      currentChat: {}
    }
  },
  watch: {
    '$route.query': function (newValue) {
      this.currentChat = newValue
    }
  }
}
</script>
<style lang="less" scoped>

</style>
