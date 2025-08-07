import dotenv from 'dotenv';

dotenv.config();

// Helper function to ensure required environment variables
function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

export const config = {
  port: parseInt(process.env.PORT || '5000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    uri: requireEnv('MONGODB_URI', 'mongodb://localhost:27017/bagyesrush'),
    testUri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/bagyesrush_test',
  },
  
  jwt: {
    secret: requireEnv('JWT_SECRET', 'fallback_secret_key_for_development_only'),
    refreshSecret: requireEnv('JWT_REFRESH_SECRET', 'fallback_refresh_secret_key_for_development_only'),
    expire: process.env.JWT_EXPIRE || '7d',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
  },
  
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
  
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  },
} as const;

export const isProduction = config.nodeEnv === 'production';
export const isDevelopment = config.nodeEnv === 'development';