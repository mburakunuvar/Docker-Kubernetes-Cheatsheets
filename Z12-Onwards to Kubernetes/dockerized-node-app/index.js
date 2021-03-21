const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send(
    "<h1>Sample NodeJS Application</h1><h2>running on docker container</h2>"
  );
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
