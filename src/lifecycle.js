import { patch } from "./vnode/patch"
import Watcher from "./observe/watcher"
/*
 * @Author: zdh
 * @Date: 2023-07-04 16:18:05
 * @LastEditTime: 2023-07-15 14:45:04
 * @Description: 
 */
export function mountComponent(vm, el) {
  // 源码
  callHook(vm, 'beforeMounted')
  // vm._update(vm._render()) // (1) vm._render 将render函数变成vnode (2) vm._update将vnode 变成 真实dom 放到页面
  let updateComponent = () => {
    vm._update(vm._render())
  }
  new Watcher(vm, updateComponent, () => {}, true)

  callHook(vm, 'mounted')
}

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) { // vnode => 真实的dom
    const vm = this
    // vm.$el 真实的DOM
    // 区分一下 是首次还是更新
    let preVnode = vm._vnode // 如果是首次 值为null
    if(!preVnode) {
      vm.$el = patch(vm.$el, vnode)
      vm._vnode = vnode // 保存原来的那一次
    } else {
      patch(preVnode, vnode)
    }
  }
}

// (1) render() 函数 => vnode => 真实DOM

// 生命周期调用
export function callHook(vm, hook) {
  const handlers = vm.$options[hook]

  if(handlers) {
    for(let i = 0; i < handlers.length; i++) {
      handlers[i].call(this)
    }
  }
}