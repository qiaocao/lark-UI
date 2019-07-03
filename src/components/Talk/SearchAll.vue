<template>
  <div class="search-all">
    <div class="input-mask" v-show="showInputMask"></div>
    <a-input placeholder="联系人/群组" v-model="searchText" @focus="showDrawer" :style="inputStyle" size="small">
      <a-icon slot="prefix" type="search" />
      <a-icon v-if="searchText" slot="suffix" type="close-circle" @click="exitSearch" />
    </a-input>
    <!-- 搜索结果展示 -->
    <a-drawer
      title="Basic Drawer"
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
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-drawer>
  </div>
</template>

<script>
export default {
  name: 'SearchAll',
  props: {
    inputStyle: {
      type: Object,
      default: () => ({}),
      required: false
    }
  },
  data () {
    return {
      visible: false,
      showInputMask: true,
      searchText: ''
    }
  },
  methods: {
    exitSearch () {
      this.visible = false
      this.searchText = ''
      this.showInputMask = true
    },
    showDrawer () {
      this.visible = true
      this.showInputMask = false
    }
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
  }
</style>
