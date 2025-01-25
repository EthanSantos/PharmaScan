const fastify = require('fastify')({ logger: true });

fastify.register(require('@fastify/cors'), {
  origin: ['http://localhost:5173'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

fastify.get('/hello', async (request, reply) => {
  return { message: 'Hello world!' };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server running at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
