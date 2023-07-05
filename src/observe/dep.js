/*
 * @Author: zdh
 * @Date: 2023-07-05 11:10:01
 * @LastEditTime: 2023-07-05 13:05:53
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

// 添加watcher
Dep.target = null
export function pushTarget(watcher) {
  Dep.target = watcher
}

export function popTarget() {
  Dep.target = null
}

export default Dep