const Fastify = require('fastify')
const userRouter = require('./routes/users-router.cjs')
const fp = require('fastify-plugin')

async function boot() {

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

    function options(parent) {
        return ({
            prefix: parent.version_prefix,
            myPlugin: {
                firstElement: parent.mySpecialProp,
            }
        })
    }

    app.addHook('onRequest', (request, reply, done) => {
        request.log.info('request received I a 404 HTTP request...')
        request.is404;

        done()
    })
    app.register((instance, opts) => {
        instance.setNotFoundHandler((err, reply) => {
            reply.send('Not found').status(404)

        })
    }, {prefix: '/iancu'})
    app.register
    await app.ready()

    await app.listen({
        port: 8080,
        host: '0.0.0.0',
    }).then((_) => {
        app.log.info('server started')
        console.log(app.printRoutes())
    })
}

boot()