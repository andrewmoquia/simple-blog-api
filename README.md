# Simple Blog API
A simple web API server using NodeJS & ExpressJS that will provide resources for blog frontend application. 

## Table of Contents
* [Technologies](#technologies)
* [Installation](#installation)
* [Configuration](#configuration)

## Technologies
|  Back End   |
| ------------|
| NodeJS      |
| Express     | 
| Typescript  |
| MongoDB     |
| Mongoose    |
| Eslint      | 
| Prettier    |

## Installation
1. Clone the boilerplate repo
`git clone https://github.com/andrewmoquia/simple-blog-api.git`
2. Make sure to open the folder of `./simple-blog-api` in your IDE like Visual Studio Code.
3. Install packages.
`npm install`
4. Create ".env" file in your root folder and setup this.
```
MONGO_URI=your_mongo_uri
PORT=5000
ORIGIN='http://localhost:5000'
COOKIE_SECRET='secret'
```
6. Start dev.
`npm run dev`
7. Build and bundling your resources for production.
`npm run build`
8. Note: `npm start` is reserve in deployment in production.

## Configuration
- `./.prettierrc.js` config for Prettier.
- `./eslintrc.js` config for Eslint.
- `./tsconfig.json` config for Typescript.
