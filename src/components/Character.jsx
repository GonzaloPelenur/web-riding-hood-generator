import React from "react";
import { Button } from "@nextui-org/react";

const Character = ({
  characterDescription,
  images,
  textColor,
  hexColor,
  handleCharacterDescription,
}) => {
  return (
    <div>
      <h1 className="text-2xl font-bold pt-6">
        Here is the character description and image
      </h1>
      <p>{characterDescription}</p>
      <img src={`data:image/png;base64,${images[0]}`} alt="character" />
      <Button
        type="submit"
        style={{
          color: textColor,
          backgroundColor: hexColor,
        }}
        onClick={handleCharacterDescription}
      >
        Regenerate Character
      </Button>
    </div>
  );
};

export default Character;
