/*
 * @Author: zdh
 * @Date: 2023-07-03 16:24:34
 * @LastEditTime: 2023-07-04 17:09:15
 * @Description: 
 */
import { generate } from "./generate";
import { parseHTML } from "./parseAst";

export function compileToFunction(el) {
  // 1.将html变成ast语法树
  let ast = parseHTML(el)
  // 2.将ast变成render函数 （1）ast 语法变成字符串 （2)字符串变成函数
  let code = generate(ast)
  // 3.将render 字符串变成 函数
  let render = new Function(`with(this){return ${code}}`)
  return render
}