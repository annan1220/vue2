<template>
  <div>
    <div class="shopCart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">¥{{totalPrice}}</div>
          <div class="desc">另需配送费¥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right">
          <div class="pay" :class="payClass">
            {{totalDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="(ball,index) in balls" :key="index">
          <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div class="shopList" v-show="mark">
          <div class="list-header">
            <span class="shop">购物车</span>
            <span class="clear" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="list-content">
            <ul>
              <li v-for="(food,index) in selectFoods" :key="index" class="list">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>¥{{food.price*food.count}}</span>
                </div>
                <div class="cart-wrapper">
                  <cartControl :food="food"></cartControl>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" @click="toggleList" v-show="mark"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import cartControl from '../cartcontrol/cartcontrol';
  import BScroll from 'better-scroll';

  export default {
    props: {
      deliveryPrice: {
        type: Number
      },
      minPrice: {
        type: Number
      },
      selectFoods: {
        type: Array
      }
    },
    components: {
      cartControl
    },
    data () {
      return {
        balls: [{show: false}, {show: false}, {show: false}, {show: false}, {show: false}],
        dropBalls: [],
        mark: false
      };
    },
    computed: {
      totalPrice () {
        let total = 0;
        this.selectFoods.forEach((foods) => {
          total += foods.price * foods.count;
        });
        return total;
      },
      totalCount () {
        let count = 0;
        this.selectFoods.forEach((foods) => {
          count += foods.count;
        });
        return count;
      },
      totalDesc () {
        if (this.totalPrice === 0) {
          return `¥${this.minPrice}起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差${diff}元起送`;
        } else {
          return `去结算`;
        }
      },
      payClass () {
        if (this.totalPrice < this.minPrice) {
          return `not-enough`;
        } else {
          return `enough`;
        }
      }
    },
    watch: {
      mark: function () {
        if (!this.totalCount) {
          this.mark = false;
          return false;
        }
        let show = this.mark;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs['list-content'], {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
    },

    created () {
      // 获取按钮组件的点击的元素，用在drop方法里 派送事件
      this.$root.$on('cart.add', this.drop);
    },
    methods: {
      drop (el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.els = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      beforeDrop (els) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.els.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            els.style.display = '';
            els.style.webkitTransform = `translate3d(0,${y}px,0)`;
            els.style.transform = `translate3d(0,${y}px,0)`;
            let inner = els.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.Transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      dropping (el) {
        /* eslint-disable no-unused-vars */
        // 触发重绘
        let re = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.Transform = 'translate3d(0,0,0)';
        });
      },
      afterDrop (el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      toggleList () {
        if (!this.totalCount) {
          return;
        }
        this.mark = !this.mark;
      },
      empty () {
        this.selectFoods.forEach((food) => {
          food.count = 0;
          this.mark = false;
        });
      }
    }
  }
  ;
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  .shopCart
    position: fixed
    width: 100%
    height: 48px
    left: 0
    bottom: 0
    z-index 50
    .content
      display flex
      background #141d27
      font-size 0
      color rgba(255, 255, 255, 0.4)
      .content-left
        flex 1
        .logo-wrapper
          display inline-block
          vertical-align top
          position: relative
          top: -10px
          margin 0 12px
          padding 6px
          width: 56px
          height: 56px
          box-sizing border-box
          border-radius 50%
          background #141d27
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #fff
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4)
            background rgb(240, 20, 20)
          .logo
            width: 100%
            height: 100%
            text-align center
            border-radius 50%
            background #2b343c
            &.highlight
              background rgb(0, 160, 220)
            .icon-shopping_cart
              font-size 24px
              line-height 44px
              color #80858a
              &.highlight
                color #fff
        .price
          vertical-align top
          display inline-block
          margin-top 12px
          line-height 24px
          box-sizing border-box
          padding-right 12px
          border-right 1px solid rgba(255, 255, 255, 0.1)
          font-size 12px
          font-weight 700
          &.highlight
            color #fff
        .desc
          vertical-align top
          display inline-block
          line-height 24px
          margin 12px 0 0 12px
          font-size 10px
      .content-right
        flex 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height 48px
          text-align center
          font-size 12px
          font-weight 700
          background #2b333d
          &.not-enough
            background #2b333d
          &.enough
            background #00b43c
            color #fff
    .ball-container
      .ball
        position fixed
        left: 32px
        bottom: 22px
        z-index 200
        transition: all .4s cubic-bezier(.49, -.29, .75, .41)
        .inner
          width: 16px
          height: 16px
          border-radius 50%
          background rgb(0, 160, 220)
          transition: all .4s linear
    .shopList
      width: 100%
      position: absolute
      top: 0
      left: 0
      z-index -1
      transform translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all .5s
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height 40px
        background #f3f5f7
        padding 0 16px
        border-bottom: 1px solid rgba(7, 17, 27, .1)
        .shop
          float left
          font-size 14px
          font-weight 200
          color rgb(7, 17, 27)
        .clear
          float: right
          font-size 12px
          color rgb(0, 160, 220)
      .list-content
        max-height 217px
        padding 0 16px
        background #fff
        overflow hidden
        .list
          position: relative
          padding 12px 0
          border-1px(rgba(7, 17, 27, .1))
          box-sizing border-box
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cart-wrapper
            position: absolute
            right: 0
            bottom: 6px

  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7, 17, 27, .8)
    &.fade-enter-active, &.fade-leave-active
      transition: all .5s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>
