#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')
const ejs = require('ejs')
const ora = require('ora')
const exec = require('./utils/exec')
const prettier = require('prettier')
const getOptions = require('./options')
const tamplatePath = path.resolve(__dirname, './template');

(async () => {
    // 获取用户需要的选项
    const options = await getOptions()

    // 显示动画
    const spinner = ora('build file...').start();

    // 项目路径
    let projectPath = path.resolve(process.cwd(), `./${options.projectName}`);
    // 创建项目文件夹
    fs.mkdirSync(projectPath)
    // 创建 package.json
    ejsToFile('package', 'json')
    // 创建index.js文件
    ejsToFile('index', 'js')
    // 创建config.js
    // fs.copySync(tamplatePath + '/config', projectPath + '/config')
    ejsToFile('config/index', 'js')
    spinner.text = 'install package...'
    // 安装 koa
    await exec(`cd ${projectPath} && cnpm install koa`)

    function ejsToFile(fileName, format) {
        if (fileName.indexOf('/') !== -1) {
            const dirName = fileName.substr(0, fileName.indexOf('/'))
            fs.mkdirSync(projectPath + `/${dirName}`)
        }
        const content = fs.readFileSync(tamplatePath + `/${fileName}.ejs`).toString()
        if(format === 'js'){
            const code = prettier.format(ejs.render(content, options), { semi: false, parser: "babel" });
            fs.writeFileSync(projectPath + `/${fileName}.${format}`,code )
        }else{
            fs.writeFileSync(projectPath + `/${fileName}.${format}`,ejs.render(content, options))
        }
    }

    const cd = `cd ${projectPath} &&`
    let middlewareTask = {
        async koaRouter() {
            fs.copySync(tamplatePath + '/routes', projectPath + '/routes')
            await exec(`${cd} cnpm install koa-router`)
        },
        async koaStatic() {
            fs.mkdirSync(projectPath + '/static')
            await exec(`${cd} cnpm install koa-static`)
        },
        async koaBody() {
            await exec(`${cd} cnpm install koa-bodyparser`)
        },
        async koaViews() {
            fs.mkdirSync(projectPath + '/views')
            await exec(`${cd} cnpm install koa-views`)
        },
        async sequelize() {
            fs.copySync(tamplatePath + '/db', projectPath + '/db')
            await exec(`${cd} cnpm install sequelize mysql2`)
        }
    }

    // 处理中间件
    
    for (const key in options.middleware) {
        if (options.middleware[key] && middlewareTask[key]) {
            middlewareTask[key]()
        }
    }
    spinner.stop()
})()

