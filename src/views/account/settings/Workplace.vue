<template>
  <a-list
    :grid="{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }"
    :dataSource="cardList"
  >
    <a-list-item slot="renderItem" slot-scope="item, index" :key="item.id">
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
          <!-- <a-icon @click="click($event, index), pushId(item.id)" type="plus" v-if="isPlus[index]" /> -->
          <a-tooltip placement="left" v-if="isPlus[index]" >
            <template slot="title">
              <span>添加卡片</span>
            </template>
            <a-icon @click="click($event, index), pushId(item.id)" type="plus"/>
          </a-tooltip>
          <a-icon type="ellipsis" v-if="isPlus[index]"/>
          <a-icon type="check" v-if="isDelete[index]"/>
          <a-tooltip placement="left" v-if="isDelete[index]" >
            <template slot="title">
              <span>删除卡片</span>
            </template>
            <a-icon @click="clickDelete($event, index), deleteId(item.id)" type="delete"/>
          </a-tooltip>
        </template>
        <a-card-meta
          :title="item.title"
          :description="item.detail">
        </a-card-meta>
      </a-card>
    </a-list-item>
    <div v-text="t" style="display:none"></div>

  </a-list>
</template>
<script>

export default {
  data () {
    return {
      cardList: [],
      cardIdList: [],
      isPlus: [],
      isDelete: [],
      t: ''
    }
  },
  created () {
    this.getAllCards()
  },
  methods: {
    click (event, index) {
      this.isPlus[index] = false
      this.isDelete[index] = true
      this.t = Math.random()
    },
    clickDelete (event, index) {
      this.isDelete[index] = false
      this.isPlus[index] = true
      this.t = Math.random()
    },
    getAllCards () {
      this.$http.get('/portal/userCard/cards')
        .then(res => {
          const datas = res.result.data
          datas.map(res => {
            this.cardList.push(res)
            this.isPlus.push(true)
            // this.isDelete.push(false)
            if (res.boolean === false) {
              this.isDelete.push(true)
            } else {
              this.isDelete.push(false)
            }
          })
        })
    },

    // 选择card
    pushId (cardId) {
      this.$http.post('/workplace/card', {
        params: {
          cardId: cardId,
          userId: this.$store.state.user.name
        }
      }).then(res => {
      })
    },
    // 删除cardId
    deleteId (cardId) {
      this.$http.get('/workplace/card', {
        params: {
          cardId: cardId,
          userId: this.$store.state.user.name
        }
      }).then(res => {

      })
    }
    // getCard () {
    //   this.$http.get('/workplace/card').then(res => {
    //     this.cardIdList = res.result.data
    //   })
    // },
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
