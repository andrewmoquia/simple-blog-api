import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

export class Express {
   private app;
   private port;
   private origin;
   private database;
   private cookieSecret;

   constructor() {
      this.app = express();
      this.port = process.env.PORT;
      this.origin = process.env.ORIGIN;
      this.database = process.env.DATABASE;
      this.cookieSecret = process.env.COOKIE_SECRET;
   }

   public connectToDatabase() {
      //
      //IIFE =  a JavaScript function that runs as soon as it is defined.
      (async () => {
         try {
            const db = await mongoose.connect(`${this.database}`);
            return db
               ? console.log(`Database '${db.connection.name}' is connected.`)
               : console.log('Failed to connect.');
         } catch (err) {
            console.log(err);
         }
      })();
   }

   public start() {
      //
      //Loads environment variables from a ".env" file into "process.env".
      dotenv.config();
      //
      //Connect to MongoDB
      this.connectToDatabase();
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
      //Recognize the incoming Request Object as a JSON Object
      this.app.use(express.json());
      //
      //Parse application/x-www-form-urlencoded, basically can only parse incoming Request Object if strings or arrays
      this.app.use(express.urlencoded({ extended: false }));
      //
      //Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
      this.app.use(cookieParser(this.cookieSecret));
      //
      //Add 11 layer of security
      //https://helmetjs.github.io/
      this.app.use(helmet());
      //
      //Initiate the server app
      this.app.listen(this.port, () => {
         console.log('Server is up.');
      });
   }
}
