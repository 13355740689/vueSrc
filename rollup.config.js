/*
 * @Author: zdh
 * @Date: 2023-07-02 17:23:40
 * @LastEditTime: 2023-07-07 16:50:42
 * @Description: 
 */
import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
    input: './src/index.js',
    output: {
        file: 'dist/vue.js',
        format: 'umd',
        name: 'Vue',
        sourcemap: true
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        serve({
            port: 3000,
            contentBase: '',
            openPage: '/index-diff.html'
        })
    ]
}