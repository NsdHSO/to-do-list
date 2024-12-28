const Fastify = require('fastify')
const userRouter = require('./routes/users-router.cjs')

const app = Fastify({
    logger: {
        level: 'debug',
        transports: {
            target: 'pino-pretty'
        }
    },
})
app.decorate('users',
    [
        {name: 'sam', age: 23},
        {name: 'sam', age: 23},
        {name: 'Ian', age: 27},
        {name: 'And', age: 22},
    ])
 function options (parent){
    return ({
        prefix: 'V1',
        myPlugin: {
            firstElement: parent.mySpecialProp,
        }
    })
}
app.register(userRouter, {prefix: 'v1'})
app.decorate('mySpecialProp', 'pino-pretty')
app.register(async function userRouterV2(fastify, options) {
    fastify.delete('/users/:name', (request, reply) => {
        const userFind = fastify.users.findIndex(user => user.name === request.params.name)
        fastify.users.splice(userFind, 1)
        reply.send(fastify.users)
    })
},
    {prefix:'v2'}
)
app.register(async function logConsole(fastify, options) {
    console.log(options.myPlugin.firstElement)
}, options)
app.listen({
    port: 8080,
    host: '0.0.0.0',
}).then((_) => {
    app.log.info('server started')
    console.log(app.printRoutes())
})