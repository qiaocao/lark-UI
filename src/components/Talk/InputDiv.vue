<template>
  <div
    class="textarea-input"
    contenteditable="true"
    @input="changeText"
    @keydown.enter.stop.prevent
  >
    <img id="img_face" :escape="false" v-for="(item, index) in faceMessage" :key="index" :src="item">
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
      required: true
    },
    faceMessage: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      innerText: this.value
      // imgFaceS: []
    }
  },
  created () {
  },
  methods: {
    changeText () {
      this.innerText = this.$el.innerHTML
      this.$emit('input', this.innerText)
      // let imgFace = document.getElementById('img_face')
      // this.imgFaceS.push(imgFace)
      console.log('input', document.getElementById('input_div').innerText)
    }
  }
}
</script>
<style>
#img_face{
  width: 2rem;
  height: 2rem;
}
  .textarea-input {
    height: 100px;
    width: 100%;
    line-height: 20px;
    color: black;
    resize: none;
    outline: none;
    border: none;
  }
</style>
