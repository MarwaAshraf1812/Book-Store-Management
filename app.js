const express = require("express");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('./middlewares/logger');
const {errorHandler, notFound}= require('./middlewares/errors');
const app = express();

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

//Middlewares
app.use(express.json());
app.use(logger);


//Routes
app.use("/api/books", require("./Routes/books"));
app.use("/api/authors", require("./Routes/authors"));
app.use("/api/auth", require("./Routes/auth"));
app.use("/api/users", require("./Routes/users"));

//Error Handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

