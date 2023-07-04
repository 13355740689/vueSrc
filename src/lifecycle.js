import { patch } from "./vnode/patch"

/*
 * @Author: zdh
 * @Date: 2023-07-04 16:18:05
 * @LastEditTime: 2023-07-04 17:17:38
 * @Description: 
 */
export function mountComponent(vm, el) {
  // 源码
  vm._update(vm._render()) // (1) vm._render 将render函数变成vnode (2) vm._update将vnode 变成 真实dom 放到页面
}

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) { // vnode => 真实的dom
    let vm = this
    // 两个参数 （1）旧dom (2)vnode
    vm.$el = patch(vm.$el, vnode)
  }
}

// (1) render() 函数 => vnode => 真实DOM