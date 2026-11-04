module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME'),
      user: env('DATABASE_USERNAME'),
      password: env('DATABASE_PASSWORD'),
      ssl: env.bool('DATABASE_SSL', false)
        ? { rejectUnauthorized: true, ca: env('DATABASE_SSL_CA', undefined) }
        : false,
    },
    pool: { min: 0, max: env.int('DATABASE_POOL_MAX', 5) },
    acquireConnectionTimeout: 60000,
  },
});
