import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Dashboard API',
      version: '1.0.0',
      description: 'API documentation for the Finance Data Processing Backend. \n\n**Test Accounts:** \n- admin / admin123 (Role: ADMIN)\n- analyst / analyst123 (Role: ANALYST)\n- viewer / viewer123 (Role: VIEWER)',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      '/api/auth/login': {
        post: {
          summary: 'Login to get JWT Token',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { type: 'object', properties: { username: { type: 'string', example: 'admin' }, password: { type: 'string', example: 'admin123' } } }
              }
            }
          },
          responses: { 200: { description: 'Success' } }
        }
      },
      '/api/records': {
        get: {
          summary: 'Get all records (Paginated & Filterable)',
          tags: ['Records'],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer' } },
            { name: 'type', in: 'query', schema: { type: 'string', enum: ['INCOME', 'EXPENSE'] } }
          ],
          responses: { 200: { description: 'Success' } }
        },
        post: {
          summary: 'Create a new record (Admin Only)',
          tags: ['Records'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    amount: { type: 'number', example: 500 },
                    type: { type: 'string', example: 'INCOME' },
                    category: { type: 'string', example: 'Bonus' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Created' } }
        }
      },
      '/api/dashboard/summary': {
        get: {
          summary: 'Get Dashboard Summary (Analyst/Admin Only)',
          tags: ['Dashboard'],
          responses: { 200: { description: 'Success' } }
        }
      }
    }
  },
  apis: [], // No need to scan files since we defined paths manually above
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
