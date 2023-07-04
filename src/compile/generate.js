/*
 * @Author: zdh
 * @Date: 2023-07-04 10:54:59
 * @LastEditTime: 2023-07-04 17:10:14
 * @Description: 
 */
/**
 * <div id="app"? hell {{msg}} </div>
 *
 * render() { -c 解析标签
 *  return -c('div', {id: app}, _v('hello' + _s(msg)), _c)
 * }
*/

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

// 处理属性
function genProps(attrs){
  let str = ''
  // 对象
  for(let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    if(attr.name  === 'style') { // {name: 'style', value: 'color: red;font-size: 14px;'}
      let obj = {}
      attr.value.split(";").forEach(item => {
        let [key, val] = [item.split(':')[0], item.split(':')[1]]
        obj[key] = val
      });
      attr.value = obj
    }
    // 拼接
    str += `${attr.name} : ${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

// 处理子节点
function genChildren(el) {
  let children = el.children
  if(children) {
    return children.map(child => gen(child)).join(',')
  }
}
function gen(node) { // 1元素 3文本
  if(node.type === 1) {
    return generate(node)
  } else { // 文本 （1） 只是文本 （2） {{}}
    let text = node.text // 获取文本
    if (!defaultTagRE.test(text)) {
      return `_v(${json.stringify(text)})`
    }
    // {{}}
    let tokens = []
    let lastindex = defaultTagRE.lastIndex = 0
    let match
    while (match = defaultTagRE.exec(text)) {
      let index = match.index
      if(index > lastindex) { // 添加内容
        tokens.push(JSON.stringify(text.slice(lastindex, index)))
      }
      // {{}}
      tokens.push(`_s(${match[1].trim()})`)
      lastindex = index + match[0].length
    }
    // 判断还有没有文本
    if(lastindex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastindex)))
    }
    return `_v(${tokens.join('+')})`
  }
}
export function generate(el) {
  // 注意属性 {id: app, style:{color: red}}
  let children = genChildren(el)
  let code = `_c(${JSON.stringify(el.tag)}, ${el.attrs.length ? `${genProps(el.attrs)}` : `null`}, ${children ? `${children}` : `null`})`
  return code
}