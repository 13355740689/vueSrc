/*
 * @Author: zdh
 * @Date: 2023-07-05 11:10:01
 * @LastEditTime: 2023-07-20 11:31:28
 * @Description: 
 */
let id = 0
class Dep{
  constructor() {
    this.id = id++
    this.subs = []
  }
  // 收集watcher
  depend(){
    // watcher 可以存放 dep
    // this.subs.push(Dep.target)
    Dep.target.addDep(this)
  }
  addSub(watcher) {
    this.subs.push(Dep.target)
  }
  // 更新watcher
  notify(){
    this.subs.forEach(watcher => {
      watcher.update()
    });
  }
}

// dep 和 watcher 关系
Dep.target = null
// 处理多个watcher
let stack = [] // 栈
export function pushTarget(watcher) {
  Dep.target = watcher // 保留watcher
  //入栈
  stack.push(watcher) // 渲染watcher 其他的watcher
}

export function popTarget() {
  // Dep.target = null // 将变量删除
  // 解析完一个watcher 就删除一个watcher [watcher1, watcher2]
  stack.pop()
  Dep.target = stack[stack.length - 1] // 获取到你前面的一个watcher
}

export default Dep