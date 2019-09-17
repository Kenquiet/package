<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: "scroll",
    props: {
      probeType: { //滚动时响应的速度值 1
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: null
      },
      data: {
        type: Array,
        default: null
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      },20)
    },
    methods: {
      _initScroll() {
        // 如果里面没有值我们什么都不做
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper)
      },
      // 代理一些方法
      enable() {
        this.scroll && this.scroll.enable()
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      }
    },
    watch: {
      //当数据变化时，对页面进行刷新
      data() {
        setTimeout(()=> {
          this.refresh()
        },20)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
