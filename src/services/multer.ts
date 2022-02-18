import multer from 'multer';
import path from 'path';

export class Multer {
   public multerConfig = multer({
      //
      //Where to store the file.
      storage: multer.diskStorage({}),
      //
      //Filter file.
      fileFilter: (req, file, cb) => {
         //
         //Get extension name.
         const ext = path.extname(file.originalname);
         //
         //Make sure that the uploaded files is image.
         return ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png'
            ? cb(new Error())
            : cb(null, true);
      },
      limits: {
         fieldSize: 20000000,
      },
   }).array('images', 5); //Upload a maximum of 10 pictures per upload.
}
