/*
 * @Author: zdh
 * @Date: 2023-07-04 16:14:34
 * @LastEditTime: 2023-07-20 17:57:49
 * @Description: 
 */
export function renderMixin(Vue) {
  Vue.prototype._c = function() { // 标签
    // 创建标签
    return createElement(this, ...arguments)
  }
  Vue.prototype._v = function(text) { // 文本
    return createTextVnode(text)
  }
  Vue.prototype._s = function(val) { // 变量
    return val === null ? '' : (typeof val === 'object') ? JSON.stringify(val) : val
  }

  Vue.prototype._render = function() { // render函数变成vnode
    let vm = this
    let render = vm.$options.render
    let vnode = render.call(this)
    return vnode
  }
}

// 创建元素
function createElement(vm, tag, data = {}, ...children) {
  // 注意 标签 组件
  // 判断
  if(isResved(tag)) {
    return vnode(vm, tag, data, data.key, children  )
  } else { // 组件
    // 创建组件 实例
    const Ctor = vm.$options['components'][tag] // 获取到自己的组件
    console.log(Ctor)
    return Createcomponent(vm, tag, data, children, Ctor)
  }
}

function Createcomponent(vm, tag, data, children, Ctor) {
  if(typeof Ctor === 'object') {
    // 如果是一个对象
    // Ctor = 
    console.log(6666665)
  }
}

function isResved(tag) {
  return ['a', 'div', 'h', 'h2', 'button', 'span', 'input'].includes(tag)
}

// 创建vnode
function vnode(vm, tag, data, key, children, text) {
  return {
    vm,
    tag,
    data,
    key,
    children,
    text
  }
}
// 创建文本
function createTextVnode(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

// vnode 节点
/**
 * {
 * tag,
 * text,
 * children
 * }
 * 
 */