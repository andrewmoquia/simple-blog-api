import mongoose from 'mongoose';

export class Database {
   private mongoURI;

   constructor() {
      this.mongoURI = process.env.MONGO_URI;
   }

   public connect() {
      //
      //IIFE =  a JavaScript function that runs as soon as it is defined.
      (async () => {
         try {
            const db = await mongoose.connect(`${this.mongoURI}`);
            return db
               ? console.log(`Database '${db.connection.name}' is connected.`)
               : console.log('Failed to connect.'); //TO-DO: Handle error try to reconnect
         } catch (err) {
            //
            //TO-DO: Handle error try to reconnect
            return console.log(err);
         }
      })();
   }
}
