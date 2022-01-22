var inquirer = require('inquirer');

const projectName = require('./questions/project-name')
const port = require('./questions/port')
const middleware = require('./questions/middleware')

module.exports = async () =>{

    const answers = await inquirer.prompt([
        projectName(),
        port(),
        middleware()
    ])
    
    let middlewareMap = [
        'koaRouter',
        'koaStatic',
        'koaViews',
        'koaBody',
        'sequelize'
    ]
    
    handleOptions(answers)

    function handleOptions(answers){
        answers.middleware = middlewareMap.reduce((result,key)=>{
            result[key] = answers.middleware.includes(key)
            return result
        },{})
    }
    return answers
}