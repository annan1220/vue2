<template>
  <div class="ratings" ref="ratings">
    <div class="rating-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingSelect @select="selectRating" @toggle="toggleContent" :ratings="ratings" :selectType="selectType"
                    :onlyContent="onlyContent"></ratingSelect>
      <div class="rating-wrapper">
        <ul>
          <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in ratings" :key="index"
              class="rating-item">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28" class="avatar">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend">
                <span class="icon"
                      :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                <span v-for="(item,index) in rating.recommend" :key="index" class="item">{{item}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '../star/star';
  import {formatDate} from '../../common/js/date';
  import split from '../split/split';
  import ratingSelect from '../ratingSelect/ratingSelect';
  import BScroll from 'better-scroll';

  const ERR_OK = 0;
  const ALL = 2;
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        ratings: [],
        onlyContent: false,
        selectType: ALL
      };
    },
    components: {
      star,
      split,
      ratingSelect
    },
    created () {
      this.$http.get('/api/ratings').then((response) => {
        response = response.body;
        if (response.erron === ERR_OK) {
          this.ratings = response.date;
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.ratings, {click: true});
          });
        }
      });
    },
    methods: {
      needShow (type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
      },
      selectRating (type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      toggleContent () {
        this.onlyContent = !this.onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      }
    },
    filters: {
      formatDate (time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  .ratings
    position: absolute
    top: 174px
    bottom 0
    width: 100%
    overflow hidden
    .overview
      display flex
      padding 18px 0
      .overview-left
        flex 0 0 137px
        padding: 6px 0
        width: 137px
        border-right: 1px solid rgba(7, 17, 27, .1)
        text-align: center
        font-size 0
        .score
          font-size 24px
          line-height 28px
          color rgb(255, 153, 0)
          margin-bottom 6px
        .title
          font-size 12px
          line-height 12px
          color rgb(7, 17, 27)
          margin-bottom 8px
        .rank
          font-size 10px
          line-height 10px
          color rgb(147, 153, 159)
      .overview-right
        flex 1
        padding 0 24px
        .score-wrapper
          margin-bottom 8px
          .title
            display inline-block
            vertical-align top
            font-size 12px
            line-height 18px
            color rgb(7, 17, 27)
          .star
            display inline-block
            vertical-align top
            margin 0 5px
          .score
            display inline-block
            vertical-align top
            font-size 12px
            color rgb(255, 153, 0)
            line-height 18px
        .delivery-wrapper
          font-size 0
          .title
            font-size 12px
            line-height 18px
            color rgb(7, 17, 27)
          .delivery
            font-size 12px
            line-height 18px
            margin-left 12px
            color rgb(147, 153, 159)
    .rating-wrapper
      padding 0 18px
      position: relative
      .rating-item
        padding 18px 0
        display flex
        border-1px(rgba(7, 17, 27, .1))
        .avatar
          flex 0 0 28px
          border-radius 28px
          margin-right 12px
        .content
          flex 1
          font-size 0
          .name
            font-size 10px
            color rgb(7, 17, 27)
            line-height 12px
          .star-wrapper
            margin 4px 0 6px 0
            .star
              display inline-block
              vertical-align top
              margin-right 6px
            .delivery
              display inline-block
              vertical-align top
              font-size 10px
              font-weight 200
              color rgb(147, 153, 159)
              line-height 12px
          .text
            font-size 12px
            color rgb(7, 17, 27)
            line-height 18px
            margin-bottom 8px
          .recommend
            font-size 0
            .icon-thumb_up, .icon-thumb_down
              display inline-block
              vertical-align top
              margin-right 8px
              line-height 16px
              font-size 12px
            .icon-thumb_up
              color rgb(0, 160, 220)
            .icon-thumb_down
              color rgb(147, 153, 159)
            .item
              display inline-block
              vertical-align top
              padding 2px 6px
              margin-right 8px
              border 1px solid rgba(7, 17, 27, 0.1)
              font-size 9px
              color rgb(147, 153, 159)
              line-height 16px
              overflow hidden
              border-radius: 1px
          .time
            position: absolute
            right 0
            top: 18px
            font-size 10px
            font-weight 200
            color rgb(147, 153, 159)
            line-height 12px
</style>
