import type { FileExtension } from 'shared/schema';

type FileHandler = {
  mimeType: string;
  cacheTTL: string;
  compress: 'gzip' | undefined;
  type: 'text' | 'byte';
};

export const handler: Record<FileExtension, FileHandler> = {
  html: {
    mimeType: 'text/html',
    cacheTTL: 'public, no-cache',
    compress: 'gzip',
    type: 'text',
  },
  css: {
    mimeType: 'text/css',
    cacheTTL: 'public, max-age=15552000',
    compress: 'gzip',
    type: 'text',
  },
  js: {
    mimeType: 'text/javascript',
    cacheTTL: 'public, max-age=15552000',
    compress: 'gzip',
    type: 'text',
  },
  svg: {
    mimeType: 'image/svg+xml',
    cacheTTL: 'public, max-age=15552000',
    compress: 'gzip',
    type: 'text',
  },
  webp: {
    mimeType: 'image/webp',
    cacheTTL: 'public, max-age=15552000',
    compress: undefined,
    type: 'byte',
  },
  png: {
    mimeType: 'image/png',
    cacheTTL: 'public, max-age=15552000',
    compress: undefined,
    type: 'byte',
  },
  jpg: {
    mimeType: 'image/jpeg',
    cacheTTL: 'public, max-age=15552000',
    compress: undefined,
    type: 'byte',
  },
  ico: {
    mimeType: 'image/x-icon',
    cacheTTL: 'public, max-age=15552000',
    compress: undefined,
    type: 'byte',
  },
  ttf: {
    mimeType: 'font/ttf',
    cacheTTL: 'public, max-age=15552000',
    compress: undefined,
    type: 'byte',
  },
  webmanifest: {
    mimeType: 'application/manifest+json',
    cacheTTL: 'public, max-age=15552000',
    compress: 'gzip',
    type: 'text',
  },
};
