<template>
  <div style="margin-bottom: 64px">
    <div class="antd-pro-pages-dashboard-analysis-twoColLayout" :class="isDesktop() ? 'desktop' : ''">
      <grid-layout
        :layout.sync="layout"
        :col-num="2"
        :row-height="52"
        :max-rows="12"
        :is-draggable="true"
        :is-resizable="false"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
      >
        <grid-item
          v-for="grid in layout"
          dragAllowFrom=".ant-card-head"
          :minH="cardSize.minH"
          :maxH="cardSize.maxH"
          :minW="cardSize.minW"
          :key="grid.id"
          :x="grid.x"
          :y="grid.y"
          :w="grid.w"
          :h="grid.h"
          :i="grid.i">
          <a-card
            :headStyle="headStyle"
            :bodyStyle="bodyStyle"
            :loading="loading"
            :bordered="true"
            :title="grid.title"
            :style="{ minHeight: '300px', borderRadius: '4px' }">
            <a-popover
              placement="left"
              slot="extra"
              trigger="click">
              <template slot="content">
                <a slot="content">移除卡片</a>
              </template>
              <a href="#"><a-icon type="ellipsis" /></a>
            </a-popover>

            <div v-if="talkData.length!=0" class="card-content">
              <a-list
                :bordered="bordered"
                :dataSource="talkData"
                class="card-list"
              >
                <a-list-item style="padding: 12px 21px 12px 21px" slot="renderItem" slot-scope="item">{{ item }}</a-list-item>
              </a-list>
            </div>
            <div v-else style="margin: 40px auto 0 auto;text-align: center;" class="card-content">
              <a-icon type="file-exclamation" theme="twoTone" :style="fontSize" />
              <p class="description">卡片暂无内容</p>
            </div>
          </a-card>
        </grid-item>
      </grid-layout>
    </div>
    <!--这个地方放置最近访问-->

    <footer-tool-bar :style="{height:'64px', width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}">

    </footer-tool-bar>
  </div>
</template>

<script>
import { mixin, mixinDevice } from '@/utils/mixin'
import FooterToolBar from '@/components/FooterToolbar'
import getWorkplace from '@/api/workplace'
import VueGridLayout from 'vue-grid-layout'
const talkData = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.'
]

export default {
  name: 'Monitor',
  mixins: [mixin, mixinDevice],
  data () {
    return {
      bordered: false,
      loading: true,
      headStyle: { height: '52px', 'border-top': '4px solid #1890ff', 'border-bottom': 'none' },
      bodyStyle: { padding: '0' },
      fontSize: { fontSize: '52px' },
      talkData: talkData,
      visible: false,
      layout: [],
      cardSize: { maxH: 5, minH: 5, maxW: 1, minW: 1 }
      // items: generateItems(50, i => ({ id: i, data: 'Draggable' + i }))
    }
  },
  components: {
    FooterToolBar,
    // Container,
    // Draggable,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  created () {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
    this.getSelfWorkplace()
  },
  methods: {
    getSelfWorkplace () {
      const self = this
      getWorkplace(self.$store.state.user.info.id).then(res => {
        this.layout = res.result.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .antd-pro-pages-dashboard-analysis-twoColLayout {
    position: relative;
    display: flex;
    display: block;
    flex-flow: row wrap;
    &.desktop div[class^=ant-col]:last-child {
      position: absolute;
      right: 0;
      height: 100%;
    }
  }
    .card-list{
      .ant-list-item{
        cursor: pointer;
        transition: background-color 218ms;
        border-bottom: 0px solid #e8e8e8;
      }
      .ant-list-item:hover{
        background-color: #f5f5f5;
      }
    }

  .description{
    margin-top: 24px;
    color: gray;
    font-size: 14px;
    line-height: 22px;
    text-align: center;
  }
  .dropdown-container{
    position: relative;
    background: #fff;
    border: 0 solid transparent;
    border-radius: 4px;
    box-shadow: 0 2px 20px rgba(0,0,0,.1);
    .menu {
        border-radius: 4px;
        background: #fff;
        list-style: none;
        overflow: auto;
        margin: 0;
        padding: 4px 0;
        max-height: 400px;
        min-width: 200px;
        .menu-item {
            min-height: 36px;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            font-size: 14px;
            color: #383838;
            box-sizing: border-box;
            padding: 8px 16px;
            word-break: break-all;
        }
    }
  }

</style>
