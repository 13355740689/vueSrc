let callback = []
let pending = false

function flush() {
    callback.forEach(cb => cb())
    pending = false
}

let timerFunc
// 处理兼容问题
if(Promise) {
    timerFunc = () => {
        Promise.resolve().then(flush) // 异步处理
    }
} else if(MutationObserver) { //h5 异步 可以监听 DOM变化， 监控完毕之后再来异步更新
    let observe = new MutationObserver()
    let textNode = document.createTextNode(1) // 创建文本
    observe.observe(textNode, {
        characterData: true
    }) // 观测文本的内容
    timerFunc = () => {
        textNode.textContent = 2
    }
} else if(setImmediate) {
    timerFunc = () => {
        setImmediate(flush)
    }
}
export function nextTick(cb) {
    // 列队
    callback.push(cb)
    // Promise.then()
    if(!pending) {
        timerFunc()  // 异步 但是处理兼容问题
        pending = true
    }
}