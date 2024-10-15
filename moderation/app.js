const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  console.log("Moderation Event Received: ", type);

  if (type === "CommentCreated") {
    const status = data.content.toLowerCase().includes("orange") ? "rejected" : "approved";

    await axios
      .post("http://event-bus-srv:4005/events", {
        type: "CommentModerated",
        data: {
          id: data.id,
          content: data.content,
          postId: data.postId,
          status,
        },
      });
  }

    return res.send({ status: "OK" });
});

app.listen(4003, () => {
  console.log("Listening on 4003");
});
