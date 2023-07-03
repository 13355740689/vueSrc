// ast语法树 vnode

/**
 * ast语法树
 * {
 *  tag: 'div',
 *  attrs: [{id: "app"}],
 *  children: [{}]
 * }
 * 
 * 
 */

// 标签名 a-aaa
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;  
// 命名空间标签 aa:aa-xxx
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// 开始标签
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
// 结束标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
// 匹配属性
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; 
// 匹配标签结束的 >
const startTagClose = /^\s*(\/?)>/;
// 匹配 {{ }} 表达式
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

// 遍历
function start(tag, attrs) { // 开始标签

}
function charts(text) {

}
function end() {

}
function parseHTML(html){
  // <div id="app">hello{{ msg }}</div>
  while(html) { // html 为空结束
    let textEnd = html.indexOf('<') // 0
    if (textEnd === 0) { // 标签
      // （1）开始标签
      const startTagMatch = parseStartTag() // 开始标签内容
      start(startTagMatch.tagName, startTagMatch.attrs)
      continue
    }
    // 文本
    let text
    if(textEnd > 0) {
      // 获取文本内容
      text = html.substring(0, textEnd)
    }
    if (text) {
      advance(text.length)
      charts(text)
    }
    break
  }

  function parseStartTag() {
    //
    const start = html.match(startTagOpen) // 1.结果 2.false
    console.log(start)
    // 创建ast语法树
    let match = {
      tagName: start[1],
      attrs: []
    }
    // 删除 开始标签
    advance(start[0].length)
    // 属性
    // 注意 多个 遍历
    // 注意 结束>
    let attr
    let end
    while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
      console.log(attr)
      match.attrs.push({
        name: attr[1],
        value: attr[3] || attr[4] || attr[5]
      })
      advance(attr[0].length)
    }

    if(end) {
      advance(end[0].length)
      return match
    }
  }

  function advance(n) {
    html = html.substring(n)
    console.log(html)
  }
}

export function compileToFunction(el) {
  let ast = parseHTML(el)
}