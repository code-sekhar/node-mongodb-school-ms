const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.json());
const port = 4000;

const url = 'mongodb://localhost:27017/blog';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const con = mongoose.connection;
con.on('open', () => {
    console.log('connected...');
});
const postSchema = new mongoose.Schema({
    title: String,
    body: String
});
const posts = mongoose.model('posts', postSchema);
app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Hello World!',
        status: 200,
        success: true,
    });
});
//get all posts
app.get('/posts', async (req, res) => {
    try{
        const post = await posts.find();
        res.status(200).json(post);
    }catch(err){
        res.status(500).json(err);
    }
});

app.listen(port, () => {    
    console.log(`Example app listening at http://localhost:${port}`);
});