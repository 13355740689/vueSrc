/*
 * @Author: zdh
 * @Date: 2023-07-02 17:37:02
 * @LastEditTime: 2023-07-07 16:59:44
 * @Description: 
 */
import { compileToFunction } from "./compile/index"
import { initGlobalApi } from "./global-api/index"
import { initMixin } from "./init"
import { stateMixin } from "./initState"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./vnode/index"
import { createElm, patch } from "./vnode/patch"


function Vue(options) {
    // 初始化
    this._init(options)
}

initMixin(Vue)

lifecycleMixin(Vue) // 添加生命周期
renderMixin(Vue) // 添加render
stateMixin(Vue) // 给vm添加 $nextTick
// 全局方法 Vueminin Vue.component Vue.extend
initGlobalApi(Vue)

console.log('88888888')
// 创建vnode
let vm1 = new Vue({data: {name: '张三'}})
let render1 = compileToFunction(`<div id="a">{{name}}</div>`)
let vnode1 = render1.call(vm1)
document.body.appendChild(createElm(vnode1))

let vm2 = new Vue({data: {name: '李四'}})
let render2 = compileToFunction(`<div id="a">{{name}}</div>`)
let vnode2 = render2.call(vm1)
// patch 比对
patch(vnode1, vnode2)
export default Vue