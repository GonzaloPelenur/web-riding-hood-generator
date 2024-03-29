import React from "react";
import { Button } from "@nextui-org/react";
const DisplayImages = ({
  page,
  index,
  images,
  handleGenerateSceneImage,
  textColor,
  hexColor,
}) => {
  return (
    <div key={index + 1}>
      {" "}
      {/* Ensure each key is unique and moved it to the correct position */}
      <img src={`data:image/png;base64,${images[index + 1]}`} alt="scene" />
      <p>{page}</p>
      <form onSubmit={(event) => handleGenerateSceneImage(event, index + 1)}>
        <Button
          type="submit"
          style={{
            color: textColor,
            backgroundColor: hexColor,
          }}
          className="button-regenerate"
        >
          Regenerate
        </Button>
      </form>
    </div>
  );
};

export default DisplayImages;
