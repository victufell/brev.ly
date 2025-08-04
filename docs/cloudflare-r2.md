# Cloudflare R2

## Motivação

O Cloudflare R2 foi escolhido como solução de armazenamento para arquivos CSV devido ao seu custo-benefício superior, performance global e integração nativa com a infraestrutura da Cloudflare, eliminando custos de egress.

## Benefícios

### 1. Custo-Benefício Superior
- **Zero egress fees**: Sem custos de transferência de dados
- **Preços competitivos**: Mais barato que AWS S3
- **Sem taxas de requisição**: Sem cobrança por operações
- **Storage pricing**: Preços atrativos para armazenamento

### 2. Performance Global
- **Edge network**: Rede global de 200+ data centers
- **Low latency**: Baixa latência em qualquer região
- **CDN integration**: Integração nativa com CDN
- **Automatic scaling**: Escalabilidade automática

### 3. Compatibilidade S3
- **S3 API**: Compatível com APIs da AWS S3
- **Easy migration**: Migração simples de S3
- **Familiar tools**: Ferramentas familiares para desenvolvedores
- **SDK support**: Suporte a SDKs existentes

### 4. Segurança e Confiabilidade
- **DDoS protection**: Proteção automática contra DDoS
- **SSL/TLS**: Criptografia em trânsito
- **Access control**: Controle de acesso granular
- **99.9% uptime**: Alta disponibilidade

## Configuração no Projeto

```typescript
// StorageService.ts
const client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
});
```

## Exemplos de Uso

### Upload de Arquivo CSV
```typescript
static async uploadCsv(filename: string, content: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_BUCKET!,
    Key: filename,
    Body: content,
    ContentType: 'text/csv',
    ACL: 'public-read',
  });

  await client.send(command);
  
  return `${process.env.CLOUDFLARE_PUBLIC_URL}/${filename}`;
}
```

### Geração de URL Assinada
```typescript
static async generateUploadUrl(filename: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_BUCKET!,
    Key: filename,
    ContentType: 'text/csv',
    ACL: 'public-read',
  });

  return await getSignedUrl(client, command, { expiresIn: 3600 });
}
```

## Estrutura de Arquivos

### Organização de Buckets
```
brevly-csv-exports/
├── 2024/
│   ├── 01/
│   │   ├── urls-export-2024-01-15-abc123.csv
│   │   └── urls-export-2024-01-20-def456.csv
│   └── 02/
│       └── urls-export-2024-02-01-ghi789.csv
└── archive/
    └── old-exports/
```

### Nomenclatura de Arquivos
```typescript
static generateUniqueFilename(): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `urls-export-${timestamp}-${randomSuffix}.csv`;
}
```

## Configuração de Ambiente

### Variáveis de Ambiente
```env
CLOUDFLARE_ACCOUNT_ID="your-account-id"
CLOUDFLARE_ACCESS_KEY_ID="your-access-key"
CLOUDFLARE_SECRET_ACCESS_KEY="your-secret-key"
CLOUDFLARE_BUCKET="brevly-csv-exports"
CLOUDFLARE_PUBLIC_URL="https://pub-1234567890.r2.dev"
```

### Políticas de Bucket
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::brevly-csv-exports/*"
    }
  ]
}
```

## Monitoramento e Analytics

### 1. Métricas Disponíveis
- **Request count**: Número de requisições
- **Data transfer**: Volume de dados transferidos
- **Error rates**: Taxa de erros
- **Latency**: Latência de resposta

### 2. Logs
- **Access logs**: Logs de acesso aos arquivos
- **Error logs**: Logs de erros
- **Performance logs**: Logs de performance

## Segurança

### 1. Autenticação
- **API tokens**: Tokens de API seguros
- **Access keys**: Chaves de acesso temporárias
- **Role-based access**: Controle de acesso por roles

### 2. Criptografia
- **Encryption at rest**: Criptografia em repouso
- **Encryption in transit**: Criptografia em trânsito
- **Customer-managed keys**: Chaves gerenciadas pelo cliente

## Comparação de Custos

### AWS S3 vs Cloudflare R2 (por mês)
- **Storage (1TB)**: S3: $23, R2: $15
- **Egress (100GB)**: S3: $9, R2: $0
- **Requests (1M)**: S3: $5, R2: $0
- **Total**: S3: $37, R2: $15

## Considerações

- **Region limitations**: Menos regiões que AWS
- **Feature parity**: Algumas features S3 não disponíveis
- **Vendor lock-in**: Dependência da Cloudflare

## Alternativas Consideradas

- **AWS S3**: Mais popular, mas mais caro
- **Google Cloud Storage**: Bom, mas sem zero egress
- **Azure Blob Storage**: Similar ao S3
- **DigitalOcean Spaces**: Mais simples, menos features 