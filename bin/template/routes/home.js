const router = require('koa-router')({
    prefix:'/api/home'
})

router.get('/',ctx=>{
    ctx.body = 'Hello welcome Home!!!'
})

module.exports = router