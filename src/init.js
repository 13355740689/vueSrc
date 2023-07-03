/*
 * @Author: zdh
 * @Date: 2023-07-02 21:13:30
 * @LastEditTime: 2023-07-03 16:26:46
 * @Description: 
 */

import { initState } from "./initState.js"
import { compileToFunction } from './compile/index.js'
export function initMixin(Vue) {
    Vue.prototype._init = function(options) {
        let vm = this
        vm.$options = options
        // 初始化状态
        initState(vm)

        // 渲染模板
        if(vm.$options.el) {
          vm.$mount(vm.$options.el)
        }
    }

    // 创建 $mount
  Vue.prototype.$mount = function(el) {
    console.log(el)
    // el template render
    let vm = this
    el = document.querySelector(el) // 获取元素
    let options = vm.$options
    if(!options.render) { // 没有
      let template = options.template
      if (!template && el) {
        el = el.outerHTML
        console.log(el)
        // 变成ast语法树
        let ast = compileToFunction(el)
        // render()
        // 
      }
    }
  }
}

