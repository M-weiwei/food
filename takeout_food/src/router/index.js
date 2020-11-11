import Vue from 'vue'
import VueRouter from 'vue-router'
import Msite from '../pages/Msite/Msite.vue'
import Order from '../pages/Order/Order.vue'
import Profile from '../pages/Profile/Profile.vue'
import Search from '../pages/Search/Search.vue'
import Login from '../pages/Login/Login.vue'
import Shop from '../pages/Shop/Shop.vue'
import ShopGoods from '../pages/Shop/ShopGoods/ShopGoods.vue'
import ShopInfo from '../pages/Shop/ShopInfo/ShopInfo.vue'
import ShopRatings from '../pages/Shop/ShopRatings/ShopRatings.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/msite',
  component: Msite,
  meta: {
    showBottomTabBar: true
  }
}, {
  path: '/order',
  component: Order,
  meta: {
    showBottomTabBar: true
  }
}, {
  path: '/profile',
  component: Profile,
  meta: {
    showBottomTabBar: true
  }
}, {
  path: '/search',
  component: Search,
  meta: {
    showBottomTabBar: true
  }
}, {
  path: '/',
  redirect: '/msite'
}, {
  path: '/login',
  component: Login
}, {
  path: '/shop',
  component: Shop,
  children: [{
      path: '/shop/goods',
      component: ShopGoods
    },
    {
      path: '/shop/info',
      component: ShopInfo
    },
    {
      path: '/shop/ratings',
      component: ShopRatings
    },
    {
      path: '',
      redirect: '/shop/goods'
    }
  ]
}]

const router = new VueRouter({
  routes
})

export default router
