import express, { Application } from 'express';
import { Server } from './src/server';

const app: Application = express();
const server = new Server(app);
const PORT: number = 3001;

app
  .listen(PORT, 'localhost', () => {
    console.log(`Server is running on port ${PORT}.`);
    server.startPolling();
  })
  .on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log('Error: address already in use');
    } else {
      console.log(err);
    }
  });
