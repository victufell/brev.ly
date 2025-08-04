export const urlSchemas = {
  createUrl: {
    tags: ['URLs'],
    summary: 'Criar URL encurtada',
    description: 'Cria uma nova URL encurtada a partir de uma URL original',
    body: {
      type: 'object',
      properties: {
        originalUrl: {
          type: 'string',
          format: 'uri',
          description: 'URL original que será encurtada'
        },
        shortUrl: {
          type: 'string',
          description: 'URL encurtada personalizada (opcional, mínimo 3 caracteres)'
        }
      },
      required: ['originalUrl'],
      additionalProperties: false
    },
    response: {
      201: {
        type: 'object',
        description: 'URL encurtada criada com sucesso',
        properties: {
          url: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', description: 'ID único da URL' },
              originalUrl: { type: 'string', format: 'uri', description: 'URL original' },
              shortUrl: { type: 'string', description: 'URL encurtada' },
              accessCount: { type: 'number', description: 'Número de acessos' },
              createdAt: { type: 'string', format: 'date-time', description: 'Data de criação' },
              updatedAt: { type: 'string', format: 'date-time', description: 'Data de atualização' },
            },
          },
          message: { type: 'string', description: 'Mensagem de sucesso' },
        },
      },
      400: {
        type: 'object',
        description: 'Erro de validação',
        properties: {
          error: { type: 'string', description: 'Mensagem de erro' },
        },
      },
    },
  },

  getUrl: {
    tags: ['URLs'],
    summary: 'Obter informações da URL',
    description: 'Retorna informações detalhadas sobre uma URL encurtada',
    params: {
      type: 'object',
      properties: {
        shortUrl: { type: 'string', description: 'URL encurtada' },
      },
      required: ['shortUrl'],
    },
    response: {
      200: {
        type: 'object',
        description: 'Informações da URL encurtada',
        properties: {
          url: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', description: 'ID único da URL' },
              originalUrl: { type: 'string', format: 'uri', description: 'URL original' },
              shortUrl: { type: 'string', description: 'URL encurtada' },
              accessCount: { type: 'number', description: 'Número de acessos' },
              createdAt: { type: 'string', format: 'date-time', description: 'Data de criação' },
              updatedAt: { type: 'string', format: 'date-time', description: 'Data de atualização' },
            },
          },
        },
      },
      404: {
        type: 'object',
        description: 'URL encurtada não encontrada',
        properties: {
          error: { type: 'string', description: 'Mensagem de erro' },
        },
      },
    },
  },

  deleteUrl: {
    tags: ['URLs'],
    summary: 'Deletar URL',
    description: 'Remove uma URL encurtada do sistema',
    params: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', description: 'ID da URL' },
      },
      required: ['id'],
    },
    response: {
      204: {
        description: 'URL deletada com sucesso',
      },
      404: {
        type: 'object',
        description: 'URL não encontrada',
        properties: {
          error: { type: 'string', description: 'Mensagem de erro' },
        },
      },
    },
  },

  listUrls: {
    tags: ['URLs'],
    summary: 'Listar URLs',
    description: 'Retorna uma lista paginada de todas as URLs encurtadas',
    querystring: {
      type: 'object',
      properties: {
        page: { 
          type: 'string', 
          pattern: '^[0-9]+$',
          description: 'Número da página (padrão: 1)',
          default: '1'
        },
        limit: { 
          type: 'string', 
          pattern: '^[0-9]+$',
          description: 'Número de itens por página (padrão: 10, máximo: 100)',
          default: '10'
        },
      },
    },
    response: {
      200: {
        type: 'object',
        description: 'Lista paginada de URLs',
        properties: {
          urls: {
            type: 'array',
            description: 'Array de URLs encurtadas',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid', description: 'ID único da URL' },
                originalUrl: { type: 'string', format: 'uri', description: 'URL original' },
                shortUrl: { type: 'string', description: 'URL encurtada' },
                accessCount: { type: 'number', description: 'Número de acessos' },
                createdAt: { type: 'string', format: 'date-time', description: 'Data de criação' },
                updatedAt: { type: 'string', format: 'date-time', description: 'Data de atualização' },
              },
            },
          },
          total: { type: 'number', description: 'Total de URLs no sistema' },
        },
      },
    },
  },

  exportCsv: {
    tags: ['URLs'],
    summary: 'Exportar URLs para CSV',
    description: 'Gera e retorna um link para download de arquivo CSV com todas as URLs',
    response: {
      200: {
        type: 'object',
        description: 'Link para download do CSV',
        properties: {
          message: { type: 'string', description: 'Mensagem de sucesso' },
          url: { type: 'string', format: 'uri', description: 'URL para download do arquivo CSV' },
          filename: { type: 'string', description: 'Nome do arquivo CSV gerado' },
        },
      },
      500: {
        type: 'object',
        description: 'Erro interno do servidor',
        properties: {
          error: { type: 'string', description: 'Mensagem de erro' },
        },
      },
    },
  },

  redirect: {
    tags: ['Redirect'],
    summary: 'Redirecionar para URL original',
    description: 'Redireciona para a URL original e incrementa o contador de acessos',
    params: {
      type: 'object',
      properties: {
        shortUrl: { type: 'string', description: 'URL encurtada' },
      },
      required: ['shortUrl'],
    },
    response: {
      302: {
        description: 'Redirecionamento para URL original',
      },
      404: {
        type: 'object',
        description: 'URL encurtada não encontrada',
        properties: {
          error: { type: 'string', description: 'Mensagem de erro' },
        },
      },
    },
  },
};
