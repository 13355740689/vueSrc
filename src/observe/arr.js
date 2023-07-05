/*
 * @Author: zdh
 * @Date: 2023-07-02 22:06:52
 * @LastEditTime: 2023-07-05 14:45:26
 * @Description: 
 */
// 重写数组

// (2)获取原来的数组方法
let oldArrayProtoMethods = Array.prototype

// (2)继承
export let ArrayMethods = Object.create(oldArrayProtoMethods)

// (3)劫持
let methods = [
    'push',
    'pop',
    'unshift',
    'shift',
    'splice'
]

methods.forEach(item => {
    ArrayMethods[item]= function (...args) {
        let result = oldArrayProtoMethods[item].apply(this, args)
        // 问题： 数组追加对象的情况 arr.push({})
        let inserted
        switch (item) {
          case 'push':
          case 'unshift':
            inserted = args
            break;
          case "splice":
            inserted = args.splice(2); // arr.splice(0, 1, {a: 6})
            break
        }
        let ob = this.__ob__
        if (inserted) {
          ob.observeArray(inserted)
        }
        ob.dep.notify()
        return result
    }
})