const {exec} = require('child_process')

module.exports = (command)=>{
    return new Promise((resolve,reject)=>{
        exec(command,(err,data)=>{
            resolve(true)
            reject(err)
        })
    })
}