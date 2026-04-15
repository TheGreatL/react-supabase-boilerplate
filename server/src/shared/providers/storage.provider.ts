import {config} from '../config';
import fs from 'fs/promises';
import {mkdirSync, existsSync} from 'fs';
import path from 'path';
import {createClient} from '@supabase/supabase-js';

/**
 * Gold Standard: Storage Provider Abstraction
 * This allows the application to switch between local development storage 
 * and production bucket storage (e.g., Supabase, S3) seamlessly.
 */
export interface IStorageProvider {
  upload(file: Express.Multer.File, folder?: string): Promise<string>;
  delete(fileUrl: string): Promise<void>;
  getSignedUrl(fileUrl: string): Promise<string>;
}

/**
 * Local Storage Provider (Development)
 * Stores files in the local filesystem under the configured UPLOAD_DIR.
 */
export class LocalStorageProvider implements IStorageProvider {
  private uploadRoot: string;

  constructor() {
    // Relative to the server root (src is in /src, so we go up to /)
    this.uploadRoot = path.resolve(process.cwd(), config.UPLOAD_DIR);
    this.ensureDirExists();
  }

  private ensureDirExists() {
    if (!existsSync(this.uploadRoot)) {
      mkdirSync(this.uploadRoot, {recursive: true});
    }
  }

  async upload(file: Express.Multer.File, folder: string = ''): Promise<string> {
    const targetDir = path.join(this.uploadRoot, folder);
    await fs.mkdir(targetDir, {recursive: true});

    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    const filePath = path.join(targetDir, fileName);

    await fs.writeFile(filePath, file.buffer);

    // Return a path that can be served or mapped to a public URL
    // In production, this would be a URL; in dev, it's a relative path
    return path.join(folder, fileName).replace(/\\/g, '/');
  }

  async delete(fileUrl: string): Promise<void> {
    const filePath = path.join(this.uploadRoot, fileUrl);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete local file: ${filePath}`, error);
    }
  }

  async getSignedUrl(fileUrl: string): Promise<string> {
    // For local dev, we just return the served path if express.static is configured
    await Promise.resolve();
    return `/${config.UPLOAD_DIR}/${fileUrl}`;
  }
}

/**
 * Supabase Storage Provider (Production Ready Placeholder)
 */
export class SupabaseStorageProvider implements IStorageProvider {
  private client;
  private bucket: string;

  constructor() {
    if (!config.SUPABASE_URL || !config.SUPABASE_SERVICE_ROLE_KEY || !config.STORAGE_BUCKET_NAME) {
      throw new Error('Supabase Storage configuration missing');
    }
    this.client = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY);
    this.bucket = config.STORAGE_BUCKET_NAME;
  }

  async upload(file: Express.Multer.File, folder: string = ''): Promise<string> {
    const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;

    const {data, error} = await this.client.storage
      .from(this.bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) throw error;
    return data.path;
  }

  async delete(fileUrl: string): Promise<void> {
    const {error} = await this.client.storage.from(this.bucket).remove([fileUrl]);
    if (error) throw error;
  }

  async getSignedUrl(fileUrl: string): Promise<string> {
    const {data, error} = await this.client.storage
      .from(this.bucket)
      .createSignedUrl(fileUrl, 3600); // 1 hour

    if (error) throw error;
    return data.signedUrl;
  }
}

/**
 * Storage Service Factory
 * Injects the correct provider based on the environment.
 */
let storageProvider: IStorageProvider;

export const getStorageProvider = (): IStorageProvider => {
  if (!storageProvider) {
    if (config.NODE_ENV === 'production' && config.SUPABASE_URL) {
      storageProvider = new SupabaseStorageProvider();
    } else {
      storageProvider = new LocalStorageProvider();
    }
  }
  return storageProvider;
};
