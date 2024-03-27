"use client";
import { useState } from "react";
import pantone from "../data/pantone-colors-by-key.json";

async function getData() {
  try {
    const response = await fetch("api/openAI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ test: "test" }),
    });

    if (response.ok) {
      console.log("API request successful!");
      const data = await response.json();
      setGeneratedText(data.result);
      setTextIsLoading(false);
    } else {
      console.error("API request failed");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

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
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

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
              <div>
                <h1 className="text-2xl font-bold pt-6">
                  Enter a pantone color and click submit to generate a story
                </h1>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                  />
                  {/* Add a submit button to the form */}
                  <button type="submit">Submit</button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-between">
                <h1 className="text-2xl font-bold pt-6">
                  Here's the script for Little {name} Riding Hood
                </h1>
                {pages.map((page, index) => (
                  <p key={index}>
                    [{index + 1}]: {page}
                  </p>
                ))}
                <div>
                  <h1 className="text-2xl font-bold pt-6">
                    Click to generate character description and image
                  </h1>
                  <button
                    type="submit"
                    style={{
                      color: getFontColorForBackground(pantone[inputValue]),
                      backgroundColor: hexColor,
                    }}
                    className="button-regenerate"
                    onClick={handleCharacterDescription}
                  >
                    Generate Character
                  </button>
                </div>
                {console.log(typeof characterDescription)}
                {typeof characterDescription === "string" &&
                characterDescription.length > 0 ? (
                  <div>
                    <p>{characterDescription}</p>
                    <img
                      src={`data:image/png;base64,${images[0]}`}
                      alt="character"
                    />
                    <h1 className="text-2xl font-bold pt-6">
                      Click to generate all images
                    </h1>
                    <form onSubmit={(event) => generateAllSceneImages(event)}>
                      <button type="submit">Generate</button>
                    </form>
                    {/* for page in pages call handle generate scence and add the key as the page index and make a button bellow every image that says regenerate and calls handle generate scence with the page index as num  */}
                    {pages.map((page, index) => {
                      // Explicitly return the JSX
                      return images[index + 1] === null ? (
                        <div key={index + 1}>
                          {onLoadScene[index + 1] ? (
                            <p>Loading page {index + 1}...</p>
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        <div key={index + 1}>
                          {" "}
                          {/* Ensure each key is unique and moved it to the correct position */}
                          <img
                            src={`data:image/png;base64,${images[index + 1]}`}
                            alt="scene"
                          />
                          <p>{page}</p>
                          <form
                            onSubmit={(event) =>
                              handleGenerateSceneImage(event, index + 1)
                            }
                          >
                            <button
                              type="submit"
                              style={{
                                color: getFontColorForBackground(
                                  pantone[inputValue]
                                ),
                                backgroundColor: hexColor,
                              }}
                              className="button-regenerate"
                            >
                              Regenerate
                            </button>
                          </form>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <h1 className="text-2xl font-bold pt-6">
                    {characterDescription}
                  </h1>
                )}
                {/* place a text if onLoad is true */}
                {onLoadCharacter && (
                  <div>
                    <p>Generating character description and image...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* idea for later, implement a color picker and map it to pantone color */}
      </div>
    </main>
  );
}
