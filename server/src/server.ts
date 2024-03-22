import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { Routes } from './routes';

export class Server {
  constructor(app: Application) {
    this.middlewares(app);
    new Routes(app);
  }

  private middlewares(app: Application) {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(express.json());
    app.use(cors());
  }
}
