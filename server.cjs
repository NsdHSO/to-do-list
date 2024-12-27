const Fastify = require('fastify')
const userRouter = require('./routes/users-router.cjs')

function options(parent) {
    return ({
        prefix: 'V1',
        myPlugin: {
            first: parent.mySpecialProp
        }
    })
}


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

app.register(userRouter, {prefix: 'v1'})
app.decorate('mySpecialProp', 'root prop')
app.register(async function userRouterV2(fastify, options) {
    fastify.delete('/users/:name', (request, reply) => {
        const userFind = fastify.users.findIndex(user => user.name === request.params.name)
        fastify.users.splice(userFind, 1)
        reply.send(fastify.users)
    })
},
    {prefix:'v2'}
)
app.register(async function (fastify, options) {
        app.log.error(options.myPlugin.first)
    }, options
)

app.listen({
    port: 8080,
    host: '0.0.0.0',
}).then((_) => {
    app.log.info('server started')
    console.log(app.printRoutes())
})