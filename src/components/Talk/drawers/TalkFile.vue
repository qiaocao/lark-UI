<template>
  <!--群文件的抽屉 -->
  <a-drawer
    title="文件"
    placement="right"
    :wrapStyle="{marginTop: '64px'}"
    :width="510"
    :closable="false"
    @close="onClose"
    :visible="activeOption=='talkFile'"
    :destroyOnClose="true"
  >
    <div>
      <div style="width: 100%">
        <a-input-search
          placeholder="输入要搜索内容"
          enterButton
          type="text"
          v-model="searchVal"
          style="margin-bottom: 20px; width: 49%"
        />
      <!-- <span style="width: 49%;margin-left:20px">
        <a-button class="button_ma" @click="fileAll">全部</a-button>
        <a-button class="button_ma" @click="finish">已上传</a-button>
        <a-button class="button_ma" @click="pending">待审核</a-button>
      </span> -->
      </div>
      <ul class="history_box">
        <li>
          <div class="nav_box">
            <ul style="display: flex ">
              <li class="flex" style="flex:1.2">文件名</li>
              <li class="flex">上传者</li>
              <li class="flex">上传时间</li>
              <li class="flex">密级</li>
              <li class="flex" style="flex:0.8">操作</li>
            </ul>
          </div>
          <p></p>
        </li>
        <li v-for="(newItem,index) in NewItems" class="history_cotent" :key="index" :value="newItem.value">
          <a-list-item-meta class="file_name">
            <a-tooltip slot="title" :title="newItem.fileName">
              <a class="file_a" message="sss">{{ newItem.fileName }}</a> <!-- 文件名 -->
            </a-tooltip> <!-- 文件图片 -->
            <a-avatar slot="avatar" :src="newItem.url" style="border-radius:0;  font-size: 25px;" > <a-icon type="file"></a-icon> </a-avatar>
          </a-list-item-meta>
          <a-tooltip :title="newItem.reviser">
            <span class="file_sp">{{ newItem.reviser }}</span><!-- 人名 -->
          </a-tooltip>
          <a-tooltip :title="newItem.time">
            <div class="file_time">{{ newItem.time }}</div> <!-- 上传时间 -->
          </a-tooltip>
          <a>
            <div class="secret secret1">
              <a-tag color="orange" v-if="newItem.levels === '40'">秘密</a-tag>
              <a-tag color="tomato" v-if="newItem.levels === '60'">机密</a-tag>
              <a-tag color v-if="newItem.levels === '30'">非密</a-tag>
            </div>
          </a>
          <a :href="genDownLoadPath(newItem.fileId)" class="down">下载</a>
        </li>
        <li>
          <div
            v-if="showLoadingMore"
            slot="loadMore"
            :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
          >
            <a-button @click="onLoadMore">加载更多文件</a-button>
          </div>
        </li>
        <li>
          <div v-if="loading" class="example">
            <a-spin />
          </div>
          <div v-if="noFile && !loading" class="no_file">
            没有更多文件...
          </div>
        </li>
      </ul>

    </div>

  </a-drawer>
</template>

<script>
import infiniteScroll from 'vue-scroll'
import { fileGrabble } from '@/api/talk.js'
import api from '@/api/talk'
export default {
  directives: { infiniteScroll },
  name: 'TalkFile',
  props: {
    /** 抽屉挂载的元素 */
    // mountEle: {
    //   type: String,
    //   // default: '.conv-box',
    //   required: false
    // },
    activeOption: {
      type: String,
      default: '',
      required: true
    },
    groupId: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      searchVal: '',
      datas: [],
      loading: false,
      showLoadingMore: false,
      noFile: false,
      item: [],
      pageNumber: 1,
      state: ''
    }
  },
  created () {
  },
  watch: {
    activeOption (newValue) {
      if (newValue === 'talkFile') {
        this.getData()
      }
    }
  },
  components: {
  },
  computed: {
    NewItems () {
      var _this = this
      var NewItems = []
      this.datas.map(function (item) {
        if (item.fileName.search(_this.searchVal) !== -1) {
          NewItems.push(item)
        }
      })
      return NewItems
    }
  },
  methods: {
    // 生成下载路径
    genDownLoadPath (fileId) {
      return api.fileDownload + '?fileId=' + fileId
    },
    // 提示
    openNotification () {
      this.$notification.warning({
        message: '无法获取文件，稍后再试',
        description: '',
        onClick: () => {
        }
      })
    },
    getData (callback) {
      this.loading = true
      this.showLoadingMore = false
      const options = {
        id: this.groupId,
        state: this.state,
        page: this.pageNumber,
        size: 5
      }
      fileGrabble(options).then(data => {
        this.loading = false
        this.showLoadingMore = true
        this.noFile = false
        if (data.result.data.length < 5) {
          this.showLoadingMore = false
          this.loading = false
          this.noFile = true
        }
        const datas = data.result.data
        datas.map(item => {
          this.datas.push(item)
        })
      }).catch(res => {
        this.openNotification()
        this.loading = false
        this.showLoadingMore = true
        this.noFile = false
      })
    },
    onLoadMore () {
      this.state = ''
      this.pageNumber++
      this.getData((res) => {
        this.datas = this.datas.concat(res.results)
        this.$nextTick(() => {
          window.dispatchEvent(new Event('resize'))
        })
      })
    },
    /** 抽屉关闭时触发closeDrawer事件 */
    onClose () {
      this.$emit('closeDrawer')
      this.datas = []
      this.pageNumber = 1
    },
    fileAll () {
      this.state = ''
      this.getData()
    },
    finish () {
      this.state = '1'
      this.getData()
    },
    pending () {
      this.state = '0'
      this.getData()
    }
  }
}
</script>

 <style lang="less" scoped>
    .ant-avatar-image{
      border-radius: 0
    }
    .history_box{
      margin-bottom: 100px;
      overflow: hidden;
      list-style: none;
      padding: 0;
      .history_cotent{
        height: 55px;
        margin-bottom: 5px;
      }
    }
    .ant-list-item-meta{
      float: left;
      width: 144px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      line-height: 55px;
      h4{
        line-height: 55px;
        width: 90px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

      }
    }
    .file_name{
      float: left;
      margin-right: 20px;
      line-height: 55px;
    }
    .file_sp{
      float: left;
      display: block;
      width: 70px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      box-sizing: border-box;
      margin-right: 30px;
      text-align: left;
      margin-top: 18px
    }

    .file_time{
      float: left;
      margin-right: 20px;
      width: 100px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-top: 18px
    }
    .secret1{
      float: left;
      margin-right: 12px;
      line-height: 55px
    }
    .down{
      float:right;
      line-height: 50px;
    }
    .nav_box {
      width: 100%;
      height: 20px;
      ul {
        width: 100%;
        li {
          list-style: none;
          text-align: right;
          &:nth-child(1) {
            text-align: left
          };
          &:nth-child(2) {
            text-align: left
          }
        }
      }
    }
    .no_file{
      text-align: center;
      color: #cccccc;
    }

    .example {
        text-align: center;
        border-radius: 4px;
        margin: 10px 0 20px 0;
      }
    .button_ma{
      flex: 1;
      margin: 0 10px 0 0;
      &:nth-child(3){
        margin: 0
      }

    }
    .flex{
      flex: 1
    }
</style>
