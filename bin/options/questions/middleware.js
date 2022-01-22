module.exports = () => ({
    type: "checkbox",
    message: "请选择要集成中间件:",
    name: "middleware",
    choices: [
        { name: "koaRouter" },
        { name: "koaStatic" },
        { name: "koaViews" },
        { name: "koaBody" },
        { name: "sequelize" }
    ],
})