export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'postgres'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'observatorio'),
      user: env('DATABASE_USERNAME', 'observatorio'),
      password: env('DATABASE_PASSWORD', 'observatorio'),
      ssl: false,
    },
    acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
  },
});