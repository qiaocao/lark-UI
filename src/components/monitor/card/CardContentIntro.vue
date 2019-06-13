<template>
  <div>
    <div style="margin:12px; text-align:center">
      <a-row :gutter="8">
        <a-col :span="6">
          <a-avatar :src="avatar" :size="72" icon="user" style="margin-left:36px"/>
        </a-col>
        <a-col :span="18">
          <div class="title">
            {{ timeFix }}，{{ user.name }}
            <span class="welcome-text">，{{ welcome() }}</span>
          </div>
          <div>主任设计师 | 十一室 - 工程信息化组</div>
        </a-col>
      </a-row>
      <a-row class="more-info" type="flex" justify="center">
        <a-col :span="8">
          <head-info title="任务数" content="56" :center="false" :bordered="false"/>
        </a-col>
        <a-col :span="8">
          <head-info title="团队排名" content="8/24" :center="false" :bordered="false"/>
        </a-col>
        <a-col :span="8">
          <head-info title="任务完成率" content="56%" :center="false"/>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import { timeFix } from '@/utils/util'
import { mapGetters } from 'vuex'
import HeadInfo from '@/components/tools/HeadInfo'
export default {
  components: { HeadInfo },
  data () {
    return {
      timeFix: timeFix(),
      avatar: '',
      user: {}
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
  },
  methods: {
    ...mapGetters(['nickname', 'welcome'])
  }
}
</script>
<style lang="less" scoped>
  .project-list {
    .project-card-grid {
      width: 100%;
    }
  }

  .more-info {
    border: 0;
    padding-top: 16px;
    margin: 36px 0 36px;
  }

  .headerContent .title .welcome-text {
    display: none;
  }
  .title{
    font-size: 20px;
    line-height: 28px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 16px;
    -webkit-box-flex: 1;
    -ms-flex: auto;
    flex: auto;
  }
</style>
