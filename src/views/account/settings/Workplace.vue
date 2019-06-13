<template>
  <a-list
    :grid="{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }"
    :dataSource="cardList"
  >
    <a-list-item slot="renderItem" slot-scope="item, index">
      {{ item.id }}
      <a-card
        hoverable
        style="width: 240px"
      >
        <img
          alt="example"
          :src="item.icon"
          slot="cover"
        />
        <template class="ant-card-actions" slot="actions">
          <a-icon @click="click($event)" type="plus" v-if="isPlus" />
          <a-icon type="ellipsis" v-if="isPlus"/>
          <a-icon type="check" v-if="isDelete"/>
          <a-tooltip placement="left" v-if="isDelete" >
            <template slot="title">
              <span>删除卡片</span>
            </template>
            <a-icon @click="clickD()" type="delete"/>
          </a-tooltip>
        </template>
        <a-card-meta
          :title="item.title"
          :description="item.detail">
        </a-card-meta>
      </a-card>
    </a-list-item>
  </a-list>
</template>
<script>

export default {
  data () {
    return {
      cardList: [],
      cardIdList: [],
      isPlus: true,
      isDelete: false
    }
  },
  created () {
    this.getAllCards()
  },
  methods: {
    getAllCards () {
      this.$http.get('/workplace/all')
        .then(res => {
          const datas = res.result.data
          datas.map(res => {
            this.cardList.push(res)
          })
        })
    },
    getCard () {
      this.$http.get('/workplace/card').then(res => {
        this.cardIdList = res.result.data
      })
    },
    click (event) {
      var target = event.target || window.event.srcElement
      // 获取对应元素的id值
      const idd = target.getAttribute('data-id')
      for (let i = 0; i < this.cardList.length; i++) {
        console.log('111', this.cardList[i].id)
        const id = this.cardList[i]
        if (this.isPlus === true && id === idd) {
          this.isPlus = false
          this.isDelete = true
        }
      }

      this.getCard()
    },
    clickD () {
      if (this.isDelete === true) {
        this.isDelete = false
        this.isPlus = true
      }
    }
  }
}
</script>
<style>
  #components-a-tooltip-demo-placement .ant-btn {
  width: 70px;
  text-align: center;
  padding: 0;
  margin-right: 8px;
  margin-bottom: 8px
  }
</style>
