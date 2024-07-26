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
    body: String,
    category: String,
    likes: Number,
    tags: Array,
    date: { type: Date, default: Date.now },
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

//create post
app.post('/posts', async (req, res) => {
    const { title, body, category, likes, tags } = req.body;
    if(!title || !body || !category || !likes || !tags){
        res.status(400).json({
            error: 'Please add all the fields',
            status: 400,
            success: false,
        });
    }
    try{
        const newPost = new posts({
            title,
            body,
            category,
            likes,
            tags,
        });
        const post = await newPost.save();
        res.status(200).json({
            data: post,
            status: 200,
            success: true,
            message: 'post created successfully',
        });
    }catch(err){
        res.status(500).json(err);
    }
});

//delete post
app.delete('/posts/:id', async (req, res) => {
    try{
        const post = await posts.findByIdAndDelete(req.params.id);
        res.status(200).json({
            data: post,
            status: 200,
            success: true,
            message: 'post deleted successfully',
        });
    }catch(err){
        res.status(500).json(err);
    }
});
//update post
app.put('/posts/:id', async (req, res) => {
    try{
        const post = await posts.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({
            data: post,
            status: 200,
            success: true,
            message: 'post updated successfully',
        });
    }catch(err){
        res.status(500).json(err);
    }
});
//search post
app.get('/posts/search', async (req, res) => {
    const { query } = req.query;
    if(!query){
        res.status(400).json({
            error: 'Please add all the fields',
            status: 400,
            success: false,
        });
    }
    try{
        const post = await posts.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { body: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } },
            ],
        });
        res.status(200).json({
            data: post,
            status: 200,
            success: true,
            message: 'post updated successfully',
        });
    }catch(err){
        res.status(500).json(err);
    }
}); 
app.listen(port, () => {    
    console.log(`Example app listening at http://localhost:${port}`);
});