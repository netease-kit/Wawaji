<template>
  <div class="mask" @click = "hide" v-show="show">
    <img v-if="status==='success'" src="../../assets/scccess.png">
    <img v-else-if="status==='failed'" src="../../assets/fail.png">
  </div>
</template>
<script>
export default {
  data () {
    return {
      status: null,
      show: false
    }
  },
  methods: {
    showSuccess () {
      this.status = 'success'
      this.show = true
    },
    showFail () {
      this.status = 'failed'
      this.show = true
    },
    hide () {
      this.show = false
      this.status = null
    }
  }
}
</script>
<style lang="postcss" scoped>
  .mask {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.70);
    top: 0;
    left: 0;
    z-index: 10;
    img {
      position: absolute;
      top: 10rem;
      left: 50%;
      width: 96%;
      margin-left: -48%;
    }
  }
</style>


