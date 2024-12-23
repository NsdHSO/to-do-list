const fastify = require('fastify')

const serverOptions = {
    logger: true
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

app.addHook('onClose', (done) => {
    console.log(`Server closed at ${JSON.stringify(done)}`)
    done(new Error('Server closed'))
})

app.get('/iancu', (req, res) => {
    console.log(req.query)
    return res.send('Welcome to iancu!')
})

app.addHook('onReady', async () => {
    console.log('Async is on ready!')
})