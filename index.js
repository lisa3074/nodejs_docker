const express = require("express");
const mongoose = require("mongoose");
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_PORT,
  MONGO_IP,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require("./config/config.js");

const session = require("express-session");
const redis = require("redis");
let redisStore = require("connect-redis")(session);
let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
});

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose
    .connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Sucssesfully connected to db"))
    .catch(e => {
      console.log("Theres an error", e);
      //Make sure the app tries to reconnect to db, if db isnt up (indefinate)
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h2>Hell yeah!! Wuhuuu</h2>");
});

app.use(
  session({
    store: new redisStore({ client: redisClient }),
    //secret: SESSION_SECRET,
    secret: "helloSecret",
    cookie: {
      secure: false,
      resave: false,
      saveUninitialized: false,
      httpOnly: true,
      maxAge: 30000000,
    },
  })
);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

//This points to the express port that has been set (PORT), if it hasn't been set, fall back to the default port we specified as 3000
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
