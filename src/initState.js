import { observer } from "./observe/index"

export function initState(vm) {
    let opts = vm.$options
    // 判断
    if(opts.data) {
        initData(vm)
    }
}

// vue2 对data初始化               （1） 对象  （2） 函数
function initData(vm) {
    let data = vm.$options.data
    data = vm._data = typeof data === 'function' ? data.call(vm) : data // 注意 this
    // data 数据进行劫持
    observer(data)
}