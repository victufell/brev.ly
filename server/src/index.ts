import Fastify from 'fastify';
import { config } from 'dotenv';
import { validateEnv } from './utils/env-validation.js';
import { Container } from './container/container.js';
import { registerSecurityMiddleware } from './middlewares/security.middleware.js';
import { registerGlobalRateLimit, registerUrlCreationRateLimit } from './middlewares/rate-limit.middleware.js';
import { registerCorsMiddleware } from './middlewares/cors.middleware.js';
import { registerSwagger } from './config/swagger.config.js';
import { errorHandler } from './errors/error-handler.js';
import { urlRoutes } from './routes/url.routes.js';
import { redirectRoutes } from './routes/redirect.routes.js';
import { healthRoutes } from './routes/health.routes.js';

config();
const env = validateEnv();

const container = Container.getInstance();
container.setupDependencies();

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

async function bootstrap() {
  try {
    await registerSecurityMiddleware(fastify);
    await registerGlobalRateLimit(fastify);
    await registerUrlCreationRateLimit(fastify);
    await registerSwagger(fastify);
    await registerCorsMiddleware(fastify);

    await fastify.register(redirectRoutes);
    await fastify.register(urlRoutes, { prefix: '/api' });
    await fastify.register(healthRoutes);

    fastify.setErrorHandler(errorHandler);

    const port = parseInt(process.env.PORT || '3333');
    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
    
    await fastify.listen({ port, host });
    
    console.log(`🚀 Servidor rodando em http://${host}:${port}`);
    console.log(`📊 Health check: http://${host}:${port}/health`);
    console.log(`🔗 API: http://${host}:${port}/api`);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`📚 Documentação: http://${host}:${port}/docs`);
    }
    
    console.log(`↩️  Redirecionamento: http://${host}:${port}/SHORTURL`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

bootstrap();