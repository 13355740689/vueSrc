/*
 * @Author: zdh
 * @Date: 2023-07-04 17:16:53
 * @LastEditTime: 2023-07-10 18:00:37
 * @Description:
 */
export function patch(oldVnode, vnode) {
  // 原则 将虚拟节点转换成真实的节点
  // 第一次渲染 oldValue 是一个真实的DOM
  if (oldVnode.nodeType === 1) {
    // vnode => 真实dom
    // (1) 创建新dom
    let el = createElm(vnode);
    // (2)替换 1)获取父节点 2）插入 3）删除
    let parentEl = oldVnode.parentNode; // body
    parentEl.insertBefore(el, oldVnode.nextsibling);
    parentEl.removeChild(oldVnode);
    return el;
  } else {
    // diff
    console.log(oldVnode);
    // 1 元素不是一样
    if (oldVnode.tag !== vnode.tag) {
      return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el);
    }
    // 2 标签一样 text 属性 <div>1</div> <div>2</div> tag:undefined
    if (!oldVnode.tag) {
      if (oldVnode.text !== vnode.text) {
        return (oldVnode.el.textContent = vnode.text);
      }
    }
    // 2.1属性 (标签一样) <div id='a'>1</div> <div id='b'>2</div>
    // 方法 1直接复制
    let el = (vnode.el = oldVnode.el);
    updateProps(vnode, oldVnode.data);
    // diff子元素 <div>1</div> <div></div>
    let oldChildren = oldVnode.children || []
    let newChildren = vnode.children || []
    if (oldChildren.length > 0 && newChildren.length > 0) { // 老的有 新的有
      // 创建方法
      updateChild(oldChildren, newChildren, el)
    } else if (oldChildren.length > 0) { // 老的元素 有儿子 新的没有儿子
      el.innerHTML = ''
    } else if (newChildren.length > 0) { // 老 没有 新的有
      for (let i = 0; i < newChildren.length; i++) {
        let child = newChildren[i]
        //  添加到真实DOM
        el.appendChild(createElm(child))
      }
    }
  }
}

function updateChild(oldChildren, newChildren, el) {
  // vue diff 算法 做了很多优化
  // dom 中操作元素 常用的逻辑 尾部添加 头部添加 倒序和正序的方式
  // vue2 采用双指针的方法 遍历
  // 1.创建双指针
  let oldStartIndex = 0 // 老的开头索引
  let oldStartVnode = oldChildren[oldStartIndex] // 老的开始元素
  let oldEndIndex = oldChildren.length - 1
  let oldEndVnode = oldChildren[oldEndIndex]

  let newStartIndex = 0 // 新的开头索引
  let newStartVnode = newChildren[newStartIndex] // 新的开始元素
  let newEndIndex = newChildren.length - 1
  let newEndVnode = newChildren[newEndIndex]

  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 比对子元素
    // 头部 注意 头部这个元素是不是同一个元素
    if ()
  }
}

// 添加属性
function updateProps(vnode, oldProps = {}) {
  // 第一次
  let newProps = vnode.data || {}; // 获取当前新节点的属性
  let el = vnode.el; // 获取当前真实的节点

  // 1、老的有属性，新的没有属性
  for (let key in oldProps) {
    if (!newProps[key]) {
      // 删除属性
      el.removeAttribute[key];
    }
  }
  // 2.样式 老的 style={color:red} 新的style={'background': red}
  let newStyle = newProps.style || {}; // 获取新的样式
  let oldStyle = oldProps.style || {}; // 获取老的样式
  for (let key in oldStyle) {
    if (!newStyle[key]) {
      el.style = "";
    }
  }

  // 新的
  for (let key in newProps) {
    if (key === "style") {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    } else if ((key = "class")) {
      el.className = newProps.class;
    } else {
      el.setAttribute(key, newProps[key]);
    }
  }
}

// vnode 变成真是的DOM
export function createElm(vnode) {
  // vnode: {tag, text, data, children}
  let { tag, children, key, data, text } = vnode;
  if (typeof tag === "string") {
    // 标签
    vnode.el = document.createElement(tag); // 创建元素
    updateProps(vnode);
    // children []
    if (children.length > 0) {
      children.forEach((child) => {
        // 递归
        vnode.el.appendChild(createElm(child));
      });
    }
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

// vue面试题
// vue的渲染流程 =》数据初始化 =》 对模板进行编译 =》 变成render函数 =》通过render函数编程vnode => 变成真是DOM
// =》放到页面
