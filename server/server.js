const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();
// app
const app = express();

//  database
console.log("Connecting to MongoDB at:", process.env.DATABASE);
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB CONNECTED"))
  .catch((error) => console.log(`DB CONNECTION ERR ${error}`));

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cors());

//route middleware

fs.readdirSync("./routes").map((route) =>
  app.use("/api", require("./routes/" + route))
);

//port
const port = process.env.PORT;

app.listen(port, () => console.log(`Server is running on port ${port}`));
