const express = require("express");
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const logger = require('./middlewares/logger');
const {errorHandler, notFound}= require('./middlewares/errors');
const {dbConection} = require('./config/db');
const app = express();

// Connect to MongoDB
dbConection();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(logger);

app.set("view engine", "ejs");

//Routes
app.use("/api/books", require("./Routes/books"));
app.use("/api/authors", require("./Routes/authors"));
app.use("/api/auth", require("./Routes/auth"));
app.use("/api/users", require("./Routes/users"));
app.use("/password", require("./Routes/password"));

//Error Handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

