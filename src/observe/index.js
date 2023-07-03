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
        // 判断数据
        if (Array.isArray(value)) {
            value.__proto__ = ArrayMethods
            console.log('----array---------')
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
}

// 对对象的属性进行劫持
function defineReactive(data, key, value) {
    observer(value) // 深度代理
    Object.defineProperty(data, key, {
        get() {
            console.log('获取')
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

