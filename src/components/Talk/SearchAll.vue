<template>
  <div class="search-all">
    <div class="input-mask" v-show="showInputMask"></div>
    <a-input
      placeholder="联系人/群组"
      v-model="searchText"
      @focus="showDrawer"
      @blur="exitSearch"
      :style="inputStyle"
      size="small"
    >
      <a-icon slot="prefix" type="search" />
      <a-icon v-if="searchText" slot="suffix" type="close-circle" @click="exitSearch" />
    </a-input>
    <!-- 搜索结果展示 -->
    <a-drawer
      placement="left"
      getContainer=".talk-layout-sider"
      :wrapStyle="{marginTop: '119px'}"
      :maskStyle="{background: 'transparent'}"
      :width="280"
      :closable="false"
      :destroyOnClose="true"
      @close="exitSearch"
      :visible="visible"
      :zIndex="10"
    >
      <div style="height: 100vh; backgroundColor: #e6e8eb; margin: -24px">
        <div v-if="resultList.length">
          <GroupItem
            v-for="(item, index) in resultList"
            :groupInfo="item"
            :key="index"
            @click="toTalk(item)"
          />
        </div>
        <div v-else class="no-result-tip">
          <p>无匹配结果</p>
        </div>

      </div>
    </a-drawer>
  </div>
</template>

<script>
import { GroupItem } from '@/components/Talk'
import { mapGetters } from 'vuex'
import { getGroupInfo, getContactsInfo } from '@/api/talk'

export default {
  name: 'SearchAll',
  props: {
    inputStyle: {
      type: Object,
      default: () => ({}),
      required: false
    }
  },
  components: { GroupItem },
  data () {
    return {
      visible: false,
      searchText: '',
      resultList: []
    }
  },
  computed: {
    ...mapGetters(['groupList', 'contactsTree']),
    showInputMask () {
      return !this.visible
    }
  },
  watch: {
    searchText (newValue) {
      if (newValue) {
        this.inputFilter(newValue)
      }
    }
  },
  methods: {
    exitSearch () {
      this.visible = false
      this.searchText = ''
      this.resultList = []
    },
    showDrawer () {
      this.visible = true
      this.setDrawerStyle()
    },
    /** 设置抽屉样式 */
    setDrawerStyle () {
      this.$nextTick(() => {
        const drawerContainer = document.getElementsByClassName('ant-drawer-content-wrapper')
        for (let i = 0; i < drawerContainer.length; i++) {
          const item = drawerContainer[i]
          if (item.clientWidth === 280) {
            item.style.boxShadow = 'none'
          }
        }
      })
    },
    /**
     * 对输入的信息进行过滤，筛选出相关信息
     */
    inputFilter (newValue) {
      console.log(newValue)
      this.groupFilter()
      this.contactsFilter()
    },
    /** 筛选群组列表 */
    groupFilter () {
      console.log('123')
      console.log(this.groupList)
    },
    /** 筛选联系人树 */
    contactsFilter () {
      console.log('123')
      console.log(this.contactsTree)
    },
    /** 跳转到研讨界面 */
    toTalk () {}
  }
}
</script>

<style lang="less" scoped>
  .search-all {
    .input-mask {
      position: fixed;
      width: 200px;
      height: 31px;
      border-radius: 4px;
      z-index: 10;
      background-color: #a7a8ac;
      opacity: 0.5;
      pointer-events: none;
      border: 1px solid #d1d2d4;
    }

    .no-result-tip {
      margin: 24px auto;
    }
  }
</style>
