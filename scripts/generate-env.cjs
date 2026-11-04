const fs = require('node:fs');
const { randomBytes } = require('node:crypto');
const secret = () => randomBytes(32).toString('hex');
const settings = {
  PUBLIC_URL: 'http://localhost:1337',
  TRUST_PROXY: 'false',
  DATABASE_HOST: 'postgres',
  DATABASE_PORT: '5432',
  DATABASE_NAME: 'strapi',
  DATABASE_USERNAME: 'strapi',
  DATABASE_PASSWORD: secret(),
  APP_KEYS: Array.from({ length: 4 }, secret).join(','),
};
for (const name of ['ADMIN_JWT_SECRET', 'API_TOKEN_SALT', 'TRANSFER_TOKEN_SALT', 'ENCRYPTION_KEY', 'JWT_SECRET']) {
  settings[name] = secret();
}
fs.writeFileSync('.env', Object.entries(settings).map(([k, v]) => `${k}=${v}\n`).join(''), {
  flag: 'wx', mode: 0o600,
});
console.log('Created .env with unique secrets. Review PUBLIC_URL and database settings. Never commit this file.');
