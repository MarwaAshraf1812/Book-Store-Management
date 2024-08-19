# Book Store Management

A comprehensive book store management system built with Node.js and Express. This application allows users to manage books, authors, and user efficiently.

## Features

- **Book Management**: Add, update, and delete books.
- **Author Management**: Manage author details including biography and image.
- **CRUD Operations**: Full Create, Read, Update, and Delete functionalities.
- **API Integration**: RESTful APIs for book, author and user operations.

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/MarwaAshraf1812/Book-Store-Management.git
   cd Book-Store-Management
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   ```

4. **Run the Application**
   ```bash
   npm start
   ```

5. **Access the Application**

   Open your browser and go to `http://localhost:3000` to start using the Book Store Management system.

## API Endpoints

- **Books**
  - `GET /api/books` - Retrieve all books
  - `POST /api/books` - Add a new book
  - `PUT /api/books/:id` - Update a book
  - `DELETE /api/books/:id` - Delete a book

- **Authors**
  - `GET /api/authors` - Retrieve all authors
  - `POST /api/authors` - Add a new author
  - `PUT /api/authors/:id` - Update an author
  - `DELETE /api/authors/:id` - Delete an author


## Technologies Used

- **Node.js** - JavaScript runtime for server-side development
- **Express** - Web framework for Node.js
- **MongoDB** - NoSQL database for storing data
- **Mongoose** - ODM library for MongoDB
