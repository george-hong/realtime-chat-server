import mysql from 'mysql';
import type { Connection } from 'mysql';
import { DB_CONFIG } from './config';

class DataBase {
  private connection: Connection | null;

  constructor() {
    this.connection = mysql.createConnection({
      host: DB_CONFIG.HOST,
      user: DB_CONFIG.USER,
      password: DB_CONFIG.PASSWORD,
      database: DB_CONFIG.DATABASE,
    });
    this.connection?.connect();
  }

  public query<T>(sqlSentence: string) {
    if (!this.connection) return Promise.reject('The connect had been disposed.');
    else return new Promise<T>((resolve, reject) => {
      this.connection?.query(sqlSentence, (error, result: T, fields) => {
        if (error) return reject(error);
        resolve(result as T);
      });
    });
  }

  public dispose(): void {
    if (this.connection) {
      this.connection.end();
      this.connection = null;
    }
  }
}

export default DataBase;
