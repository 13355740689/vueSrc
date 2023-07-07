/*
 * @Author: zdh
 * @Date: 2023-07-04 17:16:53
 * @LastEditTime: 2023-07-07 14:27:57
 * @Description: 
 */
export function patch(oldVnode, vnode) {
  // vnode => 真实dom
  // (1) 创建新dom
  let el = createEl(vnode)
  // (2)替换 1)获取父节点 2）插入 3）删除
  let parentEl = oldVnode.parentNode // body
  parentEl.insertBefore(el, oldVnode.nextsibling)
  parentEl.removeChild(oldVnode)
  return el
}

// 创dom
function createEl(vnode) { // vnode: {tag, text, data, children}
  let {tag, children, key, data, text} = vnode
  if(typeof tag === 'string') { // 标签
    vnode.el = document.createElement(tag) // 创建元素
    // children []
    if(children.length > 0) {
      children.forEach(child => {
        // 递归
        vnode.el.appendChild(createEl(child))
      })
    }
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

// vue面试题
// vue的渲染流程 =》数据初始化 =》 对模板进行编译 =》 变成render函数 =》通过render函数编程vnode => 变成真是DOM
// =》放到页面