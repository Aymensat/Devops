// @ts-check

const express = require("express");
const app = express();
app.use(express.json());

const urlDBs = {};

app.get("/hi", (req, res) => {
  res.json({ message: "hii" });
});

app.post("/encode-url", (req, res) => {
  const decodedUrl = req.body.url;

  if (!decodedUrl) return res.status(400).json({ message: "u must put url" });

  try {
    new URL(decodedUrl);
  } catch {
    return res.status(400).json({ message: "url malformed" });
  }

  let encodedUrl; // encoded url
  //logic
  let x = Math.random();
  encodedUrl = x.toString(36).substring(2, 8);

  urlDBs[encodedUrl] = decodedUrl; // why this gives errors ? ?
  return res
    .status(200)
    .json({ decodedUrl: decodedUrl, encodedUrl: encodedUrl });
});

//decode

app.get("/:id", (req, res) => {
  const encodedUrl = req.params.id;

  if (!urlDBs[encodedUrl])
    return res.json({ message: " there is no such encoded url man " });

  const decodedUrl = urlDBs[encodedUrl]; //urlDBs[encodedUrl] always give error idk why

  res.redirect(decodedUrl);
});

app.listen(process.env.PORT || 5000, () =>
  console.log("server running on 5000")
);
