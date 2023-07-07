/*
 * @Author: zdh
 * @Date: 2023-07-06 09:12:07
 * @LastEditTime: 2023-07-07 14:29:29
 * @Description: 
 */
import { observer } from "./observe/index"
import Watcher from "./observe/watcher"
import { nextTick } from "./utils/nextTick"

export function initState(vm) {
    let opts = vm.$options
    // 判断
    if(opts.data) {
        initData(vm)
    }
    if(opts.watch) {
      initWatch(vm)
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

function initWatch(vm) {
  // 1获取watch
  let watch = vm.$options.watch
  // 2.遍历{a,b,c}
  for(let key in watch) {
    // 2.1 获取 他的属性对应的值 （判断）
    let handler = watch[key] // 数组，对象，字符，函数
    if(Array.isArray(handler)) { // 数组
      handler.forEach(item => {
        createWatcher(vm, key, item)
      });
    } else { // 对象，字符，函数
      // 3创建一个方法来处理
      createWatcher(vm, key, handler)
    }
  }
}

// vm.$watch(() => {return 'a'}) // 返回的值就是 watcher 上的属性
// 格式化处理
function createWatcher(vm, exprOrfn, handler, options) {
  // 3.1 处理handler
  if(typeof handler === 'object') {
    options = handler // 用户的配置项目
    handler = handler.handler // 这个是一个函数
  }
  if(typeof handler === 'string') { // 'aa'
    handler = vm[handler] // 将实例上的方法作为handler
  }
  // 其他是函数
  // watch 最终处理 $watch 这个方法
  return vm.$watch(vm, exprOrfn, handler, options)
}

export function stateMixin(vm) {
  // 列队 :1就是vue自己的nextTick 用户自己ide
  vm.prototype.$nextTick = function(cb) { // nextTick: 数据更新之后获取到最新的DOM
    nextTick(cb)
  },
  vm.prototype.$watch = function(Vue, exprOrfn, handler, options = {}){ // 上面格式化处理
    // 实现watch 方法 就是new watcher // 渲染走 渲染watcher $watch 走 watcher user false
    // watch 核心 watcher
    let watcher = new Watcher(Vue, exprOrfn, handler, {...options, user: true})
    if(options.immediate) {
      handler.call(Vue) // 如果有这个immediate 立即执行
    }
  }
}