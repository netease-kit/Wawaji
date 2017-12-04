<template>
  <div class="mask" @click = "hide" v-show="show">
    <img v-if="success" src="../../assets/scccess.png">
    <img v-else src="../../assets/fail.png">
  </div>
</template>
<script>
export default {
  data () {
    return {
      success: true,
      show: false
    }
  },
  methods: {
    showSuccess () {
      this.success = true
      this.show = true
    },
    showFail () {
      this.success = false
      this.show = true
    },
    hide () {
      this.show = false
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
      top: 50%;
      left: 50%;
      margin-left: -345px;
      margin-top: -215px;
    }
  }
</style>


