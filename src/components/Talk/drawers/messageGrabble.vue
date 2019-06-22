<template>
  <div>
    <!-- <input type="text" class="seek_inp" placeholder="输入要搜索内容" v-model="searchVal" >
    <a-button type="primary" icon="search" style="border-radius:0"></a-button> -->
    <a-input-search
      placeholder="输入要搜索内容"
      @search="onSearch"
      enterButton
      type="text"
      v-model="searchVal"
      style="margin-bottom: 20px"
    />
    <ul class="history_box">
      <li v-for="(item,index) in NewItems" class="history_cotent" :key="index" :value="item.value">
        <img :src="item.avatar" class="content_l" alt>
        <div class="content_r">
          <h3>{{ item.username }}</h3>
          <p @click="isCurrent(item.content.title)" :class="{'current':flag}">{{ item.content.title }}</p>
        </div>
        <div class="history_right">
          <span>{{ item.time }}</span>
          <div class="secret" style="margin: 6px 0 0 20px">
            <a-tag color="orange" v-if="item.content.secretLevel == '70'">秘密</a-tag>
            <a-tag color="tomato" v-if="item.content.secretLevel == '80'">机密</a-tag>
            <a-tag color="" v-if="item.content.secretLevel == '60'">非密</a-tag>
          </div>
        </div>
      </li>
    </ul>
  </div>

</template>
<script>
import vScroll from 'vue-scroll'
export default {
  name: 'Rabble',
  directives: { scroll },

  data () {
    return {
      searchVal: '',
      items: [],
      flag: true,
      activeOption: ''

    }
  },
  created () {
    this.activeOption = 'talkHistory'
    this.getHistory()
  },
  mounted () {
    window.addEventListener('scroll', (this.lazyLoading), true)
  },
  beforeDestroy () {
    this.activeOption = ''
  },
  updated () {
    // this.lazyLoading()
  },
  components: {
    vScroll
  },
  methods: {
    onSearch (value) {
      console.log(value)
    },
    isCurrent (str) {
      if (str.length > 100) {
        this.flag = !this.flag
      }
    },
    getHistory () {
      this.$http
        .get('chat/getHiMsg')
        .then(data => {
          const datas = data.result.data[0][1]
          const dataa = datas.map((item, index, array) => {
            return item
          })
          this.items.push(...dataa)
        })
    },

    // 滚动获取数据
    lazyLoading () {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const clientHeight = document.documentElement.clientHeight
      const scrollHeight = document.documentElement.scrollHeight
      if (scrollTop + clientHeight === scrollHeight) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          if (this.activeOption === 'talkHistory') {
            this.getHistory()
            // if (clientHeight > scrollHeight) {
            //   // return false
            //   console.log('00', '00')
            // }
          }
        }, 1000)
      } else {
      }
    }
  },
  computed: {
    NewItems () {
      var _this = this
      var NewItems = []
      this.items.map(function (item) {
        if (item.username.search(_this.searchVal) !== -1 || item.content.title.search(_this.searchVal) !== -1 || item.time.search(_this.searchVal) !== -1) {
          NewItems.push(item)
        }
      })
      return NewItems
    }
  }
}
</script>
<style lang="less" scoped>
.current {
  display: -webkit-box;
  word-break: break-all;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  user-select: none;
}
.a-input {
  margin-bottom: 20px;
}
.history_cotent {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  border-bottom: 1px solid #cccccc;
  .content_l {
    width: 40px;
    height: 40px;
    background-size: 30px 30px;
    position: absolute;
    top: 10px;
    left: 0;
  }
  .content_r {
    display: inline-block;
    margin-left: 50px;
    box-sizing: border-box;
    h3 {
      margin-bottom: 0;
      padding-top: 6px;
      width: 150px;
    }
    p {
      // width: 250px;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  .history_right {
    float: right;
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;
    span {
      display: block;
      padding-top: 6px;
      float: left;
    }
    .secret {
      float: right;
    }
  }
}
.seek_inp{
  width: 90%;
  height: 30px;
  outline: none;
  border: 1px solid #cccccc;
  // border-radius: 5px;
  margin-bottom: 20px;
}
.history_box{
  padding:0;
  margin-bottom: 50px
}
</style>
