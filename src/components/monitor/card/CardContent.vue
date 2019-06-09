<template>
  <div>
    <div v-if="listData.length!=0" class="card-content">
      <a-list
        :bordered="bordered"
        :dataSource="listData"
        class="card-list"
      >
        <a-list-item style="padding: 12px 21px 12px 21px" slot="renderItem" slot-scope="item">{{ item }}</a-list-item>
      </a-list>
    </div>
    <div v-else style="margin: 40px auto 0 auto;text-align: center;" class="card-content">
      <a-icon type="file-exclamation" theme="twoTone" :style="fontSize" />
      <p class="description">卡片暂无内容</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CardContent',
  data () {
    return {
      bordered: false,
      fontSize: { fontSize: '52px' },
      list: []
    }
  },
  props: {
    listData: {
      type: Array,
      required: true
    }
  },
  mounted () {
    console.log('this.listData')
    console.log(this.listData)
  }
}
</script>
<style lang="less" scoped>
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
</style>
