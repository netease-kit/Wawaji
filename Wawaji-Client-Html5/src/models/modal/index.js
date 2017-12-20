import Vue from 'vue'
import Modal from './index.vue'
const ModalConstructor = Vue.extend(Modal)
const instance = new ModalConstructor({
  el: document.createElement('div')
})
document.body.appendChild(instance.$el)
export default {
  install (Vue) {
    Vue.prototype.$showModal = instance
  }
}
