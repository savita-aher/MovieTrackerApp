# Movie Tracker App
A simple web application built with Node.js and Express.js that allows users to track movies they want to watch, are currently watching, or have already watched. This project is created as part of a Node and Express assessment to demonstrate RESTful API design, middleware usage, and dynamic view rendering with templating engines EJS .

## Features
- Add new movies to your watchlist via HTML form
- View all movies with status indicators
- Update or delete movies (optional bonus)
- RESTful API built with Express
- Custom middleware for logging and error handling

## Tech Stack
- Node.js
- Express.js

##  Git Ignore Setup
This project includes a `.gitignore` file to prevent unnecessary or sensitive files from being tracked in version control. Here's what's excluded:
node_modules/: External packages installed via npm
data/movies.json 

## Main Browser URLs
node server.js                      - Home (root route)
http://localhost:3000               - Login page to Movie Tracker app
http://localhost:3000/add-movie     - Add Movie Form(use credntial to log in or http://localhost:3000/add-movie?auth=true)
http://localhost:3000/movies        - View Movie List (Table)
http://localhost:3000/api/movies    - Movies API (JSON)
http://localhost:3000/success       - Page for successful movie addition
http://localhost:3000/delete        -page for successful movie deletion

## Login credential to test
username: admin
password: 1234
username: guest
password: 12345