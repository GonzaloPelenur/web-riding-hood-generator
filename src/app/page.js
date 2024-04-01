"use client";
import { useState, useEffect } from "react";
import pantone from "../data/pantone-colors-by-key.json";
import hexToPantone from "../data/hex-to-pantone.json";
import { Input, Button, Spinner } from "@nextui-org/react";
import * as React from "react";
import ColorPicker from "@/components/ColorPicker";
import InitialInput from "@/components/InitialInput";
import DisplayPages from "@/components/DisplayPages";
import GenerateCharacter from "@/components/GenerateCharacter";
import Character from "@/components/Character";
import GenerateImages from "@/components/GenerateImages";
import DisplayImages from "@/components/DisplayImages";

// 1. import `NextUIProvider` component
import { NextUIProvider } from "@nextui-org/react";

async function createDirectory() {
  try {
    const response = await fetch("/api/utils", { method: "POST" });
    if (response.ok) {
      const data = await response.json();
      console.log("Directory created at:", data.path);
      return data.path;
    } else {
      console.error("Failed to create directory:", response.statusText);
    }
  } catch (error) {
    console.error("Error creating directory:", error);
  }
}

async function generate_story(color) {
  try {
    const response = await fetch("api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        color: color,
        type: "generate_story",
      }),
    });
    console.log(response);
    console.log(response.status);
    if (response.status === 200) {
      console.log("API request successful!");
      const data = await response.json();
      console.log(data);
      return data.result;
    } else {
      console.error("API request failed");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
async function generate_character(color, pages, storyPath) {
  try {
    const response = await fetch("api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        color: color,
        type: "generate_character",
        pages: pages,
        storyPath: storyPath,
      }),
    });
    console.log(response);
    console.log(response.status);
    if (response.status === 200) {
      console.log("API request successful!");
      const data = await response.json();
      console.log(data);
      return data.result;
    } else {
      console.error("API request failed");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
async function generate_bg_image(color, storyPath) {
  try {
    const response = await fetch("api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        color: color,
        type: "generate_bg_image",
        storyPath: storyPath,
      }),
    });
    console.log(response);
    console.log(response.status);
    if (response.status === 200) {
      console.log("API request successful!");
      const data = await response.json();
      console.log(data);
      return data.result;
    } else {
      console.error("API request failed");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function generate_scene_image(
  color,
  page,
  storyPath,
  characterDescription,
  num,
  style,
  genID
) {
  try {
    const response = await fetch("api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        color: color,
        type: "generate_scene_image",
        pages: page,
        storyPath: storyPath,
        characterDescription: characterDescription,
        num: num,
        style: style,
        genID: genID,
      }),
    });
    console.log(response);
    console.log(response.status);
    if (response.status === 200) {
      console.log("API request successful!");
      const data = await response.json();
      console.log(data);
      return data.result;
    } else {
      console.error("API request failed");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
function getFontColorForBackground(color) {
  // Extract RGB values from the input color object
  const [r, g, b] = color.RGB;

  // Normalize the RGB values to [0, 1]
  const rNormalized = r / 255;
  const gNormalized = g / 255;
  const bNormalized = b / 255;

  // Calculate luminance
  const luminance =
    0.299 * rNormalized + 0.587 * gNormalized + 0.114 * bNormalized;

  // Determine the font color based on luminance
  const fontColor = luminance > 0.5 ? "#000000" : "#FFFFFF";
  console.log(fontColor);
  return fontColor; // Return black for light backgrounds, white for dark
}

function hexToRgb(hex) {
  let r = 0,
    g = 0,
    b = 0;
  // 3 digits
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  // 6 digits
  else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  return [r, g, b];
}

function findClosestColor(inputHex, colorDict) {
  let closestColor = "";
  let smallestDistance = Infinity;
  const inputRgb = hexToRgb(inputHex);

  for (const [hex, colorName] of Object.entries(colorDict)) {
    const dictRgb = hexToRgb(hex);
    const distance = Math.sqrt(
      Math.pow(dictRgb[0] - inputRgb[0], 2) +
        Math.pow(dictRgb[1] - inputRgb[1], 2) +
        Math.pow(dictRgb[2] - inputRgb[2], 2)
    );

    if (distance < smallestDistance) {
      closestColor = colorName;
      smallestDistance = distance;
    }
  }
  console.log(closestColor);
  return closestColor; // This returns the hex value. You could also return colorName or both.
}

export default function Home() {
  // const configuration = new Configuration({
  //   apiKey: process.env.OPENAI_API_KEY,
  // });
  // const openai = new OpenAI({
  //   apiKey: process.env.OPENAI_API_KEY,
  // });
  // const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  // const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  // const model_vision = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  // const data = getData();
  const [inputValue, setInputValue] = useState("");
  const [name, setName] = useState("[COLOR]");
  const [hexColor, setHexColor] = useState("#000000");
  const [pages, setPages] = useState([]);
  const [storyPath, setStoryPath] = useState("");
  const [characterDescription, setCharacterDescription] = useState("");
  const [onLoadCharacter, setOnLoadCharacter] = useState(false);
  const [images, setImages] = useState([]);
  const [style, setStyle] = useState("");
  const [genID, setGenID] = useState("");
  const [onLoadScene, setOnLoadScene] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [colorPicker, setColorPicker] = useState("#ffffff"); // Default color
  const [onLoadPages, setOnLoadPages] = useState(false);

  const handleColorPickerChange = (newColor) => {
    setColorPicker(newColor);
  };

  useEffect(() => {
    // Assuming backgroundImage is the base64 encoded string
    const base64ImageURI = `data:image/png;base64,${backgroundImage}`;

    // Create the background layer
    const bgLayer = document.createElement("div");
    bgLayer.style.position = "fixed";
    bgLayer.style.top = "0";
    bgLayer.style.left = "0";
    bgLayer.style.width = "100%";
    bgLayer.style.height = "100%";
    bgLayer.style.background = `url('${base64ImageURI}') no-repeat center center fixed`;
    bgLayer.style.backgroundSize = "cover";
    bgLayer.style.zIndex = "-2"; // Ensure it's below the white overlay

    // Create the white overlay layer
    const whiteOverlay = document.createElement("div");
    whiteOverlay.style.position = "fixed";
    whiteOverlay.style.top = "0";
    whiteOverlay.style.left = "0";
    whiteOverlay.style.width = "100%";
    whiteOverlay.style.height = "100%";
    whiteOverlay.style.backgroundColor = "rgba(255,255,255,0.7)"; // White with 70% opacity
    whiteOverlay.style.zIndex = "-1"; // Above the image, below the content

    // Append both layers to the body
    document.body.appendChild(bgLayer);
    document.body.appendChild(whiteOverlay);

    // Ensure the body's background is transparent so layers show through
    document.body.style.backgroundColor = "transparent";

    // Cleanup function to remove layers when component unmounts or backgroundImage changes
    return () => {
      document.body.removeChild(bgLayer);
      document.body.removeChild(whiteOverlay);
      document.body.style.background = "";
      document.body.style.backgroundColor = "";
    };
  }, [backgroundImage]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };
  const changeBgImage = async (color, storyPath) => {
    const res = await generate_bg_image(color, storyPath);
    console.log(res);
    setBackgroundImage(res.image);
  };
  const mapColor = async (event) => {
    event.preventDefault();
    const closestPantone = findClosestColor(colorPicker, hexToPantone);
    console.log(closestPantone);
    setInputValue(closestPantone);
    setHexColor(pantone[closestPantone].HexCode);
    setName(pantone[closestPantone].Name);
  };
  const handleSubmit = async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();
    // check if inputValue is in pantone
    if (!(inputValue in pantone)) {
      console.log("Invalid color");
      return;
    }
    setOnLoadPages(true);
    // For demonstration: log the current input value to the console
    console.log(pantone[inputValue]);
    setHexColor(pantone[inputValue].HexCode);
    setName(pantone[inputValue].Name);
    const res = await generate_story(pantone[inputValue]);
    console.log(res);
    setPages(res);
    console.log("pages");
    console.log(pages);
    const story_path = await createDirectory();
    console.log(story_path);
    setStoryPath(story_path);
    console.log(res.length + 1);
    setOnLoadScene(new Array(res.length + 1).fill(false));
    setImages(new Array(res.length + 1).fill(null));
    changeBgImage(pantone[inputValue], story_path);
    setOnLoadPages(false);
    // Here you can define other actions to take on form submission,
    // like sending the input value to an API or updating another part of your component state.
  };
  const updateItemAtIndex = (index, newValue) => {
    setImages((prevList) =>
      prevList.map((item, idx) => (idx === index ? newValue : item))
    );
  };
  const updateSetOnLoadScene = (index, newValue) => {
    setOnLoadScene((prevList) =>
      prevList.map((item, idx) => (idx === index ? newValue : item))
    );
  };
  const handleCharacterDescription = async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();
    // for page in pages add False to onLoadScene + 1 for the character

    setOnLoadCharacter(true);
    console.log(`Passing storypath as ${storyPath}`);
    const res = await generate_character(pantone[inputValue], pages, storyPath);
    console.log(res);
    setCharacterDescription(res.description);
    console.log("character description");
    console.log(characterDescription);
    console.log("images");
    console.log(images);
    console.log("onLoadScene");
    console.log(onLoadScene);

    if (images.length === 0) {
      setImages([res.image]);
    } else {
      updateItemAtIndex(0, res.image);
    }
    setOnLoadCharacter(false);
    // Here you can define other actions to take on form submission,
    // like sending the input value to an API or updating another part of your component state.
  };
  const sceneImages = async (num) => {
    updateSetOnLoadScene(num, true);
    const res = await generate_scene_image(
      pantone[inputValue],
      pages[num - 1],
      storyPath,
      characterDescription,
      num,
      style,
      genID
    );
    console.log(res);
    updateItemAtIndex(num, res.image);
    updateSetOnLoadScene(num, false);
  };
  const generateAllSceneImages = async (event) => {
    event.preventDefault();
    for (let num = 1; num < pages.length + 1; num++) {
      sceneImages(num);
    }
  };
  const handleGenerateSceneImage = async (event, num) => {
    event.preventDefault();
    console.log("EVENT NUM");
    console.log(num);
    updateSetOnLoadScene(num, true);
    const res = await generate_scene_image(
      pantone[inputValue],
      pages[num - 1],
      storyPath,
      characterDescription,
      num,
      style,
      genID
    );
    console.log(res);

    updateItemAtIndex(num, res.image);
    updateSetOnLoadScene(num, false);
  };

  return (
    <NextUIProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <div className="flex flex-col items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-5xl font-bold">
                Little {name} Riding Hood Generator
              </h1>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: hexColor,
                  marginLeft: "20px",
                }}
              ></div>
            </div>

            <div className="flex flex-col items-center justify-between">
              {/* iterate throught the list pages and show then on a p tag */}
              {pages.length === 0 ? (
                <InitialInput
                  handleSubmit={handleSubmit}
                  mapColor={mapColor}
                  handleColorPickerChange={handleColorPickerChange}
                  inputValue={inputValue}
                  handleChange={handleChange}
                  colorPicker={colorPicker}
                  onLoadPages={onLoadPages}
                />
              ) : (
                <div className="flex flex-col items-center justify-between">
                  <DisplayPages name={name} pages={pages} />
                  <GenerateCharacter
                    textColor={getFontColorForBackground(pantone[inputValue])}
                    hexColor={hexColor}
                    handleCharacterDescription={handleCharacterDescription}
                    onLoadCharacter={onLoadCharacter}
                    characterDescription={characterDescription}
                  />
                  {typeof characterDescription === "string" &&
                  characterDescription.length > 0 ? (
                    <div>
                      <Character
                        characterDescription={characterDescription}
                        images={images}
                        textColor={getFontColorForBackground(
                          pantone[inputValue]
                        )}
                        hexColor={hexColor}
                        handleCharacterDescription={handleCharacterDescription}
                      />
                      <GenerateImages
                        textColor={getFontColorForBackground(
                          pantone[inputValue]
                        )}
                        hexColor={hexColor}
                        generateAllSceneImages={generateAllSceneImages}
                      />
                      {pages.map((page, index) => {
                        return images[index + 1] === null ? (
                          <div key={index + 1}>
                            {onLoadScene[index + 1] ? (
                              <div>
                                <Spinner
                                  label={`Loading page ${index + 1}`}
                                  style={{
                                    foreground: hexColor,
                                  }}
                                />
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        ) : (
                          <DisplayImages
                            key={index + 1}
                            page={page}
                            index={index}
                            images={images}
                            handleGenerateSceneImage={handleGenerateSceneImage}
                            textColor={getFontColorForBackground(
                              pantone[inputValue]
                            )}
                            hexColor={hexColor}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <h1 className="text-2xl font-bold pt-6">
                      {characterDescription}
                    </h1>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* idea for later, implement a color picker and map it to pantone color */}
        </div>
      </main>
    </NextUIProvider>
  );
}
