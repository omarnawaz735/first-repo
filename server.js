// Minimal Node server for the Blue demo.
// Its only job is to serve the static front-end (Blue.html + the blue/ assets).
// Hostinger (and most Node hosts) set the port via process.env.PORT.
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve everything in this folder, but don't auto-serve index.html at "/"
// (index.html is the old, unrelated Todo app — we want Blue at the root).
app.use(express.static(__dirname, { index: false }));

// Root URL -> the Blue app
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "Blue.html"));
});

app.listen(PORT, function () {
  console.log("Blue is running on port " + PORT);
});
