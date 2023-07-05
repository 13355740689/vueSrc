/*
 * @Author: zdh
 * @Date: 2023-07-02 21:13:30
 * @LastEditTime: 2023-07-05 09:35:15
 * @Description: 
 */

import { initState } from "./initState.js"
import { compileToFunction } from './compile/index.js'
import { mountComponent } from "./lifecycle.js"
import { mergeOptions } from "./utils/index.js"
import { callHook } from "./lifecycle.js"
export function initMixin(Vue) {
    Vue.prototype._init = function(options) {
        let vm = this
        vm.$options = mergeOptions(Vue.options, options)

        callHook(vm, 'beforeCreated')
        // 初始化状态
        initState(vm)
        callHook(vm, 'created')

        // 渲染模板
        if(vm.$options.el) {
          vm.$mount(vm.$options.el)
        }
    }

    // 创建 $mount
  Vue.prototype.$mount = function(el) {
    // el template render
    let vm = this
    el = document.querySelector(el) // 获取元素
    vm.$el = el
    let options = vm.$options
    if(!options.render) { // 没有
      let template = options.template
      if (!template && el) {
        el = el.outerHTML
        // 变成ast语法树
        let render = compileToFunction(el)
        // render()

        // (1) 将render 函数变成vnode  (2) vnode 变成 真实DOM放到页面上去
        options.render = render
      }
    }
    // 挂载组件
    mountComponent(vm, el)
  }
}

