import React from "react";
import { Button } from "@nextui-org/react";
const GenerateCharacter = ({
  textColor,
  hexColor,
  handleCharacterDescription,
}) => {
  return (
    <div>
      <h1 className="text-2xl font-bold pt-6">
        Click to generate character description and image
      </h1>
      <Button
        type="submit"
        style={{
          color: textColor,
          backgroundColor: hexColor,
        }}
        onClick={handleCharacterDescription}
      >
        Generate Character
      </Button>
    </div>
  );
};

export default GenerateCharacter;
