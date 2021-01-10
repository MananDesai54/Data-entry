declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    DATABASE_URL: string;
    PORT: any;
  }
}
