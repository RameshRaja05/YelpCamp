# YelpCamp

This is a web application that allows you to view, add, and review campgrounds from around the world. It is inspired by the Udemy course The Web Developer Bootcamp by Colt Steele.

## Features

- User authentication and authorization
- Campground listing and filtering
- Campground creation and editing
- Campground rating and commenting
- Interactive map with campground locations
- Responsive design and mobile-friendly interface

## Technologies

- Backend: Node.js, Express, MongoDB, Passport, Mongoose
- Frontend: HTML, CSS, Bootstrap, JavaScript, EJS
- APIs: Mapbox, Cloudinary, Geocoder
- Deployment: Render(you can host website without your credit card details also it supports free tier), MongoDB Atlas(for remote db), GitHub

## Installation

To run this project locally, you need to have Node.js 14+, MongoDB 4+, and Git installed on your machine.

1. Clone this repository: `https://github.com/RameshRaja05/YelpCamp.git`
2. Navigate to the project directory: `cd yelpcamp`
3. Install the dependencies: `npm install`
4. Create a .env file in the root directory and add the following variables:
    - PORT: the port number for the server (default is 3000)
    - DB_URL: the MongoDB connection string
    - MAPBOX_TOKEN: the Mapbox API access token
    - CLOUDINARY_CLOUD_NAME: the Cloudinary cloud name
    - CLOUDINARY_KEY: the Cloudinary API key
    - CLOUDINARY_SECRET: the Cloudinary API secret
5. Run the server: `npm run serve`
6. Open your browser and visit http://localhost:3000 to see the website.
