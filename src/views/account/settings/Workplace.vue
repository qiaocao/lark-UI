<template>
  <a-list
    :grid="{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }"
    :dataSource="data"
  >
    <a-list-item slot="renderItem" slot-scope="item">
      <a-card
        hoverable
        style="width: 240px"
      >
        <img
          alt="example"
          src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          slot="cover"
        />
        <template class="ant-card-actions" slot="actions">
          <a-icon type="plus" />
          <a-icon type="ellipsis" />
        </template>
        <a-card-meta
          :title="item.title"
          :description="item.description">
        </a-card-meta>
      </a-card>
    </a-list-item>
  </a-list>
</template>
<script>
const data = [
  {
    title: '消息通知',
    description: '展示最近收到的消息通知列表'
  },
  {
    title: '待办事项',
    description: '展示最近需要办理的事项列表'
  },
  {
    title: '我的收藏',
    description: '展示最近收藏的内容列表'
  },
  {
    title: '工作热图',
    description: '展示最近工作的活跃程度'
  }
]
export default {
  data () {
    return {
      data
    }
  }
}
</script>
<style>

</style>
