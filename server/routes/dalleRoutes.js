/** @format */
dotenv.config();

import express from "express";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

const router = express.Router();

const configuration = new Configuration({
	apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

router.route("/").get((req, res) => {
	res.send("Hello from DALL-E");
});

router.route("/").post(async (req, res) => {
	try {
		const { prompt } = req.body;
		if (!prompt) {
			return res.status(400).json({ error: "Please provide a prompt." });
		}

		const aiResponse = await openai.createImage({
			prompt,
			n: 1,
			size: "1024x1024",
			response_format: "b64_json",
		});

		const image = aiResponse.data.data[0].b64_json;
		res.status(200).json({ photo: image });
	} catch (error) {
		console.log(error);
		res.status(500).send({
			error: error?.response?.data?.error?.message || "Internal server error",
		});
	}
});

export default router;
