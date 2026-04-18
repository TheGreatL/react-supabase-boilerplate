import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {LocalStorageProvider} from '../../../src/shared/providers/storage.provider';
import fs from 'fs/promises';
import path from 'path';

// Mock the config to use a test upload directory
vi.mock('../../../src/shared/config', () => ({
  config: {
    UPLOAD_DIR: 'test-uploads',
    NODE_ENV: 'test'
  }
}));

describe('LocalStorageProvider', () => {
  let provider: LocalStorageProvider;
  const testUploadRoot = path.resolve(process.cwd(), 'test-uploads');

  beforeEach(async () => {
    provider = new LocalStorageProvider();
    // Ensure clean state before each test
    try {
      await fs.rm(testUploadRoot, {recursive: true, force: true});
    } catch {
      // ignore
    }
  });

  afterEach(async () => {
    // Cleanup after tests
    try {
      await fs.rm(testUploadRoot, {recursive: true, force: true});
    } catch {
      // ignore
    }
  });

  it('should create the upload directory if it does not exist', async () => {
    // Constructor calls ensureDirExists
    new LocalStorageProvider();
    const exists = await fs
      .access(testUploadRoot)
      .then(() => true)
      .catch(() => false);
    expect(exists).toBe(true);
  });

  it('should upload a file and return the relative path', async () => {
    const mockFile = {
      originalname: 'test image.png',
      buffer: Buffer.from('fake-image-content'),
      mimetype: 'image/png'
    } as Express.Multer.File;

    const resultPath = await provider.upload(mockFile, 'avatars');

    expect(resultPath).toContain('avatars/');
    expect(resultPath).toContain('test-image.png');

    const fullPath = path.join(testUploadRoot, resultPath);
    const content = await fs.readFile(fullPath, 'utf-8');
    expect(content).toBe('fake-image-content');
  });

  it('should delete an uploaded file', async () => {
    const mockFile = {
      originalname: 'delete-me.txt',
      buffer: Buffer.from('delete-me'),
      mimetype: 'text/plain'
    } as Express.Multer.File;

    const resultPath = await provider.upload(mockFile);
    const fullPath = path.join(testUploadRoot, resultPath);

    await provider.delete(resultPath);

    const exists = await fs
      .access(fullPath)
      .then(() => true)
      .catch(() => false);
    expect(exists).toBe(false);
  });

  it('should return a correctly formatted public URL in dev/test', async () => {
    const url = await provider.getSignedUrl('folder/file.png');
    expect(url).toBe('/test-uploads/folder/file.png');
  });
});
