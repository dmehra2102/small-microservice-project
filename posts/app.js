const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');

const app = express();

// Setting up middlewares
app.use(cors());
app.use(bodyParser.json());

const posts = {};

app.get("/posts", (req , res)=> {
    return res.status(200).send(posts);
});

app.post("/posts", async (req, res)=>{
    const id = randomBytes(4).toString('hex');
    const {title} = req.body;
    posts[id] = {
        id, title
    }

    await axios.post("http://localhost:4005/events", {
        type: 'PostCreated',
        data: {
            id, title
        }
    });
    return res.status(201).send(posts[id]);
})

app.listen(4000, ()=>{
    console.log("Listening on 4000");
})