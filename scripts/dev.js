const minimist = require("minimist"); // minimist 解析命令行参数
const path = require("path");

const args = minimist(process.argv.slice(2));

const target = args._[0] || "reactivity";
const format = args.f || "global";

const entry = path.resolve(__dirname,`../packages/${target}/src/index.ts`);

const pkg = require(path.resolve(__dirname,`../packages/${target}/package.json`)).buildOptions?.name;

// 针对每个模块处理
// iife 自执行函数 -> (function(){})() -> 需要增加一个全局变量
// cjs commonjs 规范
// esm es6Module

const outputFormat = format.startsWith('global') ? 'iife' : format === 'cjs' ? 'cjs' : 'esm';

const outFile = path.resolve(__dirname,`../packages/${target}/dist/${target}.${format}.js`);

// 通过esbuild 来的打包
const { build } = require("esbuild");

build({
    entryPoints:[entry],
    outfile:outFile,
    bundle:true, // 把所有代码 打包一起
    sourcemap:true,
    format:outputFormat,
    globalName: pkg,
    platform: format === 'cjs' ? 'node' : 'browser',
    watch:{
        onRebuild(error){
            if(!error) console.log("rebuilt ~~~~~~")
        }
    }
}).then(()=>{
    console.log("watch!!!!!!")
})




