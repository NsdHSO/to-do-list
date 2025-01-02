const Fastify = require('fastify');
const userRouter = require('./routes/users-router.cjs');
const fp = require('fastify-plugin');

async function boot() {

    const app = Fastify({
        logger: {
            level: 'debug', transports: {
                target: 'pino-pretty'
            }
        }
    });
    app.decorate('users', [{name: 'sam', age: 23}, {name: 'sam', age: 23}, {name: 'Ian', age: 27}, {
        name: 'And',
        age: 22
    }]);

    function options(parent) {
        return ({
            prefix: parent.version_prefix, myPlugin: {
                firstElement: parent.mySpecialProp
            }
        });
    }

    app.addHook('onRequest', (request, reply, done) => {
        if (request.headers['x-is-admin'] === 'true') {
            done();
        } else {
            let err = new Error('Not logged in');
            err.status = 404;
            done(err);
        }
    });
    ;

    app.register((fastify, options) => {
        fastify.get('/private', (request, reply) => {
            reply.send('private');
        });
    }, options);

    await app.ready();

    await app.listen({
        port: 8080, host: '0.0.0.0'
    }).then((_) => {
        app.log.info('server started');
        console.log(app.printRoutes());
    });
}

boot();