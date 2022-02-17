import { App } from './services/app';
import dotenv from 'dotenv';

//Loads environment variables from a ".env" file into "process.env".
dotenv.config();

//Create express app.
const app = new App();

//Start the app.
app.start();
