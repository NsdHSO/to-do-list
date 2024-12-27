module.exports = async function usersRouter(fastify, _){
    fastify.register(
        async function routes(child, _options){
            child.get('/', async (req, res) => {
                res.send(child.users)
            })
            child.post('/', async (req, res) => {
                const newUser = req.body
                child.users.push(newUser)
                res.send(newUser)
            })
        },
        {
            prefix: 'users',
        }
    )
}