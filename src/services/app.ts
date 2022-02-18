import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import cookieParser from 'cookie-parser';
import { Database } from './database';
import { BlogRouter } from '../router';

export class App {
   private app;
   private port;
   private origin;
   private database;
   private cookieSecret;

   constructor() {
      this.app = express();
      this.port = process.env.PORT || 5000;
      this.origin = process.env.ORIGIN || 'http://localhost:5000';
      this.database = new Database();
      this.cookieSecret = process.env.COOKIE_SECRET || 'secret';
   }

   public start() {
      //
      //Connect to MongoDB.
      this.database.connect();
      //
      //Allow test in localhost:3000.
      this.app.set('trust proxy', 1);
      //
      //Site that allow to make request in API.
      this.app.use(
         cors({
            origin: this.origin,
            credentials: true,
         })
      );
      //
      //Recognize the incoming Request Object as a JSON Object.
      this.app.use(express.json());
      //
      //Parse application/form-data.
      this.app.use(express.urlencoded({ extended: false }));
      //
      //Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
      this.app.use(cookieParser(this.cookieSecret));
      //
      //Add 11 layer of security.
      //https://helmetjs.github.io/
      this.app.use(helmet());
      //
      //Handle routes for blog requests.
      this.app.use(BlogRouter);
      //
      //Initiate the server app.
      this.app.listen(this.port, () => {
         console.log('Server is up.');
      });
   }
}
