import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import sharp from "sharp";
import fs from "fs";
import fetch from "node-fetch";
import OpenAI from "openai";
import path from "path";
import sizeOf from "image-size";
// import {
//   initial_ch_prompt,
//   style,
//   update_character_description,
// } from "../../../utils/prompts.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const model_vision = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

async function generate_story(color) {
  console.log("Generating story");
  const prompt = `'Little ${color["Name"]} Riding Hood' is a spin off picture book story of 'Little Red Riding Hood' where the main character's color is called ${color["Name"]} instead of Red, and has the specific color ${color["Name"]}. The story is written for kids. Create a script for this picture book, following the previous description. Return a list of paragraphs, each corresponding to one page of the picture book. Write 5 pages. Be creative, the story is based on 'Little Red Riding Hood’, but the setting of the story can be anywhere, it doesn’t have to be in a forest, choose an appropriate and creative setting based on the color name. Limit your answer to 5 pages.`;
  const result = await model.generateContent(prompt, safetySettings);
  const response = await result.response;
  const text = response.text();
  var pages = [];
  for (let content of text.split("\n")) {
    if (content.length > 0 && !content.includes("*")) {
      pages.push(content);
    }
  }
  // console.log(pages);
  console.log("Story generated");
  return pages;
}

async function downloadImage(imageURL, storyPath, imageName) {
  try {
    const response = await fetch(imageURL);
    if (!response.ok)
      throw new Error(`Failed to fetch ${imageURL}: ${response.statusText}`);

    const imagePath = path.join(storyPath, imageName);
    console.log("AAAAAAAAAAAAAA");
    console.log(storyPath);
    console.log(`Downloading image to ${imagePath}`);
    const stream = fs.createWriteStream(imagePath);
    response.body.pipe(stream);

    return new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });
  } catch (error) {
    console.error("Failed to download image:", error);
  }
}

// Converts local file information to a GoogleGenerativeAI.Part object.
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

async function generate_character_description(pages, color, storyPath) {
  console.log(color);
  console.log(color["Name"]);
  console.log("---------------------------");
  console.log("Generating character description");
  const pages_str = pages.join(" ");
  const style = `Create an image for a children’s picture book in the style of Bruno Munari. The drawing style of the image should be simple and hand drawn with pencil. It is, characterized by its use of bold outlines, a simple and muted color scheme centered around the color of '${color["Name"]}', and textural patterns that impart depth. Avoid using many colors. Create simple aesthetic that is appealing in children's literature.`;
  const initial_ch_prompt = `Write a detailed description of the physical appearance of the character 'Little ${color["Name"]} Riding Hood' for a picture book. The character should be wearing a hooded cloak in the specific color ${color["Name"]}, emphasize that the hood should be of that color. The character should be a child. The description should be detailed and include the character's hair color, eye color, clothing style, clothes color, and everything else that is relevant to the character's appearance. Do not use many colors apart from the color ${color["Name"]}. Make your description concise and detailed only in the physical aspects. Do not mention anything other than the physical appearance of the character. Make the style look simple and easy to replicate. Limit your answer to 150 words.`;
  var prompt = `${initial_ch_prompt}. Any information you might need to know about the character is in the story: '${pages_str}'.`;
  const res = await model.generateContent(prompt);
  console.log(res);
  var description = res.response.text();
  var image_prompt = `Create an image of 'Little ${color["Name"]} Riding Hood' for a children's picture book in the following style: '${style}'. Here is a detailed description of the character: '${description}'. Do NOT add text in the image.`;
  image_prompt +=
    " I NEED to test how the tool workswith this EXACT prompt. DO NOT add any detail, just use it AS-IS";
  console.log("Generating image for character description");
  console.log("Image prompt:");
  console.log(image_prompt);
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: image_prompt,
    size: "1792x1024",
    style: "natural",
    quality: "standard",
    n: 1,
  });
  console.log(response);
  const imageURL = response.data[0].url;
  await downloadImage(imageURL, storyPath, "/image-0.png");
  const imagePath = path.join(storyPath, "/image-0.png");
  description = await updateCharacterDescription(imagePath, color);
  const base64Image = fs.readFileSync(imagePath).toString("base64");
  console.log("Character description generated");
  console.log("---------------------------");
  return { description: description, image: base64Image };
}

async function updateCharacterDescription(imagePath, color) {
  try {
    // Load the image
    const imageBuffer = fs.readFileSync(imagePath);
    const dimensions = sizeOf(imageBuffer);

    // Resize the image to 50% of the original using sharp
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize({
        width: Math.round(dimensions.width * 0.5),
        height: Math.round(dimensions.height * 0.5),
      })
      .toBuffer();

    // Save the resized image
    const newImagePath = imagePath.split(".")[0] + "-resized.png";
    fs.writeFileSync(newImagePath, resizedImageBuffer);

    // Prepare data for Gemini API request
    const imageParts = [fileToGenerativePart(newImagePath, "image/png")];

    // Make request to Gemini API
    const update_character_description = `In the image provided there is character named 'Little ${color["Name"]} Riding Hood' wearing a hood. The character should a child wearing a hooded cloak in the specific color ${color["Name"]}.  Describe the style of that character in detail. The description should be detailed and include the character's racial features, skin color, height, hair color, eye color, clothing style, clothes color, and everything else that is relevant to the character's appearance. Be very specific about physical details, do not use abstract concepts. Talk about the color scheme, the texture, the line work, and the overall feel of the character. Write your answer in 100 words.`;
    const result = await model_vision.generateContent([
      update_character_description,
      ...imageParts,
    ]);

    // Process Gemini API response
    const response = await result.response;
    const description = response.text();
    console.log(description);

    return description;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function POST(request) {
  console.log("GEMINI API POST request received!");
  const params = await request.json();
  var res = {};
  if (params.type === "generate_story") {
    console.log("Received generate_story request");
    const pages = await generate_story(params.color);
    res = { result: pages };
  }
  if (params.type === "generate_character") {
    console.log("Received generate_character request");
    const result = await generate_character_description(
      params.pages,
      params.color,
      params.storyPath
    );
    res = { result: result };
  }
  // console.log(`got a request: ${JSON.stringify(data, null, 4)}`);
  console.log("GEMINI API POST request completed!");
  return NextResponse.json(res);
}
