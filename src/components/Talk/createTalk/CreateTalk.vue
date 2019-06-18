<template>
  <a-card :bordered="false">
    <a-steps class="steps" :current="currentTab">
      <a-step title="填写基本信息" />
      <a-step title="选择群组成员" />
      <a-step title="完成" />
    </a-steps>
    <div class="content">
      <BaseInfo v-if="currentTab === 0" @nextStep="nextStep"/>
      <UserSelect v-if="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep"/>
      <ResultPage v-if="currentTab === 2" @prevStep="prevStep" @finish="finish"/>
    </div>
  </a-card>
</template>

<script>
import BaseInfo from './BaseInfo'
import UserSelect from './UserSelect'
import ResultPage from './ResultPage'

export default {
  name: 'StepForm',
  components: {
    BaseInfo,
    UserSelect,
    ResultPage
  },
  data () {
    return {
      currentTab: 0,

      // form
      form: null
    }
  },
  methods: {

    // handler
    nextStep () {
      if (this.currentTab < 2) {
        this.currentTab += 1
      }
    },
    prevStep () {
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
    },
    finish () {
      this.currentTab = 0
    }
  }
}
</script>

<style lang="less" scoped>
  .steps {
    max-width: 750px;
    margin: 16px auto;
  }
</style>
