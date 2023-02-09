// service
const PROTOCOL = 'https';
const HOST = 'localhost';
const PORT = '443';

// database
const DB_HOST = 'localhost';
const DB_USER = 'root';
const DB_PASSWORD = '123456';
const DB_DATABASE = 'personal-blog';

const PROJECT_CONFIG = {
  PROTOCOL,
  HOST,
  PORT,
  CLIENT_BASE_URL: `${ PROTOCOL ? PROTOCOL + '://' : '' }${ HOST }${ PORT ? ':' + PORT : '' }`,
};

export const DB_CONFIG = {
  HOST: DB_HOST,
  USER: DB_USER,
  PASSWORD: DB_PASSWORD,
  DATABASE: DB_DATABASE,
};

export const REQUEST_DEFAULT_ERROR_MESSAGE = '未知异常'

// dir
export const AVATARS_DIR = '/avatars';

export default PROJECT_CONFIG;
