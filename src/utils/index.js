/*
 * @Author: zdh
 * @Date: 2023-07-05 09:05:12
 * @LastEditTime: 2023-07-05 09:17:25
 * @Description: 
 */
export const HOOKS = [
    "beforeCreate",
    "created",
    "beforeMount",
    "mounted",
    "beforeUpdate",
    "updated",
    "beforeDestory",
    "destoryed"
]

// 策略模式
let starts = {}
starts.data = function(parentVal, childVal) { // 合并data
  return childVal
}
starts.computed = function() { // 合并computed

}
starts.watch = function() { // 合并watch
}
starts.methods = function() { // 合并methods
}

// 遍历生命周期
HOOKS.forEach(hooks => {
    starts[hooks] = mergeHook
});

function mergeHook(parentVal, childVal) {
    // {created:[a, b, c], watch:[a, b]}
    if(childVal) {
        if(parentVal) {
            return parentVal.concat(childVal)
        } else {
            return [childVal]
        }
    } else {
        return parentVal
    }
}

export function mergeOptions(parent, child) {
    //  Vue.options = {created:[a, b, c], watch:[a, b]}
    const options = {}
    // 如果有父亲，没有儿子
    for(let key in parent) {
        mergeField(key)
    }
    // 儿子有 父亲没有
    for(let key in child) {
        mergeField(key)
    }

    function mergeField(key) {
        // 根据key 策略模式
        if(starts[key]) {
            options[key] = starts[key](parent[key], child[key])
        } else {
            options[key] = child[key]
        }
    }
    
    return options
}