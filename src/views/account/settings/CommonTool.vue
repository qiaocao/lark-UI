<template>
  <div>
    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="工具列表">

      <div slot="extra">
        <a-radio-group>
          <a-radio-button>全部</a-radio-button>
          <a-radio-button>已选</a-radio-button>
          <a-radio-button>未选</a-radio-button>
        </a-radio-group>
        <a-input-search style="margin-left: 16px; width: 272px;" />
      </div>

      <a-list size="large" :pagination="{showSizeChanger: true, showQuickJumper: true, pageSize: 5, total: 50}">
        <a-list-item :key="index" v-for="(item, index) in data">
          <a-list-item-meta :description="item.description">
            <a-avatar slot="avatar" size="large" shape="square" :src="item.avatar"/>
            <a slot="title">{{ item.title }}</a>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="addId(item.id), isShow($event, index)" v-if="flag[index]">加入常用</a>
            <a v-if="flags[index]">已添加</a>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <span>所属部门</span>
              <p>{{ item.owner }}</p>
            </div>
            <div class="list-content-item">
              <span>更新时间</span>
              <p>{{ item.startAt }}</p>
            </div>
            <div class="list-content-item">
              <span>使用量</span>
              <p>{{ item.downloadNum }}</p>
            </div>
            <div class="list-content-item">
              <a-rate :defaultValue="item.star" disabled />
            </div>
          </div>
        </a-list-item>
      </a-list>
      <div v-text="t" style="display:none"></div>
      <!--  style="display:none " -->
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'StandardList',
  components: {
  },
  data () {
    return {
      flags: [],
      flag: [],
      data: [],
      t: ''
    }
  },
  created () {
    this.getData()
  },
  methods: {
    addId (id) {
      this.$http.get('/workplace/card', {
        params: {
          id: id,
          userId: this.$store.state.user.name
        }
      }).then(res => {
      })
    },
    isShow ($event, index) {
      // console.log('index', this.flag)
      this.t = Math.random()
      this.flag[index] = false
      console.log('show', this.flag[index], index)

      this.flags[index] = true
    },
    getData () {
      this.$http.get('/setting/commontool').then(res => {
        const datas = res.result.data
        datas.map(res => {
          this.data.push(res)
          this.flags.push(false)
          this.flag.push(true)
          // console.log('data', this.data)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .ant-avatar-lg {
        width: 48px;
        height: 48px;
        line-height: 48px;
    }

    .list-content-item {
        color: rgba(0, 0, 0, .45);
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
        margin-left: 40px;
        span {
            line-height: 20px;
        }
        p {
            margin-top: 4px;
            margin-bottom: 0;
            line-height: 22px;
        }
    }
</style>
