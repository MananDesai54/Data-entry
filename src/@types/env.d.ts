declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    DATABASE_URL: string;
    PORT: any;
    PUBLIC_VAPID_KEYS: string;
    PRIVATE_VAPID_KEYS: string;
  }
}
