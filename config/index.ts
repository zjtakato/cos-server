import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 3010,
  dest: process.env.DEST || 'static',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  get domain() {
    return process.env.DOMAIN || `http://localhost:${this.port}`;
  },
};

export default config;
