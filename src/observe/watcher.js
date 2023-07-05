/*
 * @Author: zdh
 * @Date: 2023-07-05 10:09:41
 * @LastEditTime: 2023-07-05 13:05:25
 * @Description: 
 */
// (1) 通过这个类watcher 实现更新
import { pushTarget, popTarget } from './dep'
let id = 0
class Watcher {
  constructor(vm, updateComponent, cb, options) {
    // (1)
    this.vm = vm
    this.exprOrfn = updateComponent
    this.cb = cb
    this.options = options
    this.id = id++
    this.deps = [] // watcher存放 dep
    this.depsId = new Set()
    // 判断
    if(typeof updateComponent === 'function') {
      this.getter = updateComponent // 用来更新视图
    }
    // 更新视图
    this.get()
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
  // 初次渲染
  get() {
    pushTarget(this)  // 给dep 添加watch
    this.getter() // 渲染页面 vm._update(vm.render()) _s(msg)
    popTarget() // 给dep 取消watcher
  }
  // 更新
  update() {
    this.getter()
  }
}

export default Watcher

// 收集依赖 vue dep watcher data: {name, msg}
// dep :dep和data中的属性是一一对应
// watcher :在视图上用几个 就有几个watcher
// dep与watcher: 一对多 dep.name=[w1, w2]
