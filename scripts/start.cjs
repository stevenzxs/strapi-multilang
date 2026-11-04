const required = [
  'DATABASE_HOST', 'DATABASE_NAME', 'DATABASE_USERNAME', 'DATABASE_PASSWORD',
  'APP_KEYS', 'ADMIN_JWT_SECRET', 'API_TOKEN_SALT', 'TRANSFER_TOKEN_SALT',
  'ENCRYPTION_KEY', 'JWT_SECRET',
];
const missing = required.filter((key) => !process.env[key]?.trim());
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}
require('@strapi/strapi').createStrapi().start().catch((error) => {
  console.error(error);
  process.exit(1);
});
