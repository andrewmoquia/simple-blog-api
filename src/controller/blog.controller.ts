import { Blog } from '../services/blog';

export class BlogController extends Blog {
   constructor() {
      super();
   }

   public Router() {
      //
      //Route for creation of blog.
      this.router.post('/create/blog', this.uploadFile, this.createBlog);
      //
      //Route for updating of blog.
      this.router.put('/update/blog', this.uploadFile, this.updateBlog);
      //
      //Route for finding one blog.
      this.router.delete('/delete/blog/:id', this.deleteOneBlog);
      //
      //Route for finding one blog.
      this.router.get('/blog/:id', this.getOneBlog);
      //
      //Route for filtering of blog.
      this.router.get('/blogs', this.filterBlogs);
      //
      //Route for searching of blog.
      this.router.get('/blogs/results', this.searchBlog);
      //
      //Return this router.
      return this.router;
   }
}
