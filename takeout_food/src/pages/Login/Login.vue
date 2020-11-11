<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;"
             :class="{on:loginMode}"
             @click.prevent="deaLoginMode(true)">短信登录</a>
          <a href="javascript:;"
             :class="{on:!loginMode}"
             @click.prevent="deaLoginMode(false)">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form @submit.prevent="login">
          <div :class="{on:loginMode}">
            <section class="login_message">
              <input type="tel"
                     maxlength="11"
                     placeholder="手机号"
                     v-model="phone">
              <button class="get_verification"
                      :class="{right_phone:phoneRiht}"
                      v-if="!countDown"
                      @click.prevent="geVerifyCode()">获取验证码</button>
              <button disabled="disabled"
                      class="get_verification"
                      v-else>
                已发送({{countDown}}s)
              </button>
            </section>
            <section class="login_verification">
              <input type="tel"
                     maxlength="8"
                     placeholder="验证码"
                     v-model="code">
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on:!loginMode}">
            <section>
              <section class="login_message">
                <input type="tel"
                       maxlength="11"
                       placeholder="手机/邮箱/用户名"
                       v-model="name">
              </section>
              <section class="login_verification">
                <input type="text"
                       maxlength="8"
                       placeholder="密码"
                       v-if="pwdMode"
                       v-model="pwd">
                <input type="password"
                       maxlength="8"
                       placeholder="密码"
                       v-model="pwd"
                       v-else>
                <div class="switch_button "
                     :class="pwdMode?'on':'off'"
                     @click="pwdMode=!pwdMode">
                  <div class="switch_circle"
                       :class="{right:pwdMode}"></div>
                  <span class="switch_text">{{pwdMode?'显示':'隐藏'}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text"
                       maxlength="11"
                       placeholder="验证码"
                       v-model="captcha">
                <img class="get_verification"
                     src="http://localhost:4000/captcha"
                     alt="captcha"
                     @click="getCaptcha"
                     ref="captcha">
              </section>
            </section>
          </div>
          <button class="login_submit">登录</button>
        </form>
        <a href="javascript:;"
           class="about_us">关于我们</a>
      </div>
      <a href="javascript:"
         class="go_back"
         @click="$router.go(-1)">
        <i class="iconfont icon-jiantou2"></i>
      </a>
    </div>
    <alert-tip :alertText='alertText'
               v-show="showalert"
               @closeTip='closeTip' />
  </section>

</template>

<script>
import AlertTip from '../../components/AlertTip/AlertTip'
export default {
  data () {
    return {
      loginMode: true,
      phone: '', // 手机号码
      countDown: 0, // 倒计时
      pwdMode: true,
      pwd: '', // 密码
      code: '', // 短信验证码
      name: '', // 用户名
      captcha: '', // 一次性图形验证码
      alertText: '', // 提示文本内容
      showalert: false

    }
  },
  methods: {
    deaLoginMode (flag) {
      this.loginMode = flag
    },
    // 验证码倒计时
    async geVerifyCode () {
      if (this.phoneRiht) {
        this.countDown = 20
        this.intervald = setInterval(() => {
          this.countDown--
          if (this.countDown === 0) {
            clearInterval(this.intervald)
          }
        }, 1000)
      }
      const { data: res } = await this.$http.get('/sendcode', {
        params: {
          phone: this.phone
        }
      })
      console.log(res)
      if (res.code === 1) {
        this.showAlert(res.msg)
        if (this.countDown) {
          this.countDown = 0
          clearInterval(this.intervald)
        }
      }
    },
    showAlert (alertText) {
      this.showalert = true
      this.alertText = alertText
    },
    async login () {
      let rea
      if (this.loginMode) {
        // 短信登录
        const { phoneRiht, phone, code } = this
        if (!phoneRiht) {
          // 手机号不正确
          this.showAlert('手机号不正确')
          return
        } else if (!/^\d{6}$/.test(code)) {
          this.showAlert('验证码必须是6位数字')
          return
        }
        const { data: res } = await this.$http.post('/login_sms', { phone, code })
        console.log(res)
        rea = res
      } else {
        // 密码登录
        const { name, pwd, captcha } = this
        if (!name) {
          this.showAlert('请输入用户名/手机号/邮箱')
          return
        } else if (!pwd) {
          this.showAlert('用户名或密码不正确')
          return
        } else if (!captcha) {
          this.showAlert('验证码不正确')

          return
        }
        const { data: res } = await this.$http.post('/login_pwd', { name, pwd, captcha })
        console.log(res)
        rea = res
      }
      if (rea.code === 0) {
        // eslint-disable-next-line no-unused-vars
        const user = rea.data
        this.$store.commit('RECEIVE_USERINFO', user)
        this.$router.replace('/profile')
      } else {
        this.showAlert(rea.msg)
        this.getCaptcha()
      }
    },
    closeTip () {
      this.showalert = false
      this.alertText = ''
    },
    getCaptcha () {
      // 一次性获取图形验证码
      this.$refs.captcha.src = 'http://localhost:4000/captcha?time' + new Date()
    }
  },
  computed: {
    phoneRiht () {
      return /^[1][3,4,5,7,8][0-9]{9}$/.test(this.phone)// 手机验证正则
    }
  },
  components: {
    AlertTip
  }
}

</script>
<style lang='stylus' scoped>
.loginContainer
  width 100%
  height 100%
  background #fff
  .loginInner
    padding-top 60px
    width 80%
    margin 0 auto
    .login_header
      .login_logo
        font-size 40px
        font-weight bold
        color #02a774
        text-align center
      .login_header_title
        padding-top 40px
        text-align center
        >a
          color #333
          font-size 14px
          padding-bottom 4px
          &:first-child
            margin-right 40px
          &.on
            color #02a774
            font-weight 700
            border-bottom 2px solid #02a774
    .login_content
      >form
        >div
          display none
          &.on
            display block
          input
            width 100%
            height 100%
            padding-left 10px
            box-sizing border-box
            border 1px solid #ddd
            border-radius 4px
            outline 0
            font 400 14px Arial
            &:focus
              border 1px solid #02a774
          .login_message
            position relative
            margin-top 16px
            height 48px
            font-size 14px
            background #fff
            .get_verification
              position absolute
              top 50%
              right 10px
              transform translateY(-50%)
              border 0
              color #ccc
              font-size 14px
              background transparent
              &.right_phone
                color black
          .login_verification
            position relative
            margin-top 16px
            height 48px
            font-size 14px
            background #fff
            .switch_button
              font-size 12px
              border 1px solid #ddd
              border-radius 8px
              transition background-color 0.3s, border-color 0.3s
              padding 0 6px
              width 30px
              height 16px
              line-height 16px
              color #fff
              position absolute
              top 50%
              right 10px
              transform translateY(-50%)
              &.off
                background #fff
                .switch_text
                  float right
                  color #ddd
              &.on
                background #02a774
              >.switch_circle
                // transform translateX(27px)
                position absolute
                top -1px
                left -1px
                width 16px
                height 16px
                border 1px solid #ddd
                border-radius 50%
                background #fff
                box-shadow 0 2px 4px 0 rgba(0, 0, 0, 0.1)
                transition transform 0.3s
                &.right
                  transform translateX(30px)
          .login_hint
            margin-top 12px
            color #999
            font-size 14px
            line-height 20px
            >a
              color #02a774
        .login_submit
          display block
          width 100%
          height 42px
          margin-top 30px
          border-radius 4px
          background #4cd96f
          color #fff
          text-align center
          font-size 16px
          line-height 42px
          border 0
      .about_us
        display block
        font-size 12px
        margin-top 20px
        text-align center
        color #999
    .go_back
      position absolute
      top 5px
      left 5px
      width 30px
      height 30px
      >.iconfont
        font-size 20px
        color #999
</style>
