const cors = require("cors");
const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes, randomInt } = require("crypto");

const app = express();

// Setting up middlewares
app.use(cors());
app.use(bodyParser.json());

const commentsByPostID = {};

app.get("/posts/:id/comments", (req, res) => {
  const comments = commentsByPostID[req.params.id] || [];
  return res.status(200).send(comments);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comments = commentsByPostID[req.params.id] || [];

  comments.push({ id: commentId, content, status: "pending" });
  commentsByPostID[req.params.id] = comments;

  await axios
    .post("http://event-bus-srv:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: "pending",
      },
    });

  return res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
    const { type, data } = req.body;
    console.log("Comment Event Received: ", type);

    if (type === "CommentModerated") {
      const { id, postId, status, content } = data;
      const comments = commentsByPostID[postId];
      const comment = comments.find((comment) => {
        return comment.id === id;
      });
      comment.status = status;
      comment.content = content;
  
      await axios
        .post("http://event-bus-srv:4005/events", {
          type: "CommentUpdated",
          data: {
            id,
            postId,
            status,
            content,
          },
        })
        .catch((err) => {
          console.log(err.message);
        });
    }

  return res.send({ status: "OK" });
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
