/*
 * @Author: zdh
 * @Date: 2023-07-02 22:07:36
 * @LastEditTime: 2023-07-05 15:16:17
 * @Description: 
 */
import { ArrayMethods } from './arr'
import Dep from './dep'
export function observer(data) {
  // 1判断空
  if (typeof data !== 'object' || data === null) {
      return data
  }
  // 1对象 通过一个类
  return new Observer(data)
}

class Observer{
    constructor(value) {
        // 给 value 定义一个属性
        Object.defineProperty(value, "__ob__", {
          enumerable: false,
          configurable: true,
          value: this
        })
        this.dep = new Dep() // 给所有对象类型增加一个dep
        // 判断数据
        if (Array.isArray(value)) {

            value.__proto__ = ArrayMethods
            this.observeArray(value) // 处理对象数组
        } else {
            this.walk(value) // 遍历
        }
    }
    walk(data) {
        let keys = Object.keys(data)
        for(let i = 0; i < keys.length; i++) {
            // 对对象的每个属性进行劫持
            let key = keys[i]
            let value = data[key]
            defineReactive(data, key, value)
        }
    }
    observeArray(value) { // [{a: 1}]
      for(let i = 0; i < value.length; i++) {
        observer(value[i])
      }
    }
}

// 对对象的属性进行劫持
function defineReactive(data, key, value) {
    let childDep = observer(value) // 深度代理
    let dep = new Dep() // 给每一个属性添加一个dep
    Object.defineProperty(data, key, {
        get() { // 收集watcher
          if(Dep.target) {
            dep.depend()
            if(childDep.dep) {
              childDep.dep.depend() // 数组收集
            }
          }
          return value
        },
        set(newValue) {
            if (newValue === value) return
            observer(newValue)
            value = newValue
            dep.notify()
        }
    })
}
// vue2 Object.defineProperty 缺点：只能对对象中一个属性劫持 

