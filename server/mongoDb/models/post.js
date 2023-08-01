/** @format */

import mongoose from "mongoose";
const { Schema } = mongoose;

const Post = new Schema({
	name: {
		type: String,
		require: true,
	},
	prompt: {
		type: String,
		require: true,
	},
	photo: {
		type: String,
		require: true,
	},
});

const PostSchema = mongoose.model("post", Post);

export default PostSchema;
