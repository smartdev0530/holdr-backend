declare namespace NodeJS {
  export interface ProcessEnv {
    NEST_ENVIRONMENT: 'development' | 'production' | 'staging' | 'test';
    DATABASE_URL: string;
    PORT: number;
    JWT_SECRET: string;
    JWT_TTL: number;
  }
}
