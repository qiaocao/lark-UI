<template>
  <!-- 标记信息的抽屉 -->
  <a-drawer
    title="标记信息"
    placement="right"
    :getContainer="mountEle"
    :wrapStyle="{marginTop: '64px'}"
    :width="448"
    :closable="false"
    @close="onClose"
    :visible="activeOption=='markMessage'">
    <a-input-search
      class="a-input"
      placeholder="input search text"
      @search="onSearch"
      enterButton
    />

    <div class="history_cotent" v-for="item in items" :key="item.id">
      <img :src="item.avatar" class="content_l" alt="">
      <div class="content_r">
        <h3>{{ item.name }}</h3>
        <p @click="isCurrent()" :class="{'current':flag}">{{ item.lastMessage }}</p>
      </div>
      <div class="history_right">
        <span>2013-2-2 22:22</span>
        <div class="secret">
          <a-tag color="orange" v-if="item.Concentrated === 'secret'">保密</a-tag>
          <a-tag color="red" v-if="item.Concentrated === 'top-secret'">绝密</a-tag>
          <a-tag color="" v-if="item.Concentrated === 'no-secret'">无秘</a-tag>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script>
export default {
  name: 'MarkMessage',
  props: {
    /** 抽屉挂载的元素 */
    mountEle: {
      type: String,
      default: '.conv-box',
      required: false
    },
    activeOption: {
      type: String,
      default: '',
      required: true
    }
  },
  data () {
    return {
      flag: true,
      items: [],
      color: ''
    }
  },
  watch: {
    activeOption (newValue) {
      if (newValue === 'markMessage') {
        console.log('在这里加载数据')
      }
    }
  },
  computed: {
  },
  created () {
    this.getHistory()
  },
  mounted () {
    // this.whatColor()
    window.addEventListener('scroll', this.lazyLoading)
  },
  methods: {
    /** 抽屉关闭时触发closeDrawer事件 */
    onClose () {
      this.$emit('closeDrawer')
    },
    isCurrent () {
      this.flag = !this.flag
    },
    getHistory () {
      this.$http.get('https://www.easy-mock.com/mock/5cef9a806bbb7d72047ec887/drawer/notice/drawer/history').then((data) => {
        console.log('1221212', data.result.pageNo)
        const datas = data.result.data
        this.page = data.result.pageNo
        const dataa = datas.map((item, index, array) => {
          return item
        })
        // debugger
        this.items.push(...dataa)
      })
    },
    onSearch (value) {
      console.log(value)
    },
    // 滚动获取数据
    lazyLoading () {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const clientHeight = document.documentElement.clientHeight
      const scrollHeight = document.documentElement.scrollHeight
      if (scrollTop + clientHeight >= scrollHeight) {
        // console.log('0000', "000")
        console.log('000', scrollHeight)
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.getHistory()
        }, 200)
      } else {
      }
    }

  }
}
</script>

<style lang='less' scope>
  .current{
    display: -webkit-box;
    word-break: break-all;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    user-select:none;
  }
  .a-input{
    margin-bottom: 20px;
  }
  .history_cotent{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    border-bottom: 1px solid #cccccc;
    .content_l{
      width: 30px;
      height: 30px;
      // background-image: url("./file.jpg");
      background-size: 30px 30px;
      position: absolute;
      top:10px;
      left: 0;
    }
    .content_r{
      display: inline-block;
      margin-left: 40px;
      h3{
        margin-bottom: 0;
      }
       p{
          width: 250px;
          border-radius: 5px;
        }
    }
    .history_right{
        float: right;

      span{
        display: block
      }
      .secret{
        margin-top: 20px;
        float: right;

      }
    }
  }
</style>
