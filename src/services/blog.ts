import { Router, RequestHandler } from 'express';
import { BlogModel } from '../model';
import multer from 'multer';
import { Multer } from './multer';

const createMulter = new Multer();
const cloudinary = require('cloudinary').v2;

//Not in .env for testing purposes.
cloudinary.config({
   cloud_name: 'dbnjbrq14',
   api_key: '384214729692999',
   api_secret: 'gFyS-jSSu5IgYhXi41JH3s_MG4s',
});

export class Blog {
   public router;

   constructor() {
      this.router = Router();
   }

   //Middllware to allowed us to upload file in form-data.
   public uploadFile: RequestHandler = (req: any, res: any, next: any) => {
      //
      //Error handling in Multer.
      createMulter.multerConfig(req, res, (err: any) => {
         return err instanceof multer.MulterError
            ? res.send(err)
            : err
            ? res.send({ message: 'File not support or something went wrong. Please try again.' })
            : next();
      });
   };

   //Handle uploading images in cloudinary.
   private uploadImagesToCloudinary(images: any) {
      //
      //Map each image in images and upload to cloudinary.
      const promise = images.map(async (image: any) => {
         return await cloudinary.uploader.upload(image.path, (err: any, res: any) => {
            return err ? res.send({ message: 'Upload image error.' }) : res;
         });
      });
      return Promise.all(promise);
   }

   //Handle of filtering sensitive data in image properties.
   public filterImageSensitiveInfo(images: any) {
      //
      //Return new images with filtered properties.
      return images.map((image: any) => {
         return {
            publicID: image.public_id,
            src: image.secure_url,
            width: image.width,
            height: image.height,
         };
      });
   }

   //Handle creation of blog.
   public createBlog: RequestHandler = async (req, res, next) => {
      try {
         const { title, author, content, category } = req.body;
         //
         //Check if there is missing fields.
         !title || !author || !content || !category
            ? res.send({ message: 'Missing fields.' })
            : null;
         //
         //Upload each image in the cloudinary
         const uploadedImages = await this.uploadImagesToCloudinary(req.files);
         //
         //Remove sensitive information in the image properties.
         const images = this.filterImageSensitiveInfo(uploadedImages);
         //
         //Create blog document.
         const newBlog = await new BlogModel({
            title,
            author,
            content,
            category,
            images,
         });
         !newBlog && next(); //If failed
         //
         //Save the blog document in the mongodb.
         const saveBlog = await newBlog.save();
         saveBlog ? /* Success */ res.send(saveBlog) : /* Failed */ next();

         //Error Handling
      } catch (error) {
         res.send(error);
      }
   };

   //Handle updating of blog post.
   public updateBlog: RequestHandler = async (req, res) => {
      try {
         const { id, title, author, content, category } = req.body;
         //
         //Upload each image in the cloudinary
         const uploadedImages = await this.uploadImagesToCloudinary(req.files);
         //
         //Remove sensitive information in the image properties.
         const images = this.filterImageSensitiveInfo(uploadedImages);
         //
         //Check the requested properties of blog to update.
         const update: any = {};
         title && (update.title = title);
         author && (update.author = author);
         content && (update.content = content);
         category && (update.category = category);
         //
         //Find the blog by id in the database and update it.
         const findBlog = await BlogModel.findByIdAndUpdate(
            id,
            { ...update, $push: { images } },
            { new: true }
         );
         findBlog ? res.send(findBlog) : res.send({ message: 'No blog found!' });
         //
         //Error Handling
      } catch (error) {
         res.send(error);
      }
   };

   //Handle deletion of one blog.
   public deleteOneBlog: RequestHandler = async (req, res) => {
      try {
         const { id } = req.params;
         //
         //Find the blog by id and delete it in the database.
         const deleteBlog = await BlogModel.findByIdAndDelete(id);
         deleteBlog
            ? res.send({ message: 'Successfully deleted.' })
            : res.send({ message: 'No blog found!' });
         //
         //Error Handling
      } catch (error) {
         res.send(error);
      }
   };

   //Handle viewing on one specific blog post.
   public getOneBlog: RequestHandler = async (req, res) => {
      try {
         const { id } = req.params;
         //
         //Find one blog by id.
         const findBlog = await BlogModel.findById(id);
         findBlog ? res.send(findBlog) : res.send({ message: 'No blog found!' });
         //
         //Error Handling
      } catch (error) {
         res.send(error);
      }
   };

   //Handle filtering of query to get blogs in the database.
   public filterBlogs: RequestHandler = async (req, res, next) => {
      try {
         const { category, createdAt, limit, page } = req.query;
         //
         //Set default values to filter if there is no value provided.
         const order = (createdAt === '1' && 1) || -1;
         const resultLimit = Number(limit) || 10;
         const skip = (Number(page) - 1) * Number(limit) || 0;
         //
         //Create filters based on query to match the results.
         const filters: any = {};
         category && (filters.category = category);
         //
         //Aggregate blogs in the database.
         const findBlogs = await BlogModel.aggregate([
            { $match: filters }, //Match blog properties
            { $sort: { created_at: order } }, //Sort the results ascending or descending.
            { $skip: skip }, //Jump to page.
            { $limit: resultLimit }, //Limit results that will be send to user.
         ]);
         //
         //Check the total blogs that is match to the query without being limited.
         const totalBlogs = await BlogModel.aggregate([{ $match: filters }]).count('id');
         //
         //Send result to the front-end.
         findBlogs.length === 0 || totalBlogs.length === 0
            ? res.send({ message: 'No blog found!' })
            : findBlogs && totalBlogs
            ? res.send({
                 blogHits: findBlogs.length, //Number of found blogs.
                 totalBlogs: totalBlogs[0].id, //Overall total of the blogs.
                 page: Number(page), //Page selected.
                 totalPages: Math.ceil(totalBlogs[0].id / Number(limit)) || 1, //Overall pages.
                 blogs: findBlogs, //Array of blogs.
              })
            : next();
         //
         //Error Handling
      } catch (error) {
         res.send(error);
      }
   };

   public searchBlog: RequestHandler = async (req, res) => {
      try {
         const { search } = req.query;
         //
         //Find blog titles and send it to user.
         const findBlog = await BlogModel.find({ title: { $regex: search, $options: 'i' } });
         findBlog ? res.send(findBlog) : res.send({ message: 'No blog found!' });
         //
         //Error Handling
      } catch (error) {
         res.send(error);
      }
   };
}
