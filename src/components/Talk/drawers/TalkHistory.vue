<template>
  <!-- 聊天记录的抽屉 -->
  <a-drawer
    id="ss"
    title="聊天记录"
    placement="right"
    :getContainer="mountEle"
    :wrapStyle="{marginTop: '64px'}"
    :width="448"
    :closable="false"
    @close="onClose"
    :visible="activeOption=='talkHistory'"
    ref="ss"
    v-if="hackReset"
    destroyOnClose
  >

    <sou></sou>
    <div class="login_img">
      <a-spin/>
    </div>
  </a-drawer>
</template>

<script>
import sou from './sou.vue'
export default {
  name: 'TalkHistory',
  props: {
    /** 抽屉挂载的元素 */
    mountEle: {
      type: String,
      default: '.conv-box',
      required: false
    },
    activeOption: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      aa: '1',
      flag: true,
      items: [],
      color: '',
      timer: null,
      // changeTimer: null,
      valData: '',
      hackReset: true,
      visible: false,
      searchVal: ''
    }
  },
  components: {
    sou
  },
  watch: {
    activeOption (newValue) {
      if (newValue === 'talkHistory') {
        console.log('在这里加载数据')
        // this.getHistory()
      }
    }
  },
  computed: {
    NewItems () {
      var _this = this
      var NewItems = []
      this.items.map(function (item) {
        if (item.name.search(_this.valData) !== -1) {
          NewItems.push(item)
        }
      })
      return NewItems
    }
  },
  created () {
  },
  mounted () {
    window.addEventListener('scroll', (this.lazyLoading), true)
  },
  methods: {
    /** 抽屉关闭时触发closeDrawer事件 */
    onClose () {
      this.visible = false
      this.$emit('closeDrawer')
    },
    // isCurrent () {
    //   this.flag = !this.flag
    // },
    // getHistory () {
    //   this.$http
    //     .get('https://www.easy-mock.com/mock/5cef9a806bbb7d72047ec887/drawer/notice/drawer/history')
    //     .then(data => {
    //       const datas = data.result.data
    //       const dataa = datas.map((item, index, array) => {
    //         return item
    //       })
    //       this.items.push(...dataa)
    //     })
    // },
    onSearch (value) {
      console.log(value)
    }

  }
}
</script>

<style lang="less" scope>
// .current {
//   display: -webkit-box;
//   word-break: break-all;
//   -webkit-line-clamp: 2;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
//   user-select: none;
// }
// .a-input {
//   margin-bottom: 20px;
// }
// .history_cotent {
//   width: 100%;
//   height: 100%;
//   overflow: hidden;
//   position: relative;
//   border-bottom: 1px solid #cccccc;
//   .content_l {
//     width: 40px;
//     height: 40px;
//     background-size: 30px 30px;
//     position: absolute;
//     top: 10px;
//     left: 0;
//   }
//   .content_r {
//     display: inline-block;
//     margin-left: 50px;
//     box-sizing: border-box;
//     h3 {
//       margin-bottom: 0;
//       padding-top: 6px;
//       width: 150px;
//     }
//     p {
//       // width: 250px;
//       border-radius: 5px;
//       cursor: pointer;
//     }
//   }
//   .history_right {
//     float: right;
//     overflow: hidden;
//     position: absolute;
//     top: 0;
//     right: 0;
//     span {
//       display: block;
//       padding-top: 6px;
//       float: left;
//     }
//     .secret {
//       float: right;
//     }
//   }
// }
</style>
