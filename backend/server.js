//add a row into table test of mysql database nodedb with express and bootstarp
function main() {
  let express = require("express");
  let app = express();
  let morgan = require("morgan");
  let db_con = require("./config/db.js");
  const cors = require("cors");
  const path = require('path');
  const mongoose = require("mongoose");

  //all routes
  let authRoutes = require('./routes/authRoute.js')
  let productRoute = require('./routes/productRoute.js')
  let purchaseProductsRoute = require('./routes/purchaseProductsRoute.js')
  let feedbackRoute = require('./routes/feedbackRoute.js')

  //database connection
  db_con();

  //dotenv 
  let dotenv = require("dotenv");
  dotenv.config();

  let port = process.env.PORT || 3000;

  //provide middle wares
  app.use(
    cors({
      origin: "http://localhost:8080",
      // origin: "https://techready-web.netlify.app",
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(morgan('dev'));
  app.use("/upload", express.static(path.join(__dirname, "upload")));  // Correct Static Path
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));  // Correct Static Path
  app.use("/uploadVideos", express.static(path.join(__dirname, "uploadVideos")));  // Correct Static Path

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });

  app.get("/", (req, res) =>
    res.send(`Welcome to omiii`)
  );

  //routes
  app.use('/auth', authRoutes);
  app.use('/product', productRoute);
  app.use('/purchase', purchaseProductsRoute);
  app.use('/feedback', feedbackRoute);


  app.get("*", (req, res) =>
    res.send("Erorr : 404")
  );


  app.listen(port, function () {
    console.log(
      "Server is ready, please open your browser at http://localhost:%s",
      port
    );
  });
}

main();
