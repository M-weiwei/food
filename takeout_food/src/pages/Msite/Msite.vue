<template>
  <div>
    <section class="msite">
      <!--首页头部-->

      <HeaderTop :title="address.name">
        <router-link class="header_search"
                     slot="left"
                     to="/search">
          <i class="iconfont icon-sousuo"></i>
        </router-link>
        <router-link class="header_login"
                     slot="right"
                     :to="userInfo._id?'/userinfo':'/login'">
          <span class="header_login_text"
                v-if="!userInfo._id">登录|注册</span>
          <span class="header_login_text"
                v-else>
            <i class="iconfont icon-person"></i>
          </span>

        </router-link>
      </HeaderTop>
      <nav class="msite_nav">
        <swiper ref="mySwiper"
                class="swiper-container"
                :options="swiperOptions"
                v-if="categorys.length">
          <swiper-slide v-for="(item,i) in categorysArr"
                        :key="i">
            <a href="javascript:"
               class="link_to_food"
               v-for="(items,i1) in item"
               :key="i1">
              <div class="food_container">
                <img :src="baseImageUrl+items.image_url">
              </div>
              <span>{{items.title}}</span>
            </a>
          </swiper-slide>
          <!--右箭头。如果放置在swiper-container外面，需要自定义样式。-->
          <div class="swiper-pagination"
               slot="pagination"></div>
        </swiper>
        <img src="./images/msite_back.svg"
             alt=""
             v-else>
      </nav>
      <!--首页导航-->

      <!--首页附近商家-->
      <div class="msite_shop_list">
        <div class="shop_header">
          <i class="iconfont icon-xuanxiang"></i>
          <span class="shop_header_title">附近商家</span>
        </div>
        <ShopList />
      </div>
    </section>
  </div>
</template>

<script>
import HeaderTop from '../../components/HeaderTop'
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import ShopList from '../../components/ShopList/ShopList'
import { mapState } from 'vuex'
// If you use Swiper 6.0.0 or higher
export default {
  data () {
    return {
      swiperOptions: {
        loog: true,
        pagination: '.swiper-pagination'
      },
      baseImageUrl: 'https://fuss10.elemecdn.com'
    }
  },
  methods: {
  },
  mounted () {
    this.$store.dispatch('getCatagorys')
    this.$store.dispatch('getShops')
  },
  watch: {
    categorys () {
      this.$nextTick(() => {
        this.swiper.slideTo(0, 1000, false)
      })
    }
  },
  components: {
    HeaderTop,
    Swiper,
    SwiperSlide,
    ShopList
  },
  directives: {
    directive
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.$swiper
    },
    ...mapState(['address', 'categorys', 'userInfo']),
    categorysArr () {
      const { categorys } = this
      const arr = []
      let minarr = []
      categorys.forEach(element => {
        if (minarr.length === 8) {
          minarr = []
        }
        if (minarr.length === 0) {
          arr.push(minarr)
        }
        minarr.push(element)
      })
      return arr
    }
  }
}

</script>
<style lang='stylus' scoped>
@import '../../assets/stylus/mixins.styl'
.msite // 首页
  width 100%
  .header
    background-color #02a774
    position fixed
    z-index 100
    left 0
    top 0
    width 100%
    height 45px
    .header_search
      position absolute
      left 15px
      top 50%
      transform translateY(-50%)
      width 10%
      height 50%
      .icon-sousuo
        font-size 25px
        color #fff
    .header_title
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
      width 50%
      color #fff
      text-align center
      .header_title_text
        font-size 20px
        color #fff
        display block
    .header_login
      font-size 14px
      color #fff
      position absolute
      right 15px
      top 50%
      transform translateY(-50%)
      .header_login_text
        color #fff
  .msite_nav
    bottom-border-1px(#e4e4e4)
    margin-top 45px
    height 200px
    background #fff
    .swiper-container
      width 100%
      height 100%
      .swiper-wrapper
        width 100%
        height 100%
        .swiper-slide
          display flex
          justify-content center
          align-items flex-start
          flex-wrap wrap
          .link_to_food
            width 25%
            .food_container
              display block
              width 100%
              text-align center
              padding-bottom 10px
              font-size 0
              img
                display inline-block
                width 50px
                height 50px
            span
              display block
              width 100%
              text-align center
              font-size 13px
              color #666
      .swiper-pagination
        >span.swiper-pagination-bullet-active
          background #02a774
  .msite_shop_list
    top-border-1px(#e4e4e4)
    margin-top 10px
    background #fff
    .shop_header
      padding 10px 10px 0
      .shop_icon
        margin-left 5px
        color #999
      .shop_header_title
        color #999
        font-size 14px
        line-height 20px
</style>
