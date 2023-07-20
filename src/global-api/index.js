/*
 * @Author: zdh
 * @Date: 2023-07-05 09:05:12
 * @LastEditTime: 2023-07-20 17:36:35
 * @Description: 
 */
import { mergeOptions } from "../utils/index"

export function initGlobalApi(Vue) {
    // 源码
    //  Vue.options = {created:[a, b, c], watch:[a, b]}
    Vue.options = {}
    Vue.Mixin = function(mixin) {
        // 对象的合并
        this.options  = mergeOptions(this.options, mixin) 
    }
    // 组件
    // 1.在vue属性中 定义一个全局方法
    Vue.options.components = {}  // 放全局组件
    Vue.component = function (id, componentDef) {
      // 注意：
      componentDef.name = componentDef.name || id
      // 核心 Vue 创建组件的核心 Vue.extend()
      componentDef = this.extend(componentDef) // 返回一个实例
      this.options.components[id] = componentDef
      console.dir(this.options)
    }

    // Vue.extend 核心 创建 子类
    Vue.extend = function(options) {
      let spuer = this
      const Sub = function vuecomponent (opts) { // opts 子组件的实例
        // 注意 new Sub().$mount
        // 初始化
        this._init(opts)
      }
      // 子组件继承父组件中属性 Vue 类的继承
      Sub.prototype = Object.create(spuer.prototype)
      // 问题 子组件中this的执行
      Sub.prototype.constructor = Sub
      // 将父组件中的属性合并到子组件中
      Sub.options = mergeOptions(this.options, options)
      console.log(Sub.options)
      return Sub
    }
}