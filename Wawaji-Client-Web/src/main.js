import platform from 'platform'
import Vue from 'vue'
import App from './App.vue'
import Modal from './models/Modal/index.js'

if (/Chrome/.test(platform.name) && parseFloat(platform.version) >= 54) {
  // ...
} else {
  if (window.confirm('您的浏览器很可能无法正常游戏！只能观看他人游戏。\n强烈建议使用Chrome 54及以上版本浏览器。')) {
    window.open('http://www.google.cn/chrome/browser/desktop/index.html', 'chrome', false)
  }
}

Vue.use(Modal)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
/* eslint-enable no-new */
