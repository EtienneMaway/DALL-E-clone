/** @format */

import { useState } from "react";
import { preview } from "../assets ";

import { getRandomPrompt } from "../utils";
import { FormField, Loader } from "../Components";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		name: "",
		prompt: "",
		photo: "",
	});
	const [generatingImg, setGeneratingImg] = useState(false);
	const [loading, setLoading] = useState(false);

	const generateImage = async () => {
		if (form.prompt) {
			try {
				setGeneratingImg(true);

				const response = await fetch("http://localhost:8000/api/v1/dalle", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ prompt: form.prompt }),
				});

				if (!response.ok) {
					console.log("Failed to generate image");
					throw new Error("Failed to generate image");
				}

				const data = await response.json();

				setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
			} catch (error) {
				alert(error);
			} finally {
				setGeneratingImg(false);
			}
		} else {
			alert("please, enter a prompt");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (form.prompt && form.photo) {
			setLoading(true);
			try {
				const response = await fetch("http://localhost:8000/api/v1/post", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(form),
				});

				await response.json();

				navigate("/");
			} catch (error) {
				alert(error);
			} finally {
				setLoading(false);
			}
		} else {
			console.log("could not get to home page");
			alert("please, enter a prompt and generate an image ");
		}
	};

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};
	const handleSurpriseMe = () => {
		const randomPrompt = getRandomPrompt(form.prompt);
		setForm({ ...form, prompt: randomPrompt });
	};

	return (
		<section className="max-w-7xl mx-auto">
			<div>
				<h1 className="font-extrabold text-4xl">Create</h1>
				<p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
					Create imaginative and visually stunning images through DALL-E AI and
					share with the community
				</p>
			</div>

			<form action="" className="max-w-3xl mt-16" onSubmit={handleSubmit}>
				<div className="flex flex-col gap-3">
					<FormField
						labelName="Your name"
						type="text"
						name="name"
						placeholder="John Doe"
						value={form.name}
						handleChange={handleChange}
					/>
					<FormField
						labelName="prompt"
						type="text"
						name="prompt"
						placeholder="a stained glass window depicting a hamburger and french fries"
						value={form.prompt}
						handleChange={handleChange}
						isSurpriseMe
						handleSurpriseMe={handleSurpriseMe}
					/>

					<div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 h-64 p-3 flex justify-center items-center">
						{form.photo ? (
							<img
								src={form.photo}
								alt={form.prompt}
								className="w-full h-full object-contain"
							/>
						) : (
							<img
								src={preview}
								alt="preview"
								className="w-3/4 h-3/4 opacity-40 object-contain"
							/>
						)}
						{generatingImg && (
							<div className="absolute flex justify-center items-center rounded-lg inset-0 bg-[rgba(0,0,0,0.5)]">
								<Loader />
							</div>
						)}
					</div>
				</div>

				<div className="mt-5 flex gap-5">
					<button
						type="button"
						onClick={generateImage}
						className="text-white bg-green-700 w-full text-sm sm:w-auto px-5 py-2.5 rounded-lg text-center">
						{generatingImg ? "Generating..." : "Generate"}
					</button>
				</div>

				<p className="mt-2 text-[#6c747c] text-[14px]">
					After creating the image you want, you can share it with others in the
					community
				</p>

				<button className="text-white mt-3 bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center">
					{loading ? "Sharing..." : "Share with the Community"}
				</button>
			</form>
		</section>
	);
};

export default CreatePost;
