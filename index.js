const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const userRoute = require("./routes/User");
const authRoute = require("./routes/Auth");
const productRoute = require("./routes/Product");
const cartRoute = require("./routes/Cart");
const orderRoute = require("./routes/Order");
const stripeRoute = require("./routes/Stripe");
const cors = require("cors");
const path = require("path");

//mongoose
mongoose.set("strictQuery", false);
const connectDB = () => mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Db connection Succesfully"))
    .catch((err) => {
        console.log(err);
});

//middlewares
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001", "https://flameluxury.netlify.app", "https://flameluxuryadmin.netlify.app"]}));
app.use(express.json());

//body parser 
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

//static files
app.use(express.static(path.join(__dirname, "public")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//port
connectDB().then(() => {
  app.listen(process.env.PORT || 5500, () => {
    console.log("Backend server is running");
  })
})
