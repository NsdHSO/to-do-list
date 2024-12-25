const fastify = require('fastify')
const fs = require('fs/promises')
const serverOptions = {
    logger: {
        level: 'debug',
        transports: {
            target: 'pino-pretty'
        }
    },
    exposeHeadRoutes: false
}
const app = fastify(serverOptions)

app.listen(
    {
        port: 8080,
        host: '0.0.0.0',
    }
).then((address) => {
    console.log(`Server started at ${address}`)
}).catch((err) => {
    console.log(err)
})

app.addHook('onRoute', buildHook('root'))

app.register(async function pluginOne(pluginInstance, opts) {
    pluginInstance.addHook('onRoute', buildHook('Plugin One'))
    pluginInstance.get('/one', async (req, res) => {
        res.send("plugin One")
    })

    pluginInstance.register(async (pluginSecondInstance) => {
        pluginSecondInstance.addHook('onRoute', buildHook('Plugin One inside'))
        pluginSecondInstance.get('/one/inside', async (req, res) => {
            res.send("plugin One inside")
        })
    })
})

app.register(async function pluginTwo(pluginInstance, opts) {
    pluginInstance.addHook('onRoute', buildHook('Plugin Two'))
    pluginInstance.get('/two', async (req, res) => {
        res.send("plugin Two")
    })
    pluginInstance.register(async function pluginThree(subPluginInstance, opts) {
        subPluginInstance.addHook('onRoute', buildHook('Plugin Three'))
        subPluginInstance.get('/three', async (req, res) => {
            res.send("plugin Three")
        })
    })
})


function buildHook(id) {
    return function hook(routeOptions) {
        console.log(`${id} hook called for route: ${routeOptions.method} ${routeOptions.url}`);
    }
}