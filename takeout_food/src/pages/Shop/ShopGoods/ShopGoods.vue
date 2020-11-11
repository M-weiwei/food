<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper"
           ref="menuWrapper">
        <ul class="content">
          <li class="menu-item"
              v-for="(good,i) in goods"
              :key="i"
              :class="{current:i===currentIndex}"
              ref="menulist"
              @click="clickLeftIndex(i)"> <span class="text bottom-border-1px"> <img class="icon"
                   :src="good.icon"
                   v-if="good.icon"> {{good.name}} </span> </li>
        </ul>
      </div>
      <div class="foods-wrapper"
           ref="foodsWrapper">
        <ul>
          <li class="food-list-hook"
              v-for="(good,i) in goods"
              :key="i">
            <h1 class="title">{{good.name}}</h1>
            <ul>
              <li class="food-item bottom-border-1px"
                  v-for="(food,i1) in good.foods"
                  :key="i1"
                  @click="showFood(food)">
                <div class="icon"> <img width="57"
                       height="57"
                       :src="food.icon"> </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra"> <span class="count">月售 {{food.sellCount}} 份</span> <span>好评率 {{food.rating}}%</span></div>
                  <div class="price"> <span class="now">￥{{food.price}}</span>
                    <span class="old"
                          v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <CartControl :food='food' />
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <ShopCart />
    </div>
    <Food :food='food'
          ref="food" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BScroll from 'better-scroll'
import CartControl from '../../../components/CartControl/CartControl'
import Food from '../../../components/Food/Food'
import ShopCart from '../../../components/ShopCart/ShopCart'


export default {
  data () {
    return {
      scrollY: 0,
      tops: [],
      food: {}
    }
  },
  methods: {
    _initBScrool () {
      this.leftScroll = new BScroll('.menu-wrapper', {
        scrollY: true,
        click: true
      })
      this.roghtScroll = new BScroll('.foods-wrapper', {
        scrollY: true,
        click: true,
        probeType: 3// 派发滚动监听
      })
      this.roghtScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(pos.y)
      })
    },
    _initRightLiTop () {
      const tempTop = []
      let top = 0
      tempTop.push(top)
      const allLis = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      Array.prototype.slice.call(allLis).forEach((element, i) => {
        if (i === allLis.length - 1) {
          element.style.paddingBottom = `${window.innerHeight - element.clientHeight - 50}px`
        }
        top += element.clientHeight// 每个板块的高度
        tempTop.push(top)
      })
      this.tops = tempTop
      console.log(this.tops)
    },
    _leftScoll (i) {
      const menulists = this.$refs.menulist
      const el = menulists[i]
      this.leftScroll.scrollToElement(el, 300, 0, -100)
    },
    clickLeftIndex (i) {
      this.scrollY = this.tops[i]
      this.roghtScroll.scrollTo(0, -this.scrollY, 500)
    },
    showFood (food) {
      this.food = food
      //   父组件调用子组件
      this.$refs.food.toggrlShow()
    }
  },
  mounted () {
    this.$store.dispatch('getShopGoods')
  },
  computed: {
    ...mapState(['goods']),
    currentIndex () {
      // 计算当前分类下标
      const { scrollY, tops } = this
      return tops.findIndex((liTop, index) => {
        this._leftScoll(index)
        return scrollY >= liTop && scrollY < tops[index + 1]
      })
    }
  },
  watch: {
    goods () {
      this.$nextTick(() => {
        this._initBScrool()
        this._initRightLiTop()
      })
    }
  },
  components: {
    CartControl,
    Food,
    ShopCart
  }
}

</script>
<style lang='stylus' scoped>
@import '../../../assets/stylus/mixins.styl'
.goods
  display flex
  position absolute
  top 195px
  bottom 46px
  width 100%
  background #fff
  overflow hidden
  .menu-wrapper
    flex 0 0 80px
    width 80px
    background #f3f5f7
    .menu-item
      display table
      height 54px
      width 56px
      padding 0 12px
      line-height 14px
      &.current
        position relative
        z-index 10
        margin-top -1px
        background #fff
        color $green
        font-weight 700
        .text
          border-none()
      .icon
        display inline-block
        vertical-align top
        width 12px
        height 12px
        margin-right 2px
        background-size 12px 12px
        background-repeat no-repeat
      .text
        display table-cell
        width 56px
        vertical-align middle
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        font-size 12px
  .foods-wrapper
    flex 1
    .title
      padding-left 14px
      height 26px
      line-height 26px
      border-left 2px solid #d9dde1
      font-size 12px
      color rgb(147, 153, 159)
      background #f3f5f7
    .food-item
      display flex
      margin 18px
      padding-bottom 18px
      bottom-border-1px(rgba(7, 17, 27, 0.1))
      &:last-child
        border-none()
        margin-bottom 0
      .icon
        flex 0 0 57px
        margin-right 10px
      .content
        flex 1
        .name
          margin 2px 0 8px 0
          height 14px
          line-height 14px
          font-size 14px
          color rgb(7, 17, 27)
        .desc, .extra
          line-height 10px
          font-size 10px
          color rgb(147, 153, 159)
        .desc
          line-height 12px
          margin-bottom 8px
        .extra
          .count
            margin-right 12px
        .price
          font-weight 700
          line-height 24px
          .now
            margin-right 8px
            font-size 14px
            color rgb(240, 20, 20)
          .old
            text-decoration line-through
            font-size 10px
            color rgb(147, 153, 159)
        .cartcontrol-wrapper
          position absolute
          right 0
          bottom 12px
</style>
