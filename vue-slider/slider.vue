<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots" >
      <span class="dot" v-for="(item,index) in dots" :key="index"
            :class="{active:currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import { addClass } from './dom'
  export default {
    name: "slider",
    data () {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      loop:{ // 是否轮播
        type: Boolean,
        default: true
      },
      autoPlay: { //是否自动轮播
        type: Boolean,
        default: true
      },
      interval: { // 自动轮播时间间隔
        type: Number,
        default: 4000
      }
    },
    mounted() {
      //这里延时为什么是20，因为手机浏览器刷新的时间为17ms，所以20算是够了
      setTimeout(() => {
        this._setSliderWidth();
        this._initDots();
        this._initSlider();
        if (this.autoPlay) {
          this._play();
        }
      },20);

      // 当浏览器窗口发生变化时我们要重新计算 sliderWidth
      window.addEventListener('resize',() => {
        if (!this.slider || !this.slider.enabled){
          return
        }

        clearTimeout(this.resizeTimer)
        this.resizeTimer = setTimeout(() => {
          if (this.slider.isInTransition) {
            this._onScrollEnd()
          } else {
            if (this.autoPlay) {
              this._play()
            }
          }
          this.refresh()
        }, 60)
      })

    },
    methods: {
      refresh () {
        if (this.slider) {
          this._setSliderWidth(true);
          //this.slider.refresh() // 这个方法也是bs常用的一个接口，用来刷新slider
          this.slider.refresh()
        }
      },
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children;

        let width = 0;
        let sliderWidth = this.$refs.slider.clientWidth;
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i];
          addClass(child,'slider-item')

          child.style.width = sliderWidth + 'px';
          width += sliderWidth
        }

        // 这个是因为需要无缝轮播所以多加两个图片的宽度
        if (this.loop && !isResize) {
          width += 2 * sliderWidth;
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider,{
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          }
        });
        // 当我们初始化 bs 时，bs 会派发一个事件
        this.slider.on('scrollEnd',this._onScrollEnd)

        this.slider.on('touchend', () => {
          if (this.autoPlay) {
            this._play()
          }
        });

        this.slider.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
        })
      },
      _onScrollEnd(){
          //这个方法是 bs 给的方法就是为了获取到当前滚动到的页面
          let pageIndex = this.slider.getCurrentPage().pageX;
          this.currentPageIndex = pageIndex
          if (this.autoPlay) {
            this._play()
          }
      },
      _play() {
        clearTimeout(this.timer);
        this.timer = setTimeout(()=> {
          // 这个 next() 也是 bs 提供的
          this.slider.next()
        },this.interval)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
.slider
  min-height: 1px
  .slider-group
    position: relative
    overflow: hidden
    white-space: nowrap
    .slider-item
      float: left
      box-sizing: border-box
      overflow: hidden
      text-align: center
      a
        display: block
        width: 100%
        overflow: hidden
        text-decoration: none
      img
        display: block
        width: 100%
  .dots
    position: absolute
    right: 0
    left: 0
    bottom: 12px
    transform: translateZ(1px)
    text-align: center
    font-size: 0
    .dot
      display: inline-block
      margin: 0 4px
      width: 8px
      height: 8px
      border-radius: 50%
      background: $color-text-l
      &.active
        width: 20px
        border-radius: 5px
        background: $color-text-ll
</style>
