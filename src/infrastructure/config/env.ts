import { cleanEnv, str, port } from 'envalid';

export const validateEnv = () => {
  return cleanEnv(process.env, {
    DATABASE_URL: str({
      desc: 'PostgreSQL connection string',
      example: 'postgresql://user:password@localhost:5432/database',
    }),
    PORT: port({
      default: 3000,
      desc: 'Port sur lequel le serveur écoute',
    }),
    NODE_ENV: str({
      choices: ['development', 'production', 'test'],
      default: 'development',
      desc: 'Environnement d\'exécution',
    }),
  });
};
