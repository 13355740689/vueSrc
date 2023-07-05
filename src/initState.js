/*
 * @Author: zdh
 * @Date: 2023-07-02 21:34:34
 * @LastEditTime: 2023-07-03 15:39:22
 * @Description: 
 */
import { observer } from "./observe/index"
import { nextTick } from "./utils/nextTick"

export function initState(vm) {
    let opts = vm.$options
    // 判断
    if(opts.data) {
        initData(vm)
    }
}

// vue2 对data初始化               （1） 对象  （2） 函数
function initData(vm) {
    let data = vm.$options.data
    data = vm._data = typeof data === 'function' ? data.call(vm) : data // 注意 this
    // data 数据进行劫持
    // 将 data 上的所有属性代理到实例上
    for (let key in data) {
      proxy(vm, "_data", key)
    }
    observer(data)
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    }
  })
}

export function stateMixin(vm) {
  // 列队 :1就是vue自己的nextTick 用户自己ide
  vm.prototype.$nextTick = function(cb) { // nextTick: 数据更新之后获取到最新的DOM
    nextTick(cb)
  }
}