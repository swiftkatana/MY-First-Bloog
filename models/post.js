const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    id: Number,
    title: String,
    body: String,
    imgs: [String],
    time: String,
    howManyViews: Number,
});
const Post = mongoose.model("Posts", postSchema);

exports.Post = Post;