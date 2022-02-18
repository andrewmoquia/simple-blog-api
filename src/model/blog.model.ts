import { Schema, model } from 'mongoose';

const BlogSchema = new Schema({
   title: { type: String, required: true },
   author: { type: String, required: true },
   content: { type: String, required: true },
   category: { type: String, required: true },
   images: [
      {
         publicID: { type: String, required: true },
         src: { type: String, required: true },
         width: { type: Number, required: true },
         height: { type: Number, required: true },
      },
   ],
   created_at: { type: Date, default: Date.now() },
});

export default model('blog', BlogSchema, 'blog');
