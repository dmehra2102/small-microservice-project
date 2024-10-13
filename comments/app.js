const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const { randomBytes, randomInt } = require('crypto');

const app = express();

// Setting up middlewares
app.use(cors());
app.use(bodyParser.json());

const commentsByPostID = {};

app.get("/posts/:id/comments", (req, res) => {
    const comments = commentsByPostID[req.params.id] || [];
    return res.status(200).send(comments);
});

app.post("/posts/:id/comments", async (req, res)=>{
    const commentId = randomBytes(4).toString('hex');
    const {content} = req.body;
    const comments = commentsByPostID[req.params.id] || [];

    comments.push({id: commentId, content});
    commentsByPostID[req.params.id] = comments;

    await axios.post("http://localhost:4005/events", {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id
        }
    });

    return res.status(201).send(comments);
});

app.post("/events", (req, res)=>{
    console.log("Received Event", req.body.type);
    return res.send({status: 'OK'});
});

app.listen(4001, () => {
    console.log("Listening on 4001");
});