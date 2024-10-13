const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Setting up middlewares
app.use(cors());
app.use(bodyParser.json());

const posts = {};

app.get("/posts", (req, res) => {
    return res.status(200).send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId } = data;
    const post = posts[postId];
    post.comments.push({ id, content });
  }

  return res.send({ status: "OK" });
});

app.listen(4002, () => {
  console.log("Listening on 4002");
});
