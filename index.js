const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("<h2>Hello</h2>");
});

//This points to the express port that has been set (PORT), if it hasn't been set, fall back to the default port we specified as 3000
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
