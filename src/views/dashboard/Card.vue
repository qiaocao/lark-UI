<template>
  <div>
    <a-card
      :loading="loading"
      :headStyle="headStyle"
      :bodyStyle="bodyStyle"
      :bordered="true"
      :title="content.title"
      :style="{ minHeight: '350px', borderRadius: '4px' }">
      <a-popover
        placement="left"
        slot="extra"
        trigger="click">
        <template slot="content">
          <a slot="content">移除卡片</a>
        </template>
        <a href="#"><a-icon type="ellipsis" /></a>
      </a-popover>
      <div v-if="content.type=='info'">
        <card-content-info :listData="contentData"/>
        <div style="justify-content: center;position: absolute;bottom: 0;width: 100%;">
          <a-button class="footer-more" size="small" ghost block>全部</a-button>
        </div>
      </div>
      <div v-else-if="content.type=='react'">
        <card-content-react :listData="contentData"/>
        <div style="justify-content: center;position: absolute;bottom: 0;width: 100%;">
          <a-button class="footer-more" size="small" ghost block>全部</a-button>
        </div>
      </div>
      <div v-else-if="content.type=='activity'">
        <card-content-activity :listData="contentData"/>
        <div style="justify-content: center;position: absolute;bottom: 0;width: 100%;">
          <a-button class="footer-more" size="small" ghost block>全部</a-button>
        </div>
      </div>
      <div v-else-if="content.type=='local'" style="height: 100%">
        <card-content-local :listData="contentData"/>
      </div>
      <div v-else-if="content.type=='graph'">
        <card-content-graph :listData="contentData"/>
      </div>
    </a-card>
  </div>
</template>
<script>
import CardContentInfo from '@/components/monitor/card/CardContentInfo'
import CardContentLocal from '@/components/monitor/card/CardContentLocal'
import CardContentReact from '@/components/monitor/card/CardContentReact'
import CardContentActivity from '@/components/monitor/card/CardContentActivity'
import CardContentGraph from '@/components/monitor/card/CardContentGraph'

export default {
  name: 'Card',
  components: {
    CardContentInfo,
    CardContentLocal,
    CardContentReact,
    CardContentActivity,
    CardContentGraph
  },
  data () {
    return {
      loading: true,
      headStyle: { height: '52px', 'border-top': '4px solid #1890ff', 'border-bottom': 'none' },
      bodyStyle: { padding: '0', height: '295px' },
      content: this.cardData,
      contentData: []
    }
  },
  props: {
    cardData: {
      type: Object,
      required: true
    }
  },
  created () {
    this.$http.get(this.content.url)
      .then(res => {
        this.loading = false
        this.contentData = res.result.data
      })
  }
}
</script>
<style lang="less" scoped>
.card-footer{
  position: absolute;
    bottom: 0;
}
    .footer-more{
        border:0;
        color: #a6a6a6;
        font-size: 12px;
        // background: linear-gradient(180deg,#ffffff,#e0e0e0) !important;
    }
    .footer-more:hover{
      color: #1890ff;
    }
</style>
