/*
 * @Author: zdh
 * @Date: 2023-07-05 10:09:41
 * @LastEditTime: 2023-07-07 14:42:38
 * @Description: 
 */
// (1) 通过这个类watcher 实现更新
import { nextTick } from '../utils/nextTick'
import { pushTarget, popTarget } from './dep'
let id = 0
class Watcher {
  constructor(vm, exprOrfn, cb, options) {
    // 1.创建类第一步将选项放在实例上
    this.vm = vm
    this.exprOrfn = exprOrfn
    this.cb = cb
    this.options = options
    // 2. 每一组件只有一个watcher 
    this.id = id++
    this.user = !! options.user
    // 3.判断表达式是不是一个函数
    this.deps = [] // watcher 记录有多少 dep 依赖
    this.depsId = new Set()

    // 判断
    if(typeof exprOrfn === 'function') {
      this.getter = exprOrfn // 用来更新视图
    } else { // {a, b, c} 字符串 变成函数
      this.getter = function() { // 属性 c.c.c
        let path = exprOrfn.split('.')
        let obj = vm

        for(let i = 0; i < path.length; i++) {
          obj = obj[path[i]]
        }
        return obj
      }
    }
    // 4.执行渲染页面
    this.value = this.get() // 保存watch 初始值
  }
  addDep(dep) {
    // 1.去重
    let id = dep.id
    if(!this.depsId.has(id)) {
      this.deps.push(dep)
      this.depsId.add(id)
      dep.addSub(this)
    }
  }
  run(){ // old new
    let value = this.get() // new
    let oldValue = this.value // old
    this.value = value
    // 执行 handler(cb) 这个用户watcher
    if(this.user) {
      this.cb.call(this.vm, value, oldValue )
    }
  }
  // 初次渲染
  get() {
    pushTarget(this)  // 给dep 添加watch
    const value = this.getter() // 渲染页面 vm._update(vm.render()) _s(msg)
    popTarget() // 给dep 取消watcher
    return value
  }
  // 更新
  update() {
    // 注意: 不要数据更新后每次都调用get方法， get方法会重新渲染
    // 缓存
    // this.getter()
    queueWatcher(this)
  }
}

let queue = [] // 将需要批量更新的watcher存放到一个队列中
let has = {}
let pending = false
function flushWatcher(){
  queue.forEach(item => item.run())
  queue = []
  has = {}
  pending = false
}

function queueWatcher(watcher) {
  let id = watcher.id // 每个组件都是同一个watcher

  if(has[id] == null) {
    // 列队处理
    queue.push(watcher) // 将watcher 添加到队列中
    has[id] = true
    // 防抖
    if(!pending) {
      // 异步： 等待同步代码执行完毕之后，再执行
      // setTimeout(() => {
      //   queue.forEach(item => item.run())
      //   queue = []
      //   has = {}
      //   pending = false
      // }, 0)

      nextTick(flushWatcher) // 相当于定时器
    }
    pending = true
  }
}

export default Watcher

// 收集依赖 vue dep watcher data: {name, msg}
// dep :dep和data中的属性是一一对应
// watcher :在视图上用几个 就有几个watcher
// dep与watcher: 一对多 dep.name=[w1, w2]

// nenxttick 原理
// 优化
// 1.创建nextTick
