import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
axios.defaults.baseURL = '/'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    latitude: '40.10038', // 纬度
    longitude: '116.36867', // 经度
    address: {}, // 地理位置信息
    categorys: [], // 分类数组
    shops: [], // 商家数组
    userInfo: {}, // 用户信息
    goods: [],
    ratings: [],
    info: {},
    cartFoods: [], //购物车列表
    searchShops: [] //搜索列表
  },
  mutations: {
    RECEIVE_ADDRESS(state, address) {
      state.address = address
    },
    RECEIVE_CATAGORYS(state, categorys) {
      state.categorys = categorys
    },
    RECEIVE_SHOPS(state, shops) {
      state.shops = shops
    },
    RECEIVE_USERINFO(state, userInfo) {
      state.userInfo = userInfo
    },
    RESET_USER_INFO(state) {
      state.userInfo = {}
    },
    RESET_GOODS(state, goods) {
      state.goods = goods
    },
    RESET_RATINGS(state, ratings) {
      state.ratings = ratings
    },
    RESET_INFO(state, info) {
      state.info = info
    },
    // 增加减少food
    INCREMENT_FPPD_COUNT(state, {
      food
    }) {
      if (!food.count) {
        Vue.set(food, 'count', 1)
        state.cartFoods.push(food)
      } else {
        food.count++

      }
    },
    DECREMENT_FPPD_COUNT(state, {
      food
    }) {
      if (food.count) {
        food.count--
        if (food.count === 0) {
          state.cartFoods.splice(state.cartFoods.indexOf(food), 1)
        }
      }
    },
    CLEAR_CART(state) {
      state.cartFoods.forEach(food => food.count = 0)
      state.cartFoods = []
    },
    RECEIVE_SEARCH(state, searchShops) {
      state.searchShops = searchShops
    }
  },
  actions: {
    async getAddress({
      commit,
      state
    }) {
      const geohash = state.latitude + ',' + state.longitude
      const {
        data: res
      } = await axios.get('/position/' + geohash)
      if (res.code === 0) {
        commit('RECEIVE_ADDRESS', res.data)
      }
    }, // 获取地理位置信息
    async getCatagorys({
      commit,
      state
    }) {
      const {
        data: res
      } = await axios.get('/index_category')
      if (res.code === 0) {
        commit('RECEIVE_CATAGORYS', res.data)
      }
    }, // 获取分类数组
    async getShops({
      commit,
      state
    }) {
      const {
        data: res
      } = await axios.get('/shops', {
        params: {
          latitude: state.latitude,
          longitude: state.longitude
        }
      })
      if (res.code === 0) {
        commit('RECEIVE_SHOPS', res.data)
      }
    },
    async getUserInfo(context) {
      const {
        data: res
      } = await axios.get('/userinfo')
      if (res.code === 0) {
        context.commit('RECEIVE_USERINFO', res.data)
      }
    },
    // 退出登录
    async logout({
      commit
    }) {
      const {
        data: res
      } = await axios.get('/logout')
      if (res.code === 0) {
        commit('RESET_USER_INFO')
      }
    },
    async getShopInfo({
      commit
    }) {
      const {
        data: res
      } = await axios.get('/info')
      if (res.code === 0) {
        commit('RESET_INFO', res.data)
      }
    },
    async getShopRatings({
      commit
    }, callback) {
      const {
        data: res
      } = await axios.get('/ratings')
      if (res.code === 0) {
        commit('RESET_RATINGS', res.data)
      }
      callback && callback()
    },
    async getShopGoods({
      commit
    }) {
      const {
        data: res
      } = await axios.get('/goods')
      if (res.code === 0) {
        commit('RESET_GOODS', res.data)
      }
    },
    updateFoodCount({
      commit
    }, {
      isAdd,
      food
    }) {
      if (isAdd) {
        commit('INCREMENT_FPPD_COUNT', {
          food
        })
      } else {
        commit('DECREMENT_FPPD_COUNT', {
          food
        })
      }
    },
    async searchShops({
      commit,
      state
    }, keyword) {
      const geohash = state.latitude + ',' + state.longitude
      let {
        data: res
      } = await axios.get('/search_shops', {
        params: {
          geohash,
          keyword
        }
      })
      console.log(res);
      if (res.code === 0) {
        commit('RECEIVE_SEARCH', res.data)
      }
    }
  },
  modules: {},
  getters: {
    totalCount(state) {
      return state.cartFoods.reduce((preTotal, food) => preTotal + food.count, 0)
    },
    totalPrice(state) {
      return state.cartFoods.reduce((preTotal, food) => preTotal + food.count * food.price, 0)
    },
    positiveSize(state) {
      return state.ratings.reduce((preTotal, rating) => preTotal + (rating.rateType === 0 ? 1 : 0), 0)
    }
  }
})
