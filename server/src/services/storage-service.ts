import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from 'dotenv';

config();

export class StorageService {
  private static client: S3Client;

  private static getClient(): S3Client {
    if (!this.client) {
      this.client = new S3Client({
        region: 'auto',
        endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
          secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
        },
      });
    }
    return this.client;
  }

  static async uploadCsv(filename: string, content: string): Promise<string> {
    const client = this.getClient();
    
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

  static async generateUploadUrl(filename: string): Promise<string> {
    const client = this.getClient();
    
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET!,
      Key: filename,
      ContentType: 'text/csv',
      ACL: 'public-read',
    });

    return await getSignedUrl(client, command, { expiresIn: 3600 });
  }
} 