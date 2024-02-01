import * as dotenv from 'dotenv';
import * as process from 'process';
dotenv.config();

interface IEnvironment {
  MYSQL: {
    HOST: string;
    USERNAME: string;
    PASSWORD: string;
    DATABASE: string;
  };
  APP: {
    NAME: string;
    PORT: number | string;
    ENV: string;
    EMAIL: string;
    BASE_URL: string;
  };
  JWT: {
    SECRET: string;
  };
  EMAIL: {
    SERVICE: string;
    USERNAME: string;
    PASSWORD: string;
  };
  DB: {
    URL: string;
  };
  DOS: {
    KEY_ID: string;
    SECRET: string;
    BUCKET_NAME: string;
    SPACE_LINK: string;
  };
  FIREBASE: {
    PROJECT_ID: string;
    PRIVATE_KEY: string;
    CLIENT_EMAIL: string;
  };
}

export const environment: IEnvironment = {
  MYSQL: {
    HOST: process.env.HOST,
    USERNAME: process.env.USERNAME,
    PASSWORD: process.env.PASSWORD,
    DATABASE: process.env.DATABASE,
  },
  APP: {
    NAME: process.env.APP_NAME,
    PORT: process.env.PORT,
    ENV: process.env.APP_ENV,
    EMAIL: process.env.EMAIL,
    BASE_URL: process.env.APP_BASE_URL,
  },
  JWT: {
    SECRET: process.env.JWT_SECRET,
  },
  EMAIL: {
    SERVICE: process.env.EMAIL_SERVICE,
    USERNAME: process.env.EMAIL_USERNAME,
    PASSWORD: process.env.EMAIL_PASSWORD,
  },
  DB: {
    URL: process.env.DATABASE_URL || process.env.DB_URL,
  },
  DOS: {
    KEY_ID: process.env.DOS_SPACES_KEYID,
    SECRET: process.env.DOS_SPACES_SECRET,
    BUCKET_NAME: process.env.DOS_BUCKET_NAME,
    SPACE_LINK: process.env.DOS_SPACE_LINK,
  },
  FIREBASE: {
    PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  },
};
