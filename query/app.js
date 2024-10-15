const cors = require("cors");
const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");
const eventHandler = require("./utils/eventHandler");

const app = express();

// Setting up middlewares
app.use(cors());
app.use(bodyParser.json());

const posts = {};

app.get("/posts", (req, res) => {
  console.log("Inside Get /posts");
  return res.status(200).send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  console.log("Query Event Received: ", type);
  eventHandler(type, data, posts);

  return res.send({ status: "OK" });
});

app.listen(4002, async () => {
  console.log("Listening on 4002");
  try {
    const result = await axios.get("http://event-bus-srv:4005/events");

    for (let event of result.data) {
      console.log("Processing event :", event.type);
      eventHandler(event.type, event.data, posts);
    }
  } catch (error) {
    console.error("Error :", error);
  }
});
