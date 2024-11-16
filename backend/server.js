import express from "express";
import colors from "colors";
import dotenv from "dotenv";
dotenv.config();

// Modules
import connectToDb from "./config/db.js";

// Db Connection
connectToDb();

// Server
const server = express();

// Port
const port = process.env.PORT;

server.listen(port, () => {
  console.log(`Server listening port: ${port}`.bgBlue);
});
