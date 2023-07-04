/*
 * @Author: zdh
 * @Date: 2023-07-02 17:37:02
 * @LastEditTime: 2023-07-04 16:26:39
 * @Description: 
 */
import { initGlobalApi } from "./global-api/index"
import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./vnode/index"


function Vue(options) {
    // 初始化
    this._init(options)
}

initMixin(Vue)

lifecycleMixin(Vue) // 添加生命周期
renderMixin(Vue) // 添加render

// 全局方法 Vueminin Vue.component Vue.extend
initGlobalApi(Vue)
export default Vue