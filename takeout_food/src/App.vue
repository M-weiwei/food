<template>
  <div id="app">
    <router-view></router-view>
    <footer-guide />
  </div>
</template>

<script>
import FooterGuide from './components/FooterGuide'

export default {
  data () {
    return {

    }
  },
  mounted () {
    this.$store.dispatch('getAddress')
    this.$store.dispatch('getUserInfo')
  },
  methods: {},
  components: {
    FooterGuide
  },
  async created () {
    const { data: res } = await this.$http.get('demo/interfaces/session.php')
    console.log(res)
  }
}

</script>
<style lang='stylus' scoped>
#app
  width 100%
  height 100%
  background #f5f5f5
</style>
