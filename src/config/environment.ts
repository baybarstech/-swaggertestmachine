import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const config = {
  apiHost: process.env.API_HOST || 'http://localhost:3000',
  swaggerPath: process.env.SWAGGER_PATH || '/api/docs-json',
  baseApiUrl: process.env.BASE_API_URL || 'http://localhost:3000',
  
  // Get full URL for swagger documentation
  get swaggerUrl() {
    return `${this.apiHost}${this.swaggerPath}`;
  }
};