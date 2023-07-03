/*
 * @Author: zdh
 * @Date: 2023-07-02 22:07:36
 * @LastEditTime: 2023-07-03 10:30:21
 * @Description: 
 */
import { ArrayMethods } from './arr'
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
          value: this
        })
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
    observer(value) // 深度代理
    Object.defineProperty(data, key, {
        get() {
            return value
        },
        set(newValue) {
            if (newValue === value) return
            observer(newValue)
            value = newValue
        }
    })
}
// vue2 Object.defineProperty 缺点：只能对对象中一个属性劫持 

