const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const allRoutes = require("./app/routes/route.js");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(cookieParser(process.env.COOKIE_PARSER_TOKEN));
app.use(express.json());

app.use("/api", allRoutes);

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running`);
    });
  })
  .catch((err) => console.error(err));
