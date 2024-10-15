const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;
  events.push(event);

  axios.post("http://posts-clusterip-srv:4000/events", event).catch((err) => {
    console.log("Error :", err);
  });
  axios.post("http://comments-srv:4001/events", event).catch((err) => {
    console.log("Error :", err);
  });
  axios.post("http://query-srv:4002/events", event).catch((err) => {
    console.log("Error :", err);
  });
  axios.post("http://moderation-srv:4003/events", event).catch((err) => {
    console.log("Error :", err);
  });

  return res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  return res.send(events);
});

app.listen(4005, () => {
  console.log("Listening on 4005");
});
