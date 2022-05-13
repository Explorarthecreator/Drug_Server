const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorHandler");
require("express-async-errors");

dotenv.config();

// set up server

const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

app.use(express.json());
app.use(cookieParser());

app.set("trust proxy", 1);
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://production.com"
        : "http://localhost:3000",
    credentials: true,
  })
);

mongoose.connect(
  process.env.MDB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) return console.error(err);
    console.log("Connected to MongoDB");
  }
);

// set up routes

app.use("/auth", require("./routers/userRouter"));
app.use("/drug", require("./routers/drugRouter"));

app.use(errorHandler);
